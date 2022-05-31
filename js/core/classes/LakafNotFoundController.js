"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LakafBaseController_1 = __importDefault(require("./LakafBaseController"));
class NotFoundController extends LakafBaseController_1.default {
    constructor() {
        super();
    }
    response(req, res) {
        res.json({ msg: "Not found route !!" });
    }
}
const LakafNotFoundController = new NotFoundController();
exports.default = LakafNotFoundController;
