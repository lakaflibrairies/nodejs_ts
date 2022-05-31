"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LakafAbstract_1 = __importDefault(require("./LakafAbstract"));
class LakafSocketRouting extends LakafAbstract_1.default {
    constructor() {
        super(...arguments);
        this.registeredSocketRouting = [];
    }
    exportJournal() {
        return this.registeredSocketRouting;
    }
    register(name, middlewares, controller) {
        if (name === "" || !controller) {
            this.registeredSocketRouting.push({ middlewares });
            return this;
        }
        const routeNotExists = !this.registeredSocketRouting.filter((route) => {
            if ("name" in route) {
                return route.name === name;
            }
            return false;
        })[0];
        if (routeNotExists) {
            this.registeredSocketRouting.push({
                name,
                middlewares,
                controller,
            });
        }
        else {
            console.log(`Socket route with name = ${name} already exists in the socket routing journal.`);
            console.log(`This route has not been registered.`);
            throw new Error(`Socket route with name = ${name} already exists in the socket routing journal. This route has not been registered.`);
        }
        return this;
    }
}
exports.default = LakafSocketRouting;
