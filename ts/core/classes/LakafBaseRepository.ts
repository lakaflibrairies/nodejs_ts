import { escape } from "mysql";
import LakafAbstract from "./LakafAbstract";

export default class LakafBaseRepository<M> extends LakafAbstract {
  protected readonly model: M;
  protected readonly escape = escape;

  constructor(modelToUse: M) {
    super();
    this.model = modelToUse;
  }
}
