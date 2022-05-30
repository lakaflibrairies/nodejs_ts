import LakafAbstract from "./LakafAbstract";
import LakafDatabase from "./LakafDatabase";
export default class LakafBaseModel extends LakafAbstract {
    constructor() {
        super();
        this.engine = new LakafDatabase();
        this.connection = this.engine.dbEng;
    }
}
