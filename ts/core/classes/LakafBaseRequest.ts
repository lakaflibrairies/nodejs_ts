import { Request } from "express";
import {
  UrlRulesType,
  RuleType,
  ValidationReport,
  RequestStrategyType,
} from "../types/index";
import LakafAbstract from "./LakafAbstract";

export default class LakafBaseRequest extends LakafAbstract {
  private rules: RuleType;
  private urlRules: UrlRulesType;

  constructor(
    rules: RuleType,
    urlRules?: UrlRulesType,
    private checkIntruders: boolean = true
  ) {
    super();
    this.rules = rules;

    if (urlRules) {
      this.urlRules = urlRules;
    } else {
      this.urlRules = {};
    }
  }

  get allRules() {
    return {
      rules: this.rules,
      urlRules: this.urlRules,
    };
  }

  protected urlValidation(req: Request): ValidationReport {
    let report: ValidationReport = { success: true, message: "" };

    if (Object.keys(this.urlRules).length === 0) return report;

    if (this.urlRules.query) {
      const fieldsQueryInReq: string[] = Object.keys(req.query);
      const fieldsQueryInRules: string[] = Object.keys(this.urlRules.query);
      const queryIntruders: string[] = [];

      fieldsQueryInReq.forEach((field) => {
        if (!fieldsQueryInRules.includes(field)) {
          queryIntruders.push(field);
        }
      });

      if (queryIntruders.length > 0) {
        report.success = false;
        report.message =
          "Intruders in request body : " + queryIntruders.join(", ");

        return report;
      }

      report = this.queryValidation(req);

      if (!report.success) {
        return report;
      }
    }

    if (this.urlRules.params) {
      report = this.paramsValidation(req);

      return report;
    }

    return report;
  }

  protected validation(req: Request): ValidationReport {
    if (this.checkIntruders) {
      let report: ValidationReport = { success: true, message: "" };
      const fieldsInReq: string[] = Object.keys(req.body);
      const fieldsInRules: string[] = Object.keys(this.rules);
      const intruders: string[] = [];

      fieldsInReq.forEach((field) => {
        if (!fieldsInRules.includes(field)) {
          intruders.push(field);
        }
      });

      if (intruders.length > 0) {
        report.success = false;
        report.message = "Intruders in request body : " + intruders.join(", ");

        return report;
      }
    }

    return this.bodyValidation(req);
  }

  private bodyValidation(req: Request): ValidationReport {
    return this.dataValidation(req);
  }

  private queryValidation(req: Request): ValidationReport {
    return this.dataValidation(req, "query");
  }

  private paramsValidation(req: Request): ValidationReport {
    return this.dataValidation(req, "params");
  }

  private dataValidation(
    req: Request,
    strategy: RequestStrategyType = "body"
  ): ValidationReport {
    let report: ValidationReport = { success: true, message: "" };

    if (strategy === "body") {
      report = this.required(req);

      if (!report.success) {
        return report;
      }
    }

    report = this.numeric(req, strategy);

    if (!report.success) {
      return report;
    }

    report = this.integer(req, strategy);

    if (!report.success) {
      return report;
    }

    report = this.text(req, strategy);

    if (!report.success) {
      return report;
    }

    report = this.min(req, strategy);

    if (!report.success) {
      return report;
    }

    report = this.max(req, strategy);

    if (!report.success) {
      return report;
    }

    report = this.custom(req, strategy);

    return report;
  }

  private required(req: Request): ValidationReport {
    const report: ValidationReport = { success: true, message: "" };
    const requiredFields: string[] = [];

    for (const field in this.rules) {
      if (Object.prototype.hasOwnProperty.call(this.rules[field], "required")) {
        requiredFields.push(field);
      }
    }

    if (requiredFields.length === 0) {
      return report;
    }

    const fieldsInReq: string[] = Object.keys(req.body);

    requiredFields.forEach((f) => {
      if (!fieldsInReq.includes(f)) {
        report.success = false;
        report.message += this.rules[f].required.messageOnFail + "\n";
      }
    });

    return report;
  }

  private numeric(
    req: Request,
    strategy: RequestStrategyType = "body"
  ): ValidationReport {
    const report: ValidationReport = { success: true, message: "" };
    const numericFields: string[] = [];
    const rulesToUse: RuleType =
      strategy === "body" ? this.rules : this.urlRules[strategy];
    const dataToValidate = req[strategy];

    for (const field in rulesToUse) {
      if (Object.prototype.hasOwnProperty.call(rulesToUse[field], "numeric")) {
        numericFields.push(field);
      }
    }

    if (numericFields.length === 0) {
      return report;
    }

    const fieldsInReq: string[] = Object.keys(dataToValidate);

    numericFields.forEach((f) => {
      if (fieldsInReq.includes(f) && typeof dataToValidate[f] !== "number") {
        report.success = false;
        report.message += rulesToUse[f].numeric.messageOnFail + "\n";
      }
    });

    return report;
  }

