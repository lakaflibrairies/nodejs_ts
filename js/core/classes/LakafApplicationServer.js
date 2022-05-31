"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const env_1 = __importDefault(require("../../env"));
const LakafAbstract_1 = __importDefault(require("./LakafAbstract"));
const LakafRealtimeApplication_1 = __importDefault(require("./LakafRealtimeApplication"));
class LakafApplicationServer extends LakafAbstract_1.default {
    constructor(system, socketRouting) {
        super();
        this.statusServer = false;
        this.port = env_1.default.PORT;
        this.host = env_1.default.HOST;
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
            this.server = http_1.default.createServer(this.system.app);
        }
        else {
            this.server = https_1.default.createServer({ key, cert }, this.system.app);
        }
        if (env_1.default.config && env_1.default.config.useRealtime === true) {
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
    /** @private */
    registerAsRTAServer() {
        if (!this.socketRouting) {
            console.log("No socket routing provided");
            this.realtime = new LakafRealtimeApplication_1.default(this.server);
        }
        else {
            this.realtime = new LakafRealtimeApplication_1.default(this.server, this.socketRouting);
            console.log("Socket routing successfully loaded.");
        }
    }
}
exports.default = LakafApplicationServer;
