import { Connection, createConnection } from "mysql";
import LakafAbstract from "./LakafAbstract";
import env from "../../env";

export default class LakafDatabase extends LakafAbstract {
  private engine: Connection;

  constructor() {
    super();
    if (!env.dbConfig) {
      console.error(
        "No database configuration has not been provided in env.* file"
      );
      return;
    }

    this.start();
  }

  private onConnection(error) {
    if (error) {
      console.error("Fail to connect to database.");
    } else {
      console.log("Connected to database.");
    }
  }

  get dbEng(): Connection {
    return this.engine;
  }

  start() {
    this.engine = createConnection(env.dbConfig);

    this.engine.connect(this.onConnection);
  }

  stop() {
    this.engine.end();
  }

  refresh() {
    this.stop();
    this.start();
  }
}
