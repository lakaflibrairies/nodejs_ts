"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUncached = exports.findProcessModeFromCommand = void 0;
function findProcessModeFromCommand() {
    return process.argv.includes("development") ? "development" : "production";
}
exports.findProcessModeFromCommand = findProcessModeFromCommand;
function requireUncached(/** @type { string } */ module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}
exports.requireUncached = requireUncached;
