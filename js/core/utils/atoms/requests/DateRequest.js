"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LakafRequest_1 = __importDefault(require("../../../classes/LakafRequest"));
class DateRequest extends LakafRequest_1.default {
    constructor() {
        super({
            date_field: {
                custom: {
                    messageOnFail: "The date field must be a correct value of date.",
                    callback(value) {
                        if (typeof value !== "string")
                            return false;
                        if (![value.split("-").length, value.split("/").length].includes(3))
                            return false;
                        const values = value.split(/[-/]/);
                        const yearValidator = /^[12][0-9]{3}$/.test;
                        const monthValidator = /^0[1-9]|1[0-2]$/.test;
                        const dayValidator = /^[012][1-9]|30|31$/.test;
                        const removingYear = values.filter((v) => !yearValidator(v));
                        if (removingYear.length === 3)
                            return false;
                        const report = [
                            ...removingYear.map((el) => monthValidator(el)),
                            ...removingYear.map((el) => dayValidator(el)),
                        ];
                        return report.filter((el) => el).length === 3;
                    },
                },
            },
        });
    }
}
exports.default = DateRequest;
