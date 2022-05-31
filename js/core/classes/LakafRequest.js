"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LakafBaseRequest_1 = __importDefault(require("./LakafBaseRequest"));
class LakafRequest extends LakafBaseRequest_1.default {
    constructor(rules, urlRules, checkIntruders = true) {
        super(rules, urlRules, checkIntruders);
    }
    validate(req, res) {
        let validation = this.validation(req);
        if (!validation.success) {
            res.json({
                failure: true,
                report: validation.message,
            });
            return [undefined, res];
        }
        validation = this.urlValidation(req);
        if (!validation.success) {
            res.json({
                failure: true,
                report: validation.message,
            });
            return [undefined, res];
        }
        return [req, res];
    }
    validateWithoutSendResponse(req, res) {
        let validation = this.validation(req);
        if (!validation.success) {
            return [undefined, res, validation];
        }
        validation = this.urlValidation(req);
        if (!validation.success) {
            return [undefined, res, validation];
        }
        return [req, res, validation];
    }
}
exports.default = LakafRequest;
