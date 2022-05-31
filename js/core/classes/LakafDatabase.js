"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("mysql");
const LakafAbstract_1 = __importDefault(require("./LakafAbstract"));
const env_1 = __importDefault(require("../../env"));
class LakafDatabase extends LakafAbstract_1.default {
    constructor() {
        super();
        if (!env_1.default.dbConfig) {
            console.error("No database configuration has not been provided in env.* file");
            return;
        }
        this.start();
    }
    /** @private */
    onConnection(error) {
        if (error) {
            console.error("Fail to connect to database.");
        }
        else {
            console.log("Connected to database.");
        }
    }
    get dbEng() {
        return this.engine;
    }
    start() {
        this.engine = mysql_1.createConnection(env_1.default.dbConfig);
        this.engine.connect(this.onConnection);
    }
    stop() {
        this.engine.end();
    }
    refresh() {
        this.stop();
        this.start();
    }
}
exports.default = LakafDatabase;
