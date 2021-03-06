"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../../helpers/index"));
const LakafStaticEmitter_1 = __importDefault(require("./LakafStaticEmitter"));
class LakafAbstract extends LakafStaticEmitter_1.default {
    constructor() {
        super(...arguments);
        /** @readonly @type { typeof helpers } */
        this.helpers = index_1.default;
    }
}
exports.default = LakafAbstract;
