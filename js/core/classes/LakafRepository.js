"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("mysql");
const LakafBaseRepository_1 = __importDefault(require("./LakafBaseRepository"));
class LakafRepository extends LakafBaseRepository_1.default {
    constructor(modelToUse) {
        super(modelToUse);
    }
    getElementById(id) {
        return new Promise((resolve, reject) => {
            this.model
                .read([], { WHERE: "id = " + mysql_1.escape(id) })
                .then((result) => {
                resolve(result.length > 0 ? result[0] : null);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
}
exports.default = LakafRepository;
