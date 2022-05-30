import express, { Express, NextFunction, Request, Response } from "express";
import { Config, Json, StorageConfig } from "../types/index";
import LakafRouting from "./LakafRouting";
import LakafAbstract from "./LakafAbstract";
import env from "../../env";

export default class LakafApplication extends LakafAbstract {
  readonly application: Express;

  constructor(config?: Config) {
    super();
    this.application = express();

    this.initApplication();
    if (config && config.corsConfig) {
      this.injectCorsSecurity(config.corsConfig);
      this.setXPoweredHeader("LaKaf");
      
    }

    if (config && config.storagePath) {
      this.setStaticStorage(config.storagePath, config.storeFolders);
    }

    if (config && config.viewConfig) {
      this.setViews(config.viewConfig);
    }
  }

  get app() {
    return this.application;
  }

  private initApplication(): void {
    this.application.use(express.json());
    this.application.use(express.urlencoded({ extended: true }));
  }

  private injectCorsSecurity(corsConfig: Json) {
    this.application.use((req: Request, res: Response, next: NextFunction) => {
      if (Object.keys(corsConfig).length > 0) {
        for (let key in corsConfig) {
          if (corsConfig.hasOwnProperty(key)) {
            res.setHeader(key, corsConfig[key]);
          }
        }
      }
      next();
    });
  }

  private setXPoweredHeader(by: string): void {
    this.application.use((req: Request, res: Response, next: NextFunction) => {
      res.set({ "X-Powered-By": by });
      next();
    });
  }

  setStaticStorage(storagePath: string, storeFolders: Json): void {
    for (let key in storeFolders) {
      this.application.use(
        key,
        express.static(`${storagePath}/${storeFolders[key]}`)
      );
    }
  }

  setCustomStorage(storageConfig: StorageConfig) {
    for (let key in storageConfig) {
      if (
        storageConfig[key].middleware && storageConfig[key].middleware.length !== 0
      ) {
        this.application.use(
          key,
          ...storageConfig[key].middleware,
          express.static(storageConfig[key].folder)
        )
      } else {
        this.application.use(
          key,
          express.static(storageConfig[key].folder)
        )
      }
    }
  }

  setViews({ engine, folder }: { engine: string; folder: string }): void {
    this.application.set("views", folder);
    this.application.set("view-engine", engine);
  }

  injectRouting(base: string, routing: LakafRouting): void {
    if (env.maintenance === "disabled") {
      this.application.use(base, routing.design());
    } else {
      this.application.get("", (req, res) => {
        res.send("Maintenance Mode enabled !");
      });
    }
  }
}
