"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProcessModeFromCommand = void 0;
function findProcessModeFromCommand() {
    return process.argv.includes("development") ? "development" : "production";
}
exports.findProcessModeFromCommand = findProcessModeFromCommand;