  private integer(
    req: Request,
    strategy: RequestStrategyType = "body"
  ): ValidationReport {
    const report: ValidationReport = { success: true, message: "" };
    const integerFields: string[] = [];
    const rulesToUse: RuleType =
      strategy === "body" ? this.rules : this.urlRules[strategy];
    const dataToValidate = req[strategy];

    for (const field in rulesToUse) {
      if (Object.prototype.hasOwnProperty.call(rulesToUse[field], "integer")) {
        integerFields.push(field);
      }
    }

    if (integerFields.length === 0) {
      return report;
    }

    const fieldsInReq: string[] = Object.keys(dataToValidate);

    integerFields.forEach((f) => {
      if (fieldsInReq.includes(f) && !Number.isInteger(dataToValidate[f])) {
        report.success = false;
        report.message += rulesToUse[f].integer.messageOnFail + "\n";
      }
    });

    return report;
  }

  private text(
    req: Request,
    strategy: RequestStrategyType = "body"
  ): ValidationReport {
    const report: ValidationReport = { success: true, message: "" };
    const textFields: string[] = [];
    const rulesToUse: RuleType =
      strategy === "body" ? this.rules : this.urlRules[strategy];
    const dataToValidate = req[strategy];

    for (const field in rulesToUse) {
      if (Object.prototype.hasOwnProperty.call(rulesToUse[field], "text")) {
        textFields.push(field);
      }
    }

    if (textFields.length === 0) {
      return report;
    }

    const fieldsInReq: string[] = Object.keys(dataToValidate);

    textFields.forEach((f) => {
      if (fieldsInReq.includes(f) && typeof dataToValidate[f] !== "string") {
        report.success = false;
        report.message += rulesToUse[f].text.messageOnFail + "\n";
      }

      if (fieldsInReq.includes(f) && typeof dataToValidate[f] === "string") {
        if (
          (rulesToUse[f].text.maxLength &&
            dataToValidate[f].length > rulesToUse[f].text.maxLength) ||
          (rulesToUse[f].text.minLength &&
            dataToValidate[f].length < rulesToUse[f].text.minLength)
        ) {
          report.success = false;
          report.message += rulesToUse[f].text.messageOnFail + "\n";
        }
      }
    });

    return report;
  }

  private min(
    req: Request,
    strategy: RequestStrategyType = "body"
  ): ValidationReport {
    const report: ValidationReport = { success: true, message: "" };
    const minFields: string[] = [];
    const rulesToUse: RuleType =
      strategy === "body" ? this.rules : this.urlRules[strategy];
    const dataToValidate = req[strategy];

    for (const field in rulesToUse) {
      if (Object.prototype.hasOwnProperty.call(rulesToUse[field], "min")) {
        minFields.push(field);
      }
    }

    if (minFields.length === 0) {
      return report;
    }

    const fieldsInReq: string[] = Object.keys(dataToValidate);

    minFields.forEach((f) => {
      if (
        fieldsInReq.includes(f) &&
        rulesToUse[f].min.limit &&
        dataToValidate[f] < rulesToUse[f].min.limit
      ) {
        report.success = false;
        report.message += rulesToUse[f].min.messageOnFail + "\n";
      }
    });

    return report;
  }

  private max(
    req: Request,
    strategy: RequestStrategyType = "body"
  ): ValidationReport {
    const report: ValidationReport = { success: true, message: "" };
    const maxFields: string[] = [];
    const rulesToUse: RuleType =
      strategy === "body" ? this.rules : this.urlRules[strategy];
    const dataToValidate = req[strategy];

    for (const field in rulesToUse) {
      if (Object.prototype.hasOwnProperty.call(rulesToUse[field], "max")) {
        maxFields.push(field);
      }
    }

    if (maxFields.length === 0) {
      return report;
    }

    const fieldsInReq: string[] = Object.keys(dataToValidate);

    maxFields.forEach((f) => {
      if (
        fieldsInReq.includes(f) &&
        rulesToUse[f].max.limit &&
        dataToValidate[f] > rulesToUse[f].max.limit
      ) {
        report.success = false;
        report.message += rulesToUse[f].max.messageOnFail + "\n";
      }
    });

    return report;
  }

  private custom(
    req: Request,
    strategy: RequestStrategyType = "body"
  ): ValidationReport {
    const report: ValidationReport = { success: true, message: "" };
    const customFields: string[] = [];
    const rulesToUse: RuleType =
      strategy === "body" ? this.rules : this.urlRules[strategy];
    const dataToValidate = req[strategy];

    for (const field in rulesToUse) {
      if (Object.prototype.hasOwnProperty.call(rulesToUse[field], "custom")) {
        customFields.push(field);
      }
    }

    if (customFields.length === 0) {
      return report;
    }

    const fieldsInReq: string[] = Object.keys(dataToValidate);

    customFields.forEach((f) => {
      if (
        fieldsInReq.includes(f) &&
        !rulesToUse[f].custom.callback(dataToValidate[f])
      ) {
        report.success = false;
        report.message += rulesToUse[f].custom.messageOnFail + "\n";
      }
    });

    return report;
  }
}
