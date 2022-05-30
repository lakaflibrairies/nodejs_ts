import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();

export default abstract class LakafStaticEmitter {
  static readonly emitter: EventEmitter = eventEmitter;
}
