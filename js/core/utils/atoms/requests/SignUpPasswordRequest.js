"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LakafRequest_1 = __importDefault(require("../../../classes/LakafRequest"));
class SignUpPasswordRequest extends LakafRequest_1.default {
    constructor() {
        super({
            password: {
                required: { messageOnFail: "password field is required." },
                text: {
                    minLength: 7,
                    messageOnFail: "password field must contain more than 7 characters",
                },
            },
        });
    }
}
exports.default = SignUpPasswordRequest;
