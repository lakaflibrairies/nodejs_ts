"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LakafMiddleware_1 = __importDefault(require("../../../classes/LakafMiddleware"));
const multer_1 = __importDefault(require("multer"));
const env_1 = __importDefault(require("../../../../env"));
class FileManagerMiddleware extends LakafMiddleware_1.default {
    constructor(allowedStrategies) {
        super();
        this.allowedStrategies = allowedStrategies;
        this.storageConfig = env_1.default.storageConfig;
        this.uploadConfig = env_1.default.uploadConfig;
    }
    /** @protected */
    mimeTypeToDestinationFolder(mt, cb) {
        let [nature, type] = mt.split("/"), destinationFolder = this.storageConfig.other.folder;
        if (this.allowedStrategies.includes(nature)) {
            return this.storageConfig[nature].folder;
        }
        if (!cb) {
            return this.storageConfig.other.folder;
        }
        const report = cb(mt);
        if (report.status) {
            destinationFolder = report.dest;
        }
        else {
            destinationFolder = this.storageConfig.other.folder;
        }
        return destinationFolder;
    }
    /** @protected */
    storage(nature, cb) {
        return multer_1.default.diskStorage({
            destination: (req, file, callback) => {
                callback(null, this.mimeTypeToDestinationFolder(file.mimetype, cb));
            },
            filename: (req, file, callback) => {
                const extractedExtension = file.originalname.split(".").slice(-1)[0];
                const name = nature + "_file_" + Date.now() + "." + extractedExtension;
                req.body["multer_success"] = {
                    folder: this.mimeTypeToDestinationFolder(file.mimetype),
                    old: file.originalname,
                    current: name,
                    nature,
                };
                callback(null, name);
            },
        });
    }
    /** @protected */
    fileFilter(nature, sizeLimit, errorMessage, fileTypeValidator) {
        if (!fileTypeValidator.hasOwnProperty(nature)) {
            return (req, file, callback) => {
                req.body["multer_error"] = "Not supported uploaded file...";
                callback(null, false);
            };
        }
        return (req, file, callback) => {
            const fileSize = parseInt(req.headers["content-length"]);
            if (fileSize > sizeLimit) {
                req.body["multer_error"] = "Too large file...";
                return callback(null, false);
            }
            if (!fileTypeValidator[nature](file.mimetype)) {
                req.body["multer_error"] = errorMessage;
                return callback(null, false);
            }
            return callback(null, true);
        };
    }
    /** @protected */
    generateUploader(nature, sizeLimit, uploadType, fileTypeValidator, errorMessages) {
        const uploader = multer_1.default({
            storage: this.storage(nature),
            fileFilter: this.fileFilter(nature, sizeLimit, errorMessages[nature], fileTypeValidator),
        });
        if (uploadType === "single")
            return uploader.single("file");
        if (uploadType === "array")
            return uploader.array("files");
        return uploader.single("file");
    }
}
exports.default = FileManagerMiddleware;
