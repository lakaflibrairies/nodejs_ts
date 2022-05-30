import LakafAbstract from "./LakafAbstract";
export default class LakafRealtimeApplication extends LakafAbstract {
    constructor(app, socketRouting, options) {
        super();
        this.allowedEvents = [];
        this.beforeConnection = [];
        this.insideConnection = [];
        this.sio = require("socket.io")(app, options);
        this.socket = null;
        if (!!socketRouting) {
            this.injectSocketRouting(socketRouting);
        }
        this.listenBeforeConnection();
        this.sio.on("connection", this.connection);
        console.log("Realtime mode has been started...");
    }
    connection(socket) {
        this.socket = socket;
        this.socket.on("disconnect", () => {
            this.disconnection(this.socket);
        });
        this.listenInsideConnection();
    }
    disconnection(socket) {
        console.log("Socket disconnect !!");
    }
    listenBeforeConnection() {
        if (this.beforeConnection.length === 0)
            return;
        this.beforeConnection.forEach((item) => {
            item.middlewares.forEach((middleware) => {
                if (middleware.type === "on-server") {
                    this.sio.use(middleware.action);
                }
            });
        });
    }
    listenInsideConnection() {
        if (this.insideConnection.length === 0)
            return;
        this.insideConnection.forEach((item) => {
            const middlewareForAction = item.middlewares
                .filter((m) => m.type === "in-socket-action")
                .map((m) => m.action);
            this.listen(item.name, middlewareForAction, item.controller);
        });
    }
    listen(name, middlewares, callback) {
        this.socket.on(name, (data) => {
            var isValid = true;
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
    dispatch(name, data, callback) {
        this.socket.emit(name, !callback ? data : callback(data));
    }
    dispatchTo(socketId, name, data, callback) {
        this.socket.to(socketId).emit(name, !callback ? data : callback(data));
    }
    broadcastDispatching(name, data, callback) {
        this.socket.broadcast.emit(name, callback(data));
        return this;
    }
    injectSocketRouting(socketRouting) {
        socketRouting.exportJournal().forEach((route) => {
            if (!route.name || !route.controller) {
                this.beforeConnection.push(route);
            }
            else {
                this.insideConnection.push(route);
            }
        });
    }
}
