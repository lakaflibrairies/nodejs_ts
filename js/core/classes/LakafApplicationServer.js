import http from "http";
import https from "https";
import env from "../../env";
import LakafAbstract from "./LakafAbstract";
import LakafRealtimeApplication from "./LakafRealtimeApplication";
export default class LakafApplicationServer extends LakafAbstract {
    constructor(port, host, system, socketRouting) {
        super();
        this.statusServer = false;
        this.port = port;
        this.host = host;
        this.system = system;
        if (!!socketRouting) {
            this.socketRouting = socketRouting;
        }
    }
    start({ key, cert }) {
        this.system.app.set("port", this.port);
        if (!key ||
            !cert ||
            String(key).length === 0 ||
            String(cert).length === 0) {
            this.server = http.createServer(this.system.app);
        }
        else {
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
    stop() {
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
    refresh({ key, cert }) {
        if (!this.statusServer) {
            console.log("Server was not started !");
            this.start({ key, cert });
        }
        else {
            this.stop();
            this.start({ key, cert });
        }
    }
    get app() {
        return this.system;
    }
    registerAsRTAServer() {
        if (!this.socketRouting) {
            console.log("No socket routing provided");
            this.realtime = new LakafRealtimeApplication(this.server);
        }
        else {
            this.realtime = new LakafRealtimeApplication(this.server, this.socketRouting);
            console.log("Socket routing successfully loaded.");
        }
    }
}
