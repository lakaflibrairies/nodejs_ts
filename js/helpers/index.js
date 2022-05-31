"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailTemplateHelper_1 = __importDefault(require("./mailTemplateHelper"));
const phoneHelper_1 = __importDefault(require("./phoneHelper"));
const mailHelper_1 = __importDefault(require("./mailHelper"));
const authHelper_1 = __importDefault(require("./authHelper"));
const logsHelper_1 = __importDefault(require("./logsHelper"));
const customConsoleHelper_1 = __importDefault(require("./customConsoleHelper"));
const helpers = {
    generateKey(length) {
        var result = "";
        const dictionary = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            result += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
        }
        return result;
    },
    mail: mailHelper_1.default,
    phone: phoneHelper_1.default,
    mailTemplate: mailTemplateHelper_1.default,
    auth: authHelper_1.default,
    logs: logsHelper_1.default,
    customConsole: customConsoleHelper_1.default
};
exports.default = helpers;
