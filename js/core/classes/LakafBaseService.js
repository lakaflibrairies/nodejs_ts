"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcryptjs"));
const jsonwebtoken_1 = require("jsonwebtoken");
const env_1 = __importDefault(require("../../env"));
const LakafAbstract_1 = __importDefault(require("./LakafAbstract"));
class LakafBaseService extends LakafAbstract_1.default {
    constructor() {
        super();
        this.jwtKey = env_1.default.jwtKey;
        this.crypt = bcrypt;
        this.jwt = { decode: jsonwebtoken_1.decode, sign: jsonwebtoken_1.sign, verify: jsonwebtoken_1.verify };
    }
    /** @protected */
    formatDateTime(data) {
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
    /**
     * @protected
     * @param { string } to
     * @param { string } title
     * @param { string } htmlContent
     *
     * @returns { Promise<any> }
     */
    sendMail(to, title, htmlContent) {
        return new Promise((resolve, reject) => {
            this.helpers
                .mail()
                .to(to)
                .subject(title)
                .htmlContent(htmlContent)
                .send((error, info) => {
                if (error) {
                    reject(error);
                }
                resolve(info);
            });
        });
    }
    /** @protected */
    sendCodeByMail(to, title, code) {
        return this.sendMail(to, title, this.helpers.mailTemplate.signup.default(code));
    }
    /** @protected */
    sendResetPasswordCodeByMail(to, title, code) {
        return this.sendMail(to, title, this.helpers.mailTemplate.notConnected.resetPassword(code));
    }
    /** @protected */
    extractAndDecodeToken(authorization) {
        return this.jwt.decode(this.helpers.auth.extractToken(authorization));
    }
    /** @protected */
    computedTotalPages(totalItems, itemsPerPage) {
        const rest = totalItems % itemsPerPage;
        const dividing = totalItems - rest;
        return rest === 0 ? dividing / itemsPerPage : 1 + dividing / itemsPerPage;
    }
}
exports.default = LakafBaseService;
