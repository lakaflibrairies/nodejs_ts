import { Router } from "express";
import LakafAbstract from "./LakafAbstract";
import LakafNotFoundController from "./LakafNotFoundController";
/**
 *  ** To create a routing object, just declare a variable or constant which contains an instance of LakafRouting like this
 *
 *  ```js
 *  const routing: LakafRouting = new LakafRouting();
 *  ```
 *
 *  ** Router object allow to chain route registration like this :
 *
 *  ```js
 *    routing
 *      ._get(...)
 *      ._post(...)
 *      ._resource(...)
 *      ._delete(...)
 *      ._middleware(...);
 *  ```
 *
 *  ** To create a resource route, process like this
 *
 *  ```js
 *  routing._resource("/users", [], resourceController);
 *  ```
 *
 *  First parameter is a base path that will used to make request.
 *
 *  Second parameter is an array of middlewares which will be used before threat request.
 *
 *  Third parameter is a controller which contains all resource methods that will be called when request made.
 *
 *
 *  resource route provides these routes :
 *
 *  ```js
 *  - /users              //  (GET)       // -> index route,
 *  - /users/create       //  (GET)       // -> create route,
 *  - /users/store        //  (POST)      // -> store route,
 *  - /users/:id          //  (GET)       // -> show route,
 *  - /users/:id/edit     //  (GET)       // -> edit route,
 *  - /users/:id          //  (PUT)       // -> update route,
 *  - /users/:id          //  (DELETE)    // -> destroy route
 *  ```
 *
 *
 *  ** To create a grouped routes, you can use one of both commented methods
 *
 *   1 - Arrow function method
 *
 *  ```js
 *  routing._group("/auth", (router) => {
 *    router
 *      ._get("/signup", [], (req, res) => {
 *        res.json({ msg: "Sign up works !" });
 *      })
 *      ._get("/login", [], (req, res) => {
 *        res.json({ msg: "Login works !" });
 *      })
 *      ._get("/logout", [], (req, res) => {
 *        res.json({ msg: "Logout works !" });
 *      });
 *  });
 *  ```
 *
 *    Or
 *
 *  ```js
 *  routing._group("/auth", (router) => {
 *    router
 *      ._get("/signup", [], controller.action1)
 *      ._get("/login", [], controller.action2)
 *      ._get("/logout", [], controller.action3);
 *  });
 *  ```
 *
 *
 *   2 - Array method
 *
 *  ```js
 *  routing._group("/auth", [
 *    {
 *      brick: "signup",
 *      verb: "GET",
 *      middlewares: [],
 *      controller: (req, res) => {
 *        res.json({ msg: "Sign up works !" });
 *      },
 *    },
 *    {
 *      brick: "login",
 *      verb: "GET",
 *      middlewares: [],
 *      controller: (req, res) => {
 *        res.json({ msg: "Login works !" });
 *      },
 *    },
 *    {
 *      brick: "logout",
 *      verb: "GET",
 *      middlewares: [],
 *      controller: (req, res) => {
 *        res.json({ msg: "Logout works !" });
 *      },
 *    },
 *  ]);
 *  ```
 *
 *    Or
 *
 *  ```js
 *  routing._group("/auth", [
 *    {
 *      brick: "signup",
 *      verb: "GET",
 *      middlewares: [],
 *      controller: controller.action1,
 *    },
 *    {
 *      brick: "login",
 *      verb: "GET",
 *      middlewares: [],
 *      controller: controller.action2,
 *    },
 *    {
 *      brick: "logout",
 *      verb: "GET",
 *      middlewares: [],
 *      controller: controller.action3,
 *    },
 *  ]);
 *  ```
 *
 *   Be careful when you use each of those method because each one has its particularities.
 *   In arrow function method, each route must begin by "/" character, else this route will be not registered.
 *   In array method, each route don't must begin by "/" character, else this route will be not registered.
 *
 *
 *  ** To create a middleware routes, do like this :
 *
 *  ```js
 *  routing
 *    ._middleware(middlewares: LakafMiddlewareAction[], (router) => {
 *      router._get("/buy", [], controller.action1);
 *      router._get("/list", [], controller.action2);
 *      router._post("/comment", [], controller.action3);
 *    });
 *  ```
 *
 *
 *  ** To inject module in your routing, do like this :
 *
 *  ```js
 *  routing.module("/shop", new_routing);
 *  ```
 *
 *
 *  NB: using controller means that you instantiated it long before...
 *
 */
