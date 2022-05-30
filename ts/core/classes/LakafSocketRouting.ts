import {
  LakafSocketControllerAction,
  LakafSocketMiddlewareType,
  LakafSocketRoutingObject,
} from "../types";
import LakafAbstract from "./LakafAbstract";

export default class LakafSocketRouting<T> extends LakafAbstract {
  private registeredSocketRouting: LakafSocketRoutingObject<T>[] = [];

  exportJournal(): LakafSocketRoutingObject<T>[] {
    return this.registeredSocketRouting;
  }

  register(
    name: string,
    middlewares: LakafSocketMiddlewareType<T>[],
    controller?: LakafSocketControllerAction<T>
  ): LakafSocketRouting<T> {
    if (name === "" || !controller) {
      this.registeredSocketRouting.push({ middlewares });
      return this;
    }

    const routeNotExists: boolean = !this.registeredSocketRouting.filter(
      (route) => {
        if ("name" in route) {
          return route.name === name;
        }
        return false;
      }
    )[0];

    if (routeNotExists) {
      this.registeredSocketRouting.push({
        name,
        middlewares,
        controller,
      });
    } else {
      console.log(
        `Socket route with name = ${name} already exists in the socket routing journal.`
      );
      console.log(`This route has not been registered.`);
      throw new Error(`Socket route with name = ${name} already exists in the socket routing journal. This route has not been registered.`);
    }
    return this;
  }
}
