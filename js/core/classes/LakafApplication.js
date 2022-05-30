import express from "express";
import LakafAbstract from "./LakafAbstract";
import env from "../../env";
export default class LakafApplication extends LakafAbstract {
    constructor(config) {
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
    initApplication() {
        this.application.use(express.json());
        this.application.use(express.urlencoded({ extended: true }));
    }
    injectCorsSecurity(corsConfig) {
        this.application.use((req, res, next) => {
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
    setXPoweredHeader(by) {
        this.application.use((req, res, next) => {
            res.set({ "X-Powered-By": by });
            next();
        });
    }
    setStaticStorage(storagePath, storeFolders) {
        for (let key in storeFolders) {
            this.application.use(key, express.static(`${storagePath}/${storeFolders[key]}`));
        }
    }
    setCustomStorage(storageConfig) {
        for (let key in storageConfig) {
            if (storageConfig[key].middleware && storageConfig[key].middleware.length !== 0) {
                this.application.use(key, ...storageConfig[key].middleware, express.static(storageConfig[key].folder));
            }
            else {
                this.application.use(key, express.static(storageConfig[key].folder));
            }
        }
    }
    setViews({ engine, folder }) {
        this.application.set("views", folder);
        this.application.set("view-engine", engine);
    }
    injectRouting(base, routing) {
        if (env.maintenance === "disabled") {
            this.application.use(base, routing.design());
        }
        else {
            this.application.get("", (req, res) => {
                res.send("Maintenance Mode enabled !");
            });
        }
    }
}
