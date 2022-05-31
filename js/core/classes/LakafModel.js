"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LakafBaseModel_1 = __importDefault(require("./LakafBaseModel"));
class LakafModel extends LakafBaseModel_1.default {
    constructor(tableName, template) {
        super();
        this.template = this.parseTemplate(template);
        this.tableName = tableName;
        this.fillable = this.computeFillableFields();
    }
    /** @private */
    parseTemplate(template) {
        return template.map((item) => {
            if (item.name === "id") {
                item.defaultValue = "computed";
                item.fillable = false;
                item.nullable = false;
            }
            else {
                if (item.valueType === "boolean") {
                    item.length = null;
                }
                if (item.fillable === undefined) {
                    item.fillable = true;
                }
                if (item.nullable === undefined) {
                    item.nullable = false;
                }
                if (item.length === undefined ||
                    !(Number.isInteger(item.length) && item.length > 0)) {
                    item.length = null;
                }
                if (item.nullable && !item.defaultValue) {
                    item.defaultValue = null;
                }
                if (!this.validateValue(item)) {
                    throw new Error("A value of defaultValue key doesn't match with value type and length !!");
                }
            }
            return item;
        });
    }
    /** @private */
    computeFillableFields() {
        return this.template
            .filter((item) => item.fillable && item.name !== "id")
            .map((item) => item.name);
    }
    /** @private */
    validateValue(field, val) {
        const value = !val ? field.defaultValue : val;
        if (!value || value === null) {
            return true;
        }
        if (["varchar", "text"].includes(field.valueType) &&
            typeof value === "string") {
            if (field.valueType === "text") {
                return true;
            }
            if (field.valueType === "varchar" && field.length !== null) {
                return value.length <= field.length;
            }
            else {
                return false;
            }
        }
        if (["numeric", "integer"].includes(field.valueType) &&
            typeof value === "number") {
            if (field.valueType === "numeric") {
                return true;
            }
            if (field.valueType === "integer" && field.length !== null) {
                return (value <= Math.pow(10, field.length + 1) - 1 &&
                    value > 1 - Math.pow(10, field.length + 1));
            }
            else {
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
    /** @private */
    validateEntries(entries) {
        const keysList = Object.keys(entries);
        let report = { success: true };
        let intruders = keysList.filter((el) => !this.fillable.includes(el));
        if (intruders.length > 0) {
            report.success = false;
            report.message =
                `Fields ${intruders.join(intruders.length > 1 ? ", " : "")} given are not fillable.` + "\n";
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
            const check = this.validateValue(this.template.filter((f) => f.name === el)[0]);
            if (!check) {
                report.success = false;
                report.message =
                    `Field ${el} has a value that not matching to criteria given in a template.` +
                        "\n";
            }
        });
        return report;
    }
    /** @private */
    validateUpdateEntries(entries) {
        const keysList = Object.keys(entries);
        let report = { success: true };
        let intruders = keysList.filter((el) => !this.fillable.includes(el));
        if (intruders.length > 0) {
            report.success = false;
            report.message =
                `Fields ${intruders.join(intruders.length > 1 ? ", " : "")} given are not fillable.` + "\n";
            return report;
        }
        intruders = undefined;
        keysList.forEach((el) => {
            const check = this.validateValue(this.template.filter((f) => f.name === el)[0]);
            if (!check) {
                report.success = false;
                report.message =
                    `Field ${el} has a value that not matching to criteria given in a template.` +
                        "\n";
            }
        });
        return report;
    }
    /** @private */
    fillUnfilledField() {
        const unfilled = this.template
            .filter((f) => !f.fillable && f.name !== "id")
            .map((f) => f.name);
        const output = {};
        unfilled.forEach((el) => {
            output[el] = this.template.find((item) => item.name === el).defaultValue;
        });
        return output;
    }
    /** @private */
    parseEntriesToKeysAndValuesList(entries) {
        const keysList = [], valuesList = [];
        for (let k in entries) {
            keysList.push(k);
            valuesList.push(entries[k]);
        }
        return { keysList, valuesList };
    }
    /** @private */
    insertRequestBuilder(keysList) {
        return `INSERT INTO ${this.tableName} (${keysList.length === 1 ? keysList[0] : keysList.join(", ")}) VALUES (${keysList.length === 1 ? "?" : Array(keysList.length).fill("?").join(", ")});`;
    }
    /** @private */
    selectRequestBuilder(fields, criteria) {
        const computedCondition = `${criteria.WHERE ? "WHERE " + criteria.WHERE : ""} ${criteria.ORDER_BY ? "ORDER BY " + criteria.ORDER_BY : ""} ${criteria.DESC ? "DESC " : ""} ${criteria.LIMIT ? "LIMIT " + criteria.LIMIT : ""}`;
        return `SELECT ${!Array.isArray(fields)
            ? "*"
            : fields.length === 1
                ? fields[0]
                : fields.join(", ")} FROM ${this.tableName} ${computedCondition}`;
    }
    /** @private */
    updateRequestBuilder(fields, criteria) {
        const templateArr = fields.map((f) => f + " = ?");
        return `UPDATE ${this.tableName} SET ${templateArr.length === 1 ? templateArr[0] : templateArr.join(", ")} WHERE ${criteria}`;
    }
    /** @private */
    transformToCollection(data) {
        return Array.from(data);
    }
    create(entries) {
        const validated = this.validateEntries(entries);
        if (!validated.success) {
            throw new Error(validated.message);
        }
        const data = Object.assign(Object.assign({}, entries), this.fillUnfilledField());
        const { keysList, valuesList } = this.parseEntriesToKeysAndValuesList(data);
        return new Promise((resolve, reject) => {
            this.connection.query(this.insertRequestBuilder(keysList), valuesList, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    }
    read(fields, criteria) {
        const allFields = this.template.map((el) => el.name);
        const intruders = fields.filter((f) => !allFields.includes(f));
        if (intruders.length > 0) {
            throw new Error(`Bad field : ${intruders.length === 1 ? intruders[0] : intruders.join(", ")}.`);
        }
        return new Promise((resolve, reject) => {
            const sqlCode = this.selectRequestBuilder(fields.length > 0 ? fields : "*", criteria);
            this.connection.query(sqlCode, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(this.transformToCollection(result));
            });
        });
    }
    update(entries, criteria) {
        const validation = this.validateUpdateEntries(entries);
        if (!validation.success) {
            throw new Error(validation.message);
        }
        return new Promise((resolve, reject) => {
            this.connection.query(this.updateRequestBuilder(Object.keys(entries), criteria), Object.values(entries), (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    }
    /** @private */
    remove(criteria) {
        return new Promise((resolve, reject) => { });
    }
    table() {
        let sqlCode = ``;
        const executeRequest = () => {
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
            code: (c) => {
                sqlCode += c;
                return self;
            },
            executeRequest,
        };
        return self;
    }
}
exports.default = LakafModel;
