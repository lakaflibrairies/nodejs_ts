import { Request, Response } from "express";
import {
  RuleType,
  UrlRulesType,
  ValidationReport,
} from "../types/index";
import LakafBaseRequest from "./LakafBaseRequest";

export default class LakafRequest extends LakafBaseRequest {
  constructor(
    rules: RuleType,
    urlRules?: UrlRulesType,
    checkIntruders: boolean = true
  ) {
    super(rules, urlRules, checkIntruders);
  }

  validate(
    req: Request,
    res: Response
  ): [Request | undefined, Response] | undefined {
    let validation: ValidationReport = this.validation(req);

    if (!validation.success) {
      res.json({
        failure: true,
        report: validation.message,
      });

      return [undefined, res];
    }

    validation = this.urlValidation(req);

    if (!validation.success) {
      res.json({
        failure: true,
        report: validation.message,
      });

      return [undefined, res];
    }

    return [req, res];
  }

  validateWithoutSendResponse(
    req: Request,
    res: Response
  ): [Request | undefined, Response, ValidationReport] | undefined {
    let validation: ValidationReport = this.validation(req);

    if (!validation.success) {
      return [undefined, res, validation];
    }

    validation = this.urlValidation(req);

    if (!validation.success) {
      return [undefined, res, validation];
    }

    return [req, res, validation];
  }
}
