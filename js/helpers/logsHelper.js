"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const logs = {
    generateLogFile(location, content) {
        fs_1.default.writeFileSync(location, content instanceof Error ? JSON.stringify(content) : content);
    },
};
exports.default = logs;
