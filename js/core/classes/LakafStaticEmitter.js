"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const eventEmitter = new events_1.EventEmitter();
class LakafStaticEmitter {
}
exports.default = LakafStaticEmitter;
LakafStaticEmitter.emitter = eventEmitter;
