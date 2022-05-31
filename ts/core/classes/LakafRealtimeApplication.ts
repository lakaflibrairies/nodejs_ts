
import http from "http";
import https from "https";
import { Server, ServerOptions, Socket } from "socket.io";
import {
  LakafSocketEventMiddlewareAction,
  LakafSocketRoutingObject,
  LakafSocketServerMiddlewareAction,
  LakafSocketTools,
} from "../types";
import LakafAbstract from "./LakafAbstract";
import LakafSocketRouting from "./LakafSocketRouting";

export default class LakafRealtimeApplication extends LakafAbstract {
  private readonly sio: Server;
  private socket: Socket;
  private allowedEvents: string[] = [];
  private beforeConnection: LakafSocketRoutingObject<Record<string, any>>[] =
    [];
  private insideConnection: LakafSocketRoutingObject<Record<string, any>>[] =
    [];

  constructor(
    app: http.Server | https.Server,
    socketRouting?: LakafSocketRouting<Record<string, any>>,
    options?: ServerOptions
  ) {
    super();
    this.sio = require("socket.io")(app, options);
    this.socket = null;

    if (!!socketRouting) {
      this.injectSocketRouting(socketRouting);
    }

    this.listenBeforeConnection();

    this.sio.on("connection", this.connection);

    console.log("Realtime mode has been started...");
  }

  connection(socket: Socket): void {
    this.socket = socket;

    this.socket.on("disconnect", () => {
      this.disconnection(this.socket);
    });

    this.listenInsideConnection();
  }

  disconnection(socket: Socket): void {
    console.log("Socket disconnect !!");
  }

  /** @private */
  private listenBeforeConnection(): void {
    if (this.beforeConnection.length === 0) return;

    this.beforeConnection.forEach((item) => {
      item.middlewares.forEach((middleware) => {
        if (middleware.type === "on-server") {
          this.sio.use(middleware.action);
        }
      });
    });
  }

  /** @private */
  private listenInsideConnection(): void {
    if (this.insideConnection.length === 0) return;

    this.insideConnection.forEach((item) => {
      const middlewareForAction = item.middlewares
        .filter((m) => m.type === "in-socket-action")
        .map((m) => m.action);
      this.listen(item.name, middlewareForAction, item.controller);
    });
  }

  listen<T>(
    name: string,
    middlewares: Array<
      LakafSocketServerMiddlewareAction | LakafSocketEventMiddlewareAction<T>
    >,
    callback: {
      (data: T, socket?: Socket, tools?: LakafSocketTools<T>): void;
    }
  ): void {
    this.socket.on(name, (data) => {
      var isValid: boolean = true;
      for (let i = 0; isValid && i < middlewares.length; i++) {
        isValid = middlewares[i](data) || false;
      }
      if (!isValid) {
        this.dispatchTo(this.socket.id, "error:not-authorized", {
          error: new Error("Not authorized."),
        });
        return;
      }
      callback(data, this.socket, {
        dispatch: this.dispatch,
        dispatchTo: this.dispatchTo,
        broadcastDispatching: this.broadcastDispatching,
      });
    });
  }

  dispatch<T>(name: string, data: T, callback?: { (data: T): T }): void {
    this.socket.emit(name, !callback ? data : callback(data));
  }

  dispatchTo<T>(
    socketId: string,
    name: string,
    data: T,
    callback?: { (data: T): T }
  ): void {
    this.socket.to(socketId).emit(name, !callback ? data : callback(data));
  }

  broadcastDispatching<T>(
    name: string,
    data: T,
    callback: { (data: T): T }
  ): LakafRealtimeApplication {
    this.socket.broadcast.emit(name, callback(data));
    return this;
  }

  /** @private */
  private injectSocketRouting(
    socketRouting: LakafSocketRouting<Record<string, any>>
  ): void {
    socketRouting.exportJournal().forEach((route) => {
      if (!route.name || !route.controller) {
        this.beforeConnection.push(route);
      } else {
        this.insideConnection.push(route);
      }
    });
  }
}
