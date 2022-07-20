import helpers from "../../helpers/index";
import LakafStaticEmitter from "./LakafStaticEmitter";

export default abstract class LakafAbstract extends LakafStaticEmitter {
  /** @readonly @type { typeof helpers } */
  readonly helpers: typeof helpers = helpers;
}
