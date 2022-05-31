"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LakafRequest_1 = __importDefault(require("../../../classes/LakafRequest"));
class PasswordRequest extends LakafRequest_1.default {
    constructor() {
        super({
            password: {
                required: { messageOnFail: "Password field is required." },
                text: {
                    minLength: 1,
                    messageOnFail: "Password field must be not empty.",
                },
            },
        });
    }
}
exports.default = PasswordRequest;
