"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth = {
    extractToken(authorization) {
        return authorization
            .replace(".super_salt.", "")
            .replace("lakaf-token", "")
            .trim();
    },
};
exports.default = auth;
