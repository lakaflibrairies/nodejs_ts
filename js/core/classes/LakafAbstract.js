import helpers from "../../helpers/index";
import LakafStaticEmitter from "./LakafStaticEmitter";
export default class LakafAbstract extends LakafStaticEmitter {
    constructor() {
        super(...arguments);
        this.helpers = helpers;
    }
}
