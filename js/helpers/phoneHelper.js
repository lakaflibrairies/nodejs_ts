"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cameroonianPhoneHelper_1 = __importDefault(require("./cameroonianPhoneHelper"));
const phone = Object.assign(Object.assign({}, cameroonianPhoneHelper_1.default), { cameroonianPhone: cameroonianPhoneHelper_1.default, phoneNumberValidator(value) {
        return (phone.isCamTelNumber(value) ||
            phone.isNexttelNumber(value) ||
            phone.isOrangeNumber(value) ||
            phone.isMTNNumber(value));
    } });
exports.default = phone;
