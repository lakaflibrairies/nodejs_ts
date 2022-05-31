"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LakafRequest_1 = __importDefault(require("../../../classes/LakafRequest"));
class EmailRequest extends LakafRequest_1.default {
    constructor() {
        super({
            email: {
                required: { messageOnFail: "Email field is required." },
            },
        });
    }
}
exports.default = EmailRequest;
