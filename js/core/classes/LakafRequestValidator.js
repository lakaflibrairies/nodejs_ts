import express from "express";
import LakafAbstract from "./LakafAbstract";
export default class LakafRequestValidator extends LakafAbstract {
    constructor() {
        super();
    }
    validate() {
        if (!this.runValidation()) {
            express.response.json(!this.onFail ? { message: "Not authorized" } : this.onFail.message);
        }
    }
    runValidation() {
        return true;
    }
}
