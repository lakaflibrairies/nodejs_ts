import http from "http";
import https from "https";
import env from "../../env";
import LakafAbstract from "./LakafAbstract";
import LakafApplication from "./LakafApplication";
import LakafRealtimeApplication from "./LakafRealtimeApplication";
import LakafSocketRouting from "./LakafSocketRouting";

export default class LakafApplicationServer extends LakafAbstract {
  private readonly port: number;
  readonly system: LakafApplication;
  private readonly host: string;
  private server: http.Server | https.Server;
  private statusServer: boolean = false;
  realtime: LakafRealtimeApplication;
  private socketRouting: LakafSocketRouting<Record<string, any>>;

  constructor(
    system: LakafApplication,
    socketRouting?: LakafSocketRouting<Record<string, any>>
  ) {
    super();
    this.port = env.PORT;
    this.host = env.HOST;
    this.system = system;
    if (!!socketRouting) {
      this.socketRouting = socketRouting;
    }
  }

  start({ key, cert }: { key?: any; cert?: any }): void {
    this.system.app.set("port", this.port);
    if (
      !key ||
      !cert ||
      String(key).length === 0 ||
      String(cert).length === 0
    ) {
      this.server = http.createServer(this.system.app);
    } else {
      this.server = https.createServer({ key, cert }, this.system.app);
    }

    if (env.config && env.config.useRealtime === true) {
      this.registerAsRTAServer();
    }

    this.server.on("listening", () => {
      console.log("Server started on " + this.host + ":" + this.port + "...");
    });
    this.server.listen(this.port, this.host);
    this.statusServer = true;
  }

  stop(): void {
    if (this.statusServer) {
      this.server.close((err) => {
        console.log("Something is wrong when closing server");
        console.log("Message : \n");
        console.log(err.message);
        console.log("Name : \n");
        console.log(err.name);
        console.log("Stack : \n");
        console.log(err.stack);
      });
    }
  }

  refresh({ key, cert }: { key?: any; cert?: any }): void {
    if (!this.statusServer) {
      console.log("Server was not started !");
      this.start({ key, cert });
    } else {
      this.stop();
      this.start({ key, cert });
    }
  }

  get app(): LakafApplication {
    return this.system;
  }

  /** @private */
  private registerAsRTAServer(): void {
    if (!this.socketRouting) {
      console.log("No socket routing provided");
      this.realtime = new LakafRealtimeApplication(this.server);
    } else {
      this.realtime = new LakafRealtimeApplication(
        this.server,
        this.socketRouting
      );
      console.log("Socket routing successfully loaded.");
    }
  }
}
