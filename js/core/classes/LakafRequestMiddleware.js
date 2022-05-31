"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LakafMiddleware_1 = __importDefault(require("./LakafMiddleware"));
class LakafRequestMiddleware extends LakafMiddleware_1.default {
    constructor(request, responseOnFail) {
        super();
        this.request = request;
        this.responseOnFail = responseOnFail;
    }
    intercept() {
        return this.useIt((req, res) => {
            const [newReq] = this.request.validateWithoutSendResponse(req, res);
            return Promise.resolve(newReq !== undefined);
        }, this.responseOnFail);
    }
}
exports.default = LakafRequestMiddleware;
