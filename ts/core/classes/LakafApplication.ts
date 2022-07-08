import express, { Express, NextFunction, Request, Response } from "express";
import { Config, Json, StorageConfig } from "../types/index";
import LakafRouting from "./LakafRouting";
import LakafAbstract from "./LakafAbstract";
import env from "../../env";

export default class LakafApplication extends LakafAbstract {
  /** @readonly */
  readonly application: Express;

  constructor(config: Config = env.config) {
    super();
    this.application = express();

    this.initApplication();
    if (config && config.corsConfig) {
      this.injectCorsSecurity(config.corsConfig);
      this.setXPoweredHeader("LaKaf");
      
    }

    if (env.maintenance === "disabled") {
      
      if (config && config.storagePath) {
        this.setStaticStorage(config.storagePath, config.storeFolders);
      }
      
      if (config && config.viewConfig) {
        this.setViews(config.viewConfig);
      }
    }
  }

  get app() {
    return this.application;
  }

  /** 
    * @private 
    */
  private initApplication(): void {
    this.application.use(express.json());
    this.application.use(express.urlencoded({ extended: true }));
  }

  /** 
    * @private
    * @param { Record<string, any> } corsConfig
    */
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

  /** 
    * @private
    * @param { string } by
    */
  private setXPoweredHeader(by: string): void {
    this.application.use((req: Request, res: Response, next: NextFunction) => {
      res.set({ "X-Powered-By": by });
      next();
    });
  }

  /** 
    * @param { string } storagePath
    * @param { Record<string, any> } storeFolders
    */
  setStaticStorage(storagePath: string, storeFolders: Json): void {
    for (let key in storeFolders) {
      this.application.use(
        `/${key}`,
        express.static(`${storagePath}/${storeFolders[key]}`)
      );
    }
  }

  /** 
    * @param { StorageConfig } storageConfig
    */
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

  /** 
    * @param {{ engine: string; folder: string; }} param0
    */
  setViews({ engine, folder }: { engine: string; folder: string }): void {
    this.application.set("views", folder);
    this.application.set("view-engine", engine);
  }

  /**
    * @param { string } base
    * @param { LakafRouting } routing
    */
  injectRouting(base: string, routing: LakafRouting): void {
    if (env.maintenance === "disabled") {
      this.application.use(base, routing.design());
    } else {
      this.application.use("/*", (req, res) => {
        res.send("Maintenance Mode enabled !");
      });
    }
  }
}
