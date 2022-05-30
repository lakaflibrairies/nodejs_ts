var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { verify, decode, sign } from "jsonwebtoken";
import LakafAbstract from "./LakafAbstract";
export default class LakafMiddleware extends LakafAbstract {
    constructor() {
        super();
        this.jwt = { decode, sign, verify };
    }
    useIt(criteriaFunction, responseOnFail) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (yield criteriaFunction(req, res)) {
                next();
            }
            else {
                if (!responseOnFail) {
                    res.send("Not authorized");
                }
                else if (typeof responseOnFail === "string") {
                    res.send(responseOnFail);
                }
                else {
                    res.json(responseOnFail);
                }
            }
        });
    }
}
