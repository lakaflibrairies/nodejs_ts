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
    /** @private */
    initApplication() {
        this.application.use(express_1.default.json());
        this.application.use(express_1.default.urlencoded({ extended: true }));
    }
    /** @private */
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
    /** @private */
    setXPoweredHeader(by) {
        this.application.use((req, res, next) => {
            res.set({ "X-Powered-By": by });
            next();
        });
    }
    setStaticStorage(storagePath, storeFolders) {
        for (let key in storeFolders) {
            this.application.use(key, express_1.default.static(`${storagePath}/${storeFolders[key]}`));
        }
    }
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
    setViews({ engine, folder }) {
        this.application.set("views", folder);
        this.application.set("view-engine", engine);
    }
    injectRouting(base, routing) {
        if (env_1.default.maintenance === "disabled") {
            this.application.use(base, routing.design());
        }
        else {
            this.application.get("", (req, res) => {
                res.send("Maintenance Mode enabled !");
            });
        }
    }
}
exports.default = LakafApplication;
