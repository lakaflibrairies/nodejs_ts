"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("mysql");
const LakafAbstract_1 = __importDefault(require("./LakafAbstract"));
class LakafBaseRepository extends LakafAbstract_1.default {
    constructor(modelToUse) {
        super();
        this.escape = mysql_1.escape;
        this.model = modelToUse;
    }
}
exports.default = LakafBaseRepository;
