import LakafMiddleware from "../../../classes/LakafMiddleware";
import { AllowedFileTypes } from "../../../types/index";
import { Express, Request } from "express";
import multer, { Multer } from "multer";
import env from "../../../../env";

export default class FileManagerMiddleware extends LakafMiddleware {
  protected storageConfig: typeof env.storageConfig = env.storageConfig;
  protected uploadConfig: typeof env.uploadConfig = env.uploadConfig;

  constructor(private allowedStrategies: AllowedFileTypes[]) {
    super();
  }

  /** @protected */
  protected mimeTypeToDestinationFolder(
    mt: string,
    cb?: { (mt: string): { status: boolean; dest: string } }
  ): string {
    let [nature, type]: string[] = mt.split("/"),
      destinationFolder: string = this.storageConfig.other.folder;

    if (this.allowedStrategies.includes(nature as AllowedFileTypes)) {
      return  this.storageConfig[nature].folder;
    }

    if (!cb) {
      return this.storageConfig.other.folder;
    }

    const report: { status: boolean; dest: string } = cb(mt);

    if (report.status) {
      destinationFolder = report.dest;
    } else {
      destinationFolder = this.storageConfig.other.folder;
    }

    return destinationFolder;
  }

  /** @protected */
  protected storage(
    nature: string,
    cb?: { (mt: string): { status: boolean; dest: string } }
  ) {
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

  /** @protected */
  protected fileFilter(
    nature: string,
    sizeLimit: number | "infinite",
    errorMessage: string,
    fileTypeValidator: { [key: string]: { (mt: string): boolean } }
  ) {
    if (!fileTypeValidator.hasOwnProperty(nature)) {
      return (
        req: Request,
        file: Express.Multer.File,
        callback: multer.FileFilterCallback
      ) => {
        req.body["multer_error"] = "Not supported uploaded file...";
        callback(null, false);
      };
    }

    return (
      req: Request,
      file: Express.Multer.File,
      callback: multer.FileFilterCallback
    ) => {
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
  protected generateUploader(
    nature: string,
    sizeLimit: number | "infinite",
    uploadType: "single" | "array",
    fileTypeValidator: Record<string, (mt: string) => boolean>,
    errorMessages: { [key: string]: string }
  ) {
    const uploader = multer({
      storage: this.storage(nature),
      fileFilter: this.fileFilter(
        nature,
        sizeLimit,
        errorMessages[nature],
        fileTypeValidator
      ),
    });

    if (uploadType === "single") return uploader.single("file");

    if (uploadType === "array") return uploader.array("files");

    return uploader.single("file");
  }
}
