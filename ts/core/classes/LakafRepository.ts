import { escape } from "mysql";
import LakafBaseRepository from "./LakafBaseRepository";
import LakafModel from "./LakafModel";

export default class LakafRepository extends LakafBaseRepository<LakafModel> {
  constructor(modelToUse: LakafModel) {
    super(modelToUse);
  }

  getElementById(id: string | number) {
    return new Promise<any>((resolve, reject) => {
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
