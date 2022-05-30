import LakafMiddleware from "../../../classes/LakafMiddleware";
import multer from "multer";
import env from "../../../../env";
export default class FileManagerMiddleware extends LakafMiddleware {
    constructor(allowedStrategies) {
        super();
        this.allowedStrategies = allowedStrategies;
        this.storageConfig = env.storageConfig;
        this.uploadConfig = env.uploadConfig;
    }
    mimeTypeToDestinationFolder(mt, cb) {
        let [nature, type] = mt.split("/"), destinationFolder = this.storageConfig.other.folder;
        if (this.allowedStrategies.includes(nature)) {
            destinationFolder = this.storageConfig[nature].folder;
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
    storage(nature, cb) {
        return multer.diskStorage({
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
    generateUploader(nature, sizeLimit, uploadType, fileTypeValidator, errorMessages) {
        const uploader = multer({
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
