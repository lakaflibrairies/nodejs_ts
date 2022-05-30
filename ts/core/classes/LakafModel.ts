import LakafBaseModel from "./LakafBaseModel";
import {
  CriteriaOption,
  FieldTemplate,
  Json,
  ValidationReport,
} from "../types/index";

export default class LakafModel extends LakafBaseModel {
  private readonly template: FieldTemplate[];
  private readonly tableName: string;
  private fillable: string[];

  constructor(tableName: string, template: FieldTemplate[]) {
    super();
    this.template = this.parseTemplate(template);
    this.tableName = tableName;
    this.fillable = this.computeFillableFields();
  }

  private parseTemplate(template: FieldTemplate[]): FieldTemplate[] {
    return template.map((item) => {
      if (item.name === "id") {
        item.defaultValue = "computed";
        item.fillable = false;
        item.nullable = false;
      } else {
        if (item.valueType === "boolean") {
          item.length = null;
        }
        if (item.fillable === undefined) {
          item.fillable = true;
        }
        if (item.nullable === undefined) {
          item.nullable = false;
        }
        if (
          item.length === undefined ||
          !(Number.isInteger(item.length) && item.length > 0)
        ) {
          item.length = null;
        }
        if (item.nullable && !item.defaultValue) {
          item.defaultValue = null;
        }
        if (!this.validateValue(item)) {
          throw new Error(
            "A value of defaultValue key doesn't match with value type and length !!"
          );
        }
      }
      return item;
    });
  }

  private computeFillableFields(): string[] {
    return this.template
      .filter((item) => item.fillable && item.name !== "id")
      .map((item) => item.name);
  }

  private validateValue(field: FieldTemplate, val?: any): boolean {
    const value = !val ? field.defaultValue : val;

    if (!value || value === null) {
      return true;
    }
    if (
      ["varchar", "text"].includes(field.valueType) &&
      typeof value === "string"
    ) {
      if (field.valueType === "text") {
        return true;
      }
      if (field.valueType === "varchar" && field.length !== null) {
        return value.length <= field.length;
      } else {
        return false;
      }
    }

    if (
      ["numeric", "integer"].includes(field.valueType) &&
      typeof value === "number"
    ) {
      if (field.valueType === "numeric") {
        return true;
      }
      if (field.valueType === "integer" && field.length !== null) {
        return (
          value <= Math.pow(10, field.length + 1) - 1 &&
          value > 1 - Math.pow(10, field.length + 1)
        );
      } else {
        return false;
      }
    }

    if (field.valueType === "boolean" && typeof value === "boolean") {
      return true;
    }

    if (field.nullable && value === null) {
      return true;
    }

    return false;
  }

  private validateEntries(entries: Json): ValidationReport {
    const keysList: string[] = Object.keys(entries);
    let report: ValidationReport = { success: true };

    let intruders: string[] = keysList.filter(
      (el) => !this.fillable.includes(el)
    );

    if (intruders.length > 0) {
      report.success = false;
      report.message =
        `Fields ${intruders.join(
          intruders.length > 1 ? ", " : ""
        )} given are not fillable.` + "\n";
      return report;
    }

    intruders = undefined;

    this.fillable.forEach((el) => {
      if (!keysList.includes(el)) {
        report.success = false;
        report.message = `Field ${el} missing into the given entries.` + "\n";
      }
    });

    if (!report.success) {
      return report;
    }

    keysList.forEach((el) => {
      const check: boolean = this.validateValue(
        this.template.filter((f) => f.name === el)[0]
      );

      if (!check) {
        report.success = false;
        report.message =
          `Field ${el} has a value that not matching to criteria given in a template.` +
          "\n";
      }
    });
    return report;
  }

  private validateUpdateEntries(entries: Json): ValidationReport {
    const keysList: string[] = Object.keys(entries);
    let report: ValidationReport = { success: true };

    let intruders: string[] = keysList.filter(
      (el) => !this.fillable.includes(el)
    );

    if (intruders.length > 0) {
      report.success = false;
      report.message =
        `Fields ${intruders.join(
          intruders.length > 1 ? ", " : ""
        )} given are not fillable.` + "\n";
      return report;
    }

    intruders = undefined;

    keysList.forEach((el) => {
      const check: boolean = this.validateValue(
        this.template.filter((f) => f.name === el)[0]
      );

      if (!check) {
        report.success = false;
        report.message =
          `Field ${el} has a value that not matching to criteria given in a template.` +
          "\n";
      }
    });
    return report;
  }

