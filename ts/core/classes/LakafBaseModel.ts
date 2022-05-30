import { Connection } from "mysql";
import LakafAbstract from "./LakafAbstract";
import LakafDatabase from "./LakafDatabase";

export default class LakafBaseModel extends LakafAbstract {
  private readonly engine: LakafDatabase;
  readonly connection: Connection;

  constructor() {
    super();
    this.engine = new LakafDatabase();
    this.connection = this.engine.dbEng;
  }
}
