"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LakafAbstract_1 = __importDefault(require("./LakafAbstract"));
const env_1 = __importDefault(require("../../env"));
class LakafApplication extends LakafAbstract_1.default {
    constructor(config = env_1.default.config) {
        super();
        this.application = express_1.default();
        this.initApplication();
        if (config && config.corsConfig) {
            this.injectCorsSecurity(config.corsConfig);
            this.setXPoweredHeader("LaKaf");
        }
        if (env_1.default.maintenance === "disabled") {
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
    initApplication() {
        this.application.use(express_1.default.json());
        this.application.use(express_1.default.urlencoded({ extended: true }));
    }
    /**
      * @private
      * @param { Record<string, any> } corsConfig
      */
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
    /**
      * @private
      * @param { string } by
      */
    setXPoweredHeader(by) {
        this.application.use((req, res, next) => {
            res.set({ "X-Powered-By": by });
            next();
        });
    }
    /**
      * @param { string } storagePath
      * @param { Record<string, any> } storeFolders
      */
    setStaticStorage(storagePath, storeFolders) {
        for (let key in storeFolders) {
            this.application.use(`/${key}`, express_1.default.static(`${storagePath}/${storeFolders[key]}`));
        }
    }
    /**
      * @param { StorageConfig } storageConfig
      */
    setCustomStorage(storageConfig) {
        for (let key in storageConfig) {
            if (storageConfig[key].middleware && storageConfig[key].middleware.length !== 0) {
                this.application.use(key, ...storageConfig[key].middleware, express_1.default.static(storageConfig[key].folder));
            }
            else {
                this.application.use(key, express_1.default.static(storageConfig[key].folder));
            }
        }
    }
    /**
      * @param {{ engine: string; folder: string; }} param0
      */
    setViews({ engine, folder }) {
        this.application.set("views", folder);
        this.application.set("view-engine", engine);
    }
    /**
      * @param { string } base
      * @param { LakafRouting } routing
      */
    injectRouting(base, routing) {
        if (env_1.default.maintenance === "disabled") {
            this.application.use(base, routing.design());
        }
        else {
            this.application.use("/*", (req, res) => {
                res.send("Maintenance Mode enabled !");
            });
        }
    }
}
exports.default = LakafApplication;
