import { NextFunction, Request, Response } from "express";
import { verify, decode, sign } from "jsonwebtoken";
import {
  Json,
  LakafMiddlewareAction,
  LakafCriteriaFunction,
} from "../types/index";
import LakafAbstract from "./LakafAbstract";

export default class LakafMiddleware extends LakafAbstract {
  readonly jwt = { decode, sign, verify };

  constructor() {
    super();
  }

  /** @protected */
  protected useIt(
    criteriaFunction: LakafCriteriaFunction,
    responseOnFail?: Json | string
  ): LakafMiddlewareAction {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (await criteriaFunction(req, res)) {
        next();
      } else {
        if (!responseOnFail) {
          res.send("Not authorized");
        } else if (typeof responseOnFail === "string") {
          res.send(responseOnFail);
        } else {
          res.json(responseOnFail);
        }
      }
    };
  }
}
