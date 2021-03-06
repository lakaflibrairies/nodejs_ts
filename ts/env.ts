import { EnvTemplate } from "./core/types";
import { findProcessModeFromCommand, requireUncached } from "./core/utils";
import path from "path";

const isProduction = findProcessModeFromCommand() === "production";

const projectFolder = path.resolve(__dirname, "../../../../"); // This path is calculated from this env file.

const projectEnv = requireUncached(projectFolder + "/env") as EnvTemplate;

const defaultEnv: EnvTemplate = {
  PORT: isProduction ? 3030 : 12400,
  HOST: "localhost",
  maintenance: "disabled",
  mode: findProcessModeFromCommand(),
  config: {
    authorizationTokenPrefix: "lakaf-token",
    useRealtime: true,
    corsConfig: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
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
    extension: "txt",
    logsFolder: path.resolve(projectFolder, "logs"), // logsFolder: path.resolve(__dirname, "logs") This is an example value. In this case, __dirname represents a folder that to use for save logs
    showInConsole: false
  },
  storageConfig: {
    archive: {
      folder: path.resolve(projectFolder, "storage", "archives"), // path.resolve(__dirname, "storage", "archives") for example, with __dirname corresponding to folder to use
      middleware: []
    },
    audio: {
      folder: path.resolve(projectFolder, "storage", "audios"), // path.resolve(__dirname, "storage", "audios") for example, with __dirname corresponding to folder to use
      middleware: []
    },
    captcha_image: {
      folder: path.resolve(projectFolder, "storage", "captcha_images"), // path.resolve(__dirname, "storage", "captcha_images") for example, with __dirname corresponding to folder to use
      middleware: []
    },
    css: {
      folder: path.resolve(projectFolder, "storage", "css"), // path.resolve(__dirname, "storage", "css") for example, with __dirname corresponding to folder to use
      middleware: []
    },
    document: {
      folder: path.resolve(projectFolder, "storage", "documents"), // path.resolve(__dirname, "storage", "documents") for example, with __dirname corresponding to folder to use
      middleware: []
    },
    i18n: {
      folder: path.resolve(projectFolder, "storage", "i18n"), // path.resolve(__dirname, "storage", "i18nFiles") for example, with __dirname corresponding to folder to use
      middleware: []
    },
    image: {
      folder: path.resolve(projectFolder, "storage", "images"), // path.resolve(__dirname, "storage", "images") for example, with __dirname corresponding to folder to use
      middleware: []
    },
    javascript: {
      folder: path.resolve(projectFolder, "storage", "javascript"), // path.resolve(__dirname, "storage", "javascript") for example, with __dirname corresponding to folder to use
      middleware: []
    },
    other: {
      folder: path.resolve(projectFolder, "storage", "archives"), // path.resolve(__dirname, "storage", "archives") for example, with __dirname corresponding to folder to use
      middleware: []
    },
    text: {
      folder: path.resolve(projectFolder, "storage", "texts"), // path.resolve(__dirname, "storage", "texts") for example, with __dirname corresponding to folder to use
      middleware: []
    },
    video: {
      folder: path.resolve(projectFolder, "storage", "videos"), // path.resolve(__dirname, "storage", "videos") for example, with __dirname corresponding to folder to use
      middleware: []
    },
    voice: {
      folder: path.resolve(projectFolder, "storage", "voices"), // path.resolve(__dirname, "storage", "voices") for example, with __dirname corresponding to folder to use
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
function computeEnv(): EnvTemplate {
  for (let key in projectEnv) {
    if (typeof defaultEnv[key] === "object") {
      defaultEnv[key] = { ...defaultEnv[key], ...projectEnv[key] };
    } else {
      defaultEnv[key] = projectEnv[key];
    }
  }
  return defaultEnv;
}

const env: EnvTemplate = computeEnv();

export default env;