  private fillUnfilledField() {
    const unfilled: string[] = this.template
      .filter((f) => !f.fillable && f.name !== "id")
      .map((f) => f.name);

    const output: Json = {};

    unfilled.forEach((el) => {
      output[el] = this.template.find((item) => item.name === el).defaultValue;
    });

    return output;
  }

  private parseEntriesToKeysAndValuesList(entries: Json) {
    const keysList = [],
      valuesList = [];

    for (let k in entries) {
      keysList.push(k);
      valuesList.push(entries[k]);
    }

    return { keysList, valuesList };
  }

  private insertRequestBuilder(keysList: string[]): string {
    return `INSERT INTO ${this.tableName} (${
      keysList.length === 1 ? keysList[0] : keysList.join(", ")
    }) VALUES (${
      keysList.length === 1 ? "?" : Array(keysList.length).fill("?").join(", ")
    });`;
  }

  private selectRequestBuilder(
    fields: string[] | "*",
    criteria: CriteriaOption
  ): string {
    const computedCondition: string = `${
      criteria.WHERE ? "WHERE " + criteria.WHERE : ""
    } ${criteria.ORDER_BY ? "ORDER BY " + criteria.ORDER_BY : ""} ${
      criteria.DESC ? "DESC " : ""
    } ${criteria.LIMIT ? "LIMIT " + criteria.LIMIT : ""}`;

    return `SELECT ${
      !Array.isArray(fields)
        ? "*"
        : fields.length === 1
        ? fields[0]
        : fields.join(", ")
    } FROM ${this.tableName} ${computedCondition}`;
  }

  private updateRequestBuilder(fields: string[], criteria: string): string {
    const templateArr: string[] = fields.map((f) => f + " = ?");
    return `UPDATE ${this.tableName} SET ${
      templateArr.length === 1 ? templateArr[0] : templateArr.join(", ")
    } WHERE ${criteria}`;
  }

  private transformToCollection(data: any): any[] {
    return Array.from(data);
  }

  create(entries: Json): Promise<any> {
    const validated: ValidationReport = this.validateEntries(entries);

    if (!validated.success) {
      throw new Error(validated.message);
    }

    const data: Json = { ...entries, ...this.fillUnfilledField() };

    const { keysList, valuesList } = this.parseEntriesToKeysAndValuesList(data);

    return new Promise<any>((resolve, reject) => {
      this.connection.query(
        this.insertRequestBuilder(keysList),
        valuesList,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  }

  read(fields: string[], criteria: CriteriaOption): Promise<any[]> {
    const allFields: string[] = this.template.map((el) => el.name);
    const intruders: string[] = fields.filter((f) => !allFields.includes(f));

    if (intruders.length > 0) {
      throw new Error(
        `Bad field : ${
          intruders.length === 1 ? intruders[0] : intruders.join(", ")
        }.`
      );
    }
    return new Promise<any>((resolve, reject) => {
      const sqlCode: string = this.selectRequestBuilder(
        fields.length > 0 ? fields : "*",
        criteria
      );

      this.connection.query(sqlCode, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(this.transformToCollection(result));
      });
    });
  }

  update(entries: Json, criteria: string): Promise<any> {
    const validation = this.validateUpdateEntries(entries);

    if (!validation.success) {
      throw new Error(validation.message);
    }

    return new Promise<any>((resolve, reject) => {
      this.connection.query(
        this.updateRequestBuilder(Object.keys(entries), criteria),
        Object.values(entries),
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  }

  private remove(criteria: Json): Promise<any> {
    return new Promise<any>((resolve, reject) => {});
  }

  table() {
    let sqlCode = ``;
    const executeRequest: { (): Promise<any[]> } = () => {
      return new Promise((resolve, reject) => {
        this.connection.query(sqlCode, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.transformToCollection(result));
        });
      });
    };
    const self = {
      code: (c: string) => {
        sqlCode += c;
        return self;
      },
      executeRequest,
    };
    return self;
  }
}