export default class LakafRouting extends LakafAbstract {
    constructor() {
        super();
        this.router = Router();
    }
    _get(brick, middlewares, controller) {
        this.router.get(brick, ...middlewares, controller);
        return this;
    }
    _post(brick, middlewares, controller) {
        this.router.post(brick, ...middlewares, controller);
        return this;
    }
    _put(brick, middlewares, controller) {
        this.router.put(brick, ...middlewares, controller);
        return this;
    }
    _delete(brick, middlewares, controller) {
        this.router.delete(brick, ...middlewares, controller);
        return this;
    }
    _resource(brick, middlewares, controller, specificResources) {
        if (!specificResources || specificResources.includes("index")) {
            this._get(brick, middlewares, controller.index);
        }
        if (!specificResources || specificResources.includes("create")) {
            this._get(`${brick}/create`, middlewares, controller.create);
        }
        if (!specificResources || specificResources.includes("store")) {
            this._post(`${brick}`, middlewares, controller.store);
        }
        if (!specificResources || specificResources.includes("show")) {
            this._get(`${brick}/:id`, middlewares, controller.show);
        }
        if (!specificResources || specificResources.includes("edit")) {
            this._get(`${brick}/:id/edit`, middlewares, controller.edit);
        }
        if (!specificResources || specificResources.includes("update")) {
            this._put(`${brick}/:id`, middlewares, controller.update);
        }
        if (!specificResources || specificResources.includes("destroy")) {
            this._delete(`${brick}/:id`, middlewares, controller.destroy);
        }
        return this;
    }
    _group(brick, routerGroup) {
        if (typeof routerGroup === "function") {
            let routerChild = new LakafRouting();
            routerGroup(routerChild);
            this.router.use(brick, routerChild.design());
            routerChild = undefined;
        }
        else if (routerGroup.length) {
            routerGroup.forEach((el) => {
                switch (el.verb) {
                    case "GET":
                        this._get(`${brick}/${el.brick}`, el.middlewares, el.controller);
                        break;
                    case "POST":
                        this._post(`${brick}/${el.brick}`, el.middlewares, el.controller);
                        break;
                    case "PUT":
                        this._put(`${brick}/${el.brick}`, el.middlewares, el.controller);
                        break;
                    case "DELETE":
                        this._delete(`${brick}/${el.brick}`, el.middlewares, el.controller);
                        break;
                    default:
                        break;
                }
            });
        }
        else {
            console.error("Bad router group. A router group must be a function or an array of RouterGroupObject.");
            console.log("Your router group has not been injected...");
        }
        return this;
    }
    _middleware(things, middlewareRouting) {
        let routerMiddleware = {
            _get: (brick, middlewares, controller) => {
                this._get(brick, [...things, ...middlewares], controller);
                return routerMiddleware;
            },
            _post: (brick, middlewares, controller) => {
                this._post(brick, [...things, ...middlewares], controller);
                return routerMiddleware;
            },
            _put: (brick, middlewares, controller) => {
                this._put(brick, [...things, ...middlewares], controller);
                return routerMiddleware;
            },
            _delete: (brick, middlewares, controller) => {
                this._delete(brick, [...things, ...middlewares], controller);
                return routerMiddleware;
            },
            _resource: (brick, middlewares, controller, specificResources) => {
                this._resource(brick, [...things, ...middlewares], controller, specificResources);
                return routerMiddleware;
            },
        };
        middlewareRouting(routerMiddleware);
        routerMiddleware = undefined;
        return this;
    }
    _module(brick, routingModule) {
        this.router.use(brick, routingModule.design());
        return this;
    }
    design() {
        this.router.use("/*", LakafNotFoundController.response);
        return this.router;
    }
}
