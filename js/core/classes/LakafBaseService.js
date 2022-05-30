import * as bcrypt from "bcryptjs";
import { verify, decode, sign } from "jsonwebtoken";
import env from "../../env";
import LakafAbstract from "./LakafAbstract";
export default class LakafBaseService extends LakafAbstract {
    constructor() {
        super();
        this.jwtKey = env.jwtKey;
        this.crypt = bcrypt;
        this.jwt = { decode, sign, verify };
    }
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
    sendCodeByMail(to, title, code) {
        return new Promise((resolve, reject) => {
            this.helpers
                .mail()
                .to(to)
                .subject(title)
                .htmlContent(this.helpers.mailTemplate.signup.default(code))
                .send((error, info) => {
                if (error) {
                    reject(error);
                }
                resolve(info);
            });
        });
    }
    sendResetPasswordCodeByMail(to, title, code) {
        return new Promise((resolve, reject) => {
            this.helpers
                .mail()
                .to(to)
                .subject(title)
                .htmlContent(this.helpers.mailTemplate.notConnected.resetPassword(code))
                .send((error, info) => {
                if (error) {
                    reject(error);
                }
                resolve(info);
            });
        });
    }
    extractAndDecodeToken(authorization) {
        return this.jwt.decode(this.helpers.auth.extractToken(authorization));
    }
    computedTotalPages(totalItems, itemsPerPage) {
        const rest = totalItems % itemsPerPage;
        const dividing = totalItems - rest;
        return rest === 0 ? dividing / itemsPerPage : 1 + dividing / itemsPerPage;
    }
}
