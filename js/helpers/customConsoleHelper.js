"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../env"));
const customConsole = {
    log(message, ...optionalParams) {
        if (env_1.default.mode === "production") {
            console.log(message, ...optionalParams);
        }
        return;
    },
    error(message, ...optionalParams) {
        if (env_1.default.mode === "production") {
            console.error(message, ...optionalParams);
        }
        return;
    },
};
exports.default = customConsole;
