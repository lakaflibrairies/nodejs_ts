import { escape } from "mysql";
import LakafAbstract from "./LakafAbstract";
export default class LakafBaseRepository extends LakafAbstract {
    constructor(modelToUse) {
        super();
        this.escape = escape;
        this.model = modelToUse;
    }
}
