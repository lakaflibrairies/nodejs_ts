import LakafAbstract from "./LakafAbstract";
export default class LakafSocketRouting extends LakafAbstract {
    constructor() {
        super(...arguments);
        this.registeredSocketRouting = [];
    }
    exportJournal() {
        return this.registeredSocketRouting;
    }
    register(name, middlewares, controller) {
        if (name === "" || !controller) {
            this.registeredSocketRouting.push({ middlewares });
            return this;
        }
        const routeNotExists = !this.registeredSocketRouting.filter((route) => {
            if ("name" in route) {
                return route.name === name;
            }
            return false;
        })[0];
        if (routeNotExists) {
            this.registeredSocketRouting.push({
                name,
                middlewares,
                controller,
            });
        }
        else {
            console.log(`Socket route with name = ${name} already exists in the socket routing journal.`);
            console.log(`This route has not been registered.`);
            throw new Error(`Socket route with name = ${name} already exists in the socket routing journal. This route has not been registered.`);
        }
        return this;
    }
}
