"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./core/utils");
const path_1 = __importDefault(require("path"));
const isProduction = utils_1.findProcessModeFromCommand() === "production";
const projectFolder = path_1.default.resolve(__dirname, "../../../../"); // This path is calculated from this env file.
const projectEnv = require(projectFolder + "/env");
const defaultEnv = {
    PORT: isProduction ? 3030 : 12400,
    HOST: "localhost",
    maintenance: "disabled",
    mode: utils_1.findProcessModeFromCommand(),
    config: {
        authorizationTokenPrefix: "lakaf-token",
        useRealtime: true,
        corsConfig: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        },
    },
    dbConfig: {
        database: "localdb",
        host: isProduction ? "localhost" : "localhost",
        user: isProduction ? "root" : "root",
        password: isProduction ? "root" : "password",
        type: "mysql",
    },
    mailConfig: {
        emailSender: isProduction ? "user@domain.ext" : "user@domain.ext",
        emailPassword: isProduction ? "password" : "password",
        emailService: isProduction ? "" : "",
        emailPort: isProduction ? 465 : 465,
        emailHost: isProduction ? "mail.domain.ext" : "mail.domain.ext"
    },
    jwtKey: "*€$/sfgfrsfs~super_salt~45646846",
    clientUrl: isProduction ? "https://www.client-domain.ext" : "http://localhost:8080",
    logConfig: {
        extension: "json",
        logsFolder: "",
        showInConsole: false
    },
    storageConfig: {
        archive: {
            folder: "",
            middleware: []
        },
        audio: {
            folder: "",
            middleware: []
        },
        captcha_image: {
            folder: "",
            middleware: []
        },
        css: {
            folder: "",
            middleware: []
        },
        document: {
            folder: "",
            middleware: []
        },
        i18n: {
            folder: "",
            middleware: []
        },
        image: {
            folder: "",
            middleware: []
        },
        javascript: {
            folder: "",
            middleware: []
        },
        other: {
            folder: "",
            middleware: []
        },
        text: {
            folder: "",
            middleware: []
        },
        video: {
            folder: "",
            middleware: []
        },
        voice: {
            folder: "",
            middleware: []
        },
    },
    uploadConfig: {
        limits: {
            // 1048576 = 1 M
            audio: 1048576,
            image: 1048576,
            document: 1048576,
            video: 1048576
        }
    }
};
// computeEnv is not up to date. It will enhanced perform env computing.
function computeEnv() {
    for (let key in projectEnv) {
        if (typeof defaultEnv[key] === "object") {
            defaultEnv[key] = Object.assign(Object.assign({}, defaultEnv[key]), projectEnv[key]);
        }
        else {
            defaultEnv[key] = projectEnv[key];
        }
    }
    return defaultEnv;
}
const env = computeEnv();
exports.default = env;
