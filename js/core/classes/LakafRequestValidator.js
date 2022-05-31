"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This is an experimental feature.
// Do not use it inside your project
const express_1 = __importDefault(require("express"));
const LakafAbstract_1 = __importDefault(require("./LakafAbstract"));
/**
 * This is an experimental feature.
 * Do not use it inside your project.
 */
class LakafRequestValidator extends LakafAbstract_1.default {
    constructor() {
        super();
    }
    validate() {
        if (!this.runValidation()) {
            express_1.default.response.json(!this.onFail ? { message: "Not authorized" } : this.onFail.message);
        }
    }
    runValidation() {
        return true;
    }
}
exports.default = LakafRequestValidator;
