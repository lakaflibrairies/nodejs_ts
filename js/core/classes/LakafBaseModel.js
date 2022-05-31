"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LakafAbstract_1 = __importDefault(require("./LakafAbstract"));
const LakafDatabase_1 = __importDefault(require("./LakafDatabase"));
class LakafBaseModel extends LakafAbstract_1.default {
    constructor() {
        super();
        this.engine = new LakafDatabase_1.default();
        this.connection = this.engine.dbEng;
    }
}
exports.default = LakafBaseModel;
