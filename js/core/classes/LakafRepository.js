import { escape } from "mysql";
import LakafBaseRepository from "./LakafBaseRepository";
export default class LakafRepository extends LakafBaseRepository {
    constructor(modelToUse) {
        super(modelToUse);
    }
    getElementById(id) {
        return new Promise((resolve, reject) => {
            this.model
                .read([], { WHERE: "id = " + escape(id) })
                .then((result) => {
                resolve(result.length > 0 ? result[0] : null);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
}
