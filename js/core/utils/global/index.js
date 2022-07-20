"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../../../env"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function formatDateTime(
/** @type {{ toFormat: Date; separator?: string; }} */ data) {
    const { toFormat, separator = "-" } = data;
    return (toFormat.getUTCFullYear() +
        separator +
        ("0" + (toFormat.getUTCMonth() + 1)).slice(-2) +
        separator +
        ("0" + toFormat.getUTCDate()).slice(-2) +
        " " +
        ("0" + toFormat.getUTCHours()).slice(-2) +
        ":" +
        ("0" + toFormat.getUTCMinutes()).slice(-2) +
        ":" +
        ("0" + toFormat.getUTCSeconds()).slice(-2));
}
const { logConfig } = env_1.default;
const LakafLogger = {
    saveLog,
    console,
};
/** @param { string } name @returns { Promise<void> } */
function makeSubDirLogIfNotExists(name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs_1.default.existsSync(path_1.default.resolve(logConfig.logsFolder, name))) {
            return;
        }
        fs_1.default.mkdirSync(path_1.default.resolve(logConfig.logsFolder, name));
    });
}
function saveLog(type = "basic", title, content) {
    const timest = Date.now();
    const logValue = logConfig.extension === "json"
        ? JSON.stringify({ type, title, content })
        : `${title}
    type: ${type}
    
    ${content}
    
    
    ${timest}`;
    makeSubDirLogIfNotExists(type).then(() => {
        fs_1.default.writeFileSync(path_1.default.resolve(logConfig.logsFolder, type, `${timest}.${logConfig.extension}`), logValue);
        logConfig.showInConsole && console.log(logValue);
    });
}
global.formatDateTime = formatDateTime;
global.LakafLogger = LakafLogger;
