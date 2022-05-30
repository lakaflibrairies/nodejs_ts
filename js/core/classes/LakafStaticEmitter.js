import { EventEmitter } from "events";
const eventEmitter = new EventEmitter();
export default class LakafStaticEmitter {
}
LakafStaticEmitter.emitter = eventEmitter;
