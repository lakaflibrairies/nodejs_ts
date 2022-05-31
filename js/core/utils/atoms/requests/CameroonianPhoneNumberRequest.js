"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LakafRequest_1 = __importDefault(require("../../../classes/LakafRequest"));
const cameroonianPhoneHelper_1 = __importDefault(require("../../../../helpers/cameroonianPhoneHelper"));
class CameroonianPhoneNumberRequest extends LakafRequest_1.default {
    constructor() {
        super({
            phone_number: {
                custom: {
                    messageOnFail: "This field contains a wrong cameroonian phone number.",
                    callback(value) {
                        return cameroonianPhoneHelper_1.default.cameroonianPhoneNumberValidator(value);
                    },
                },
            },
        });
    }
}
exports.default = CameroonianPhoneNumberRequest;
