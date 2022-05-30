import express from "express";
import LakafAbstract from "./LakafAbstract";
import { Json, LakafRequestValidatorInterface } from "../types/index";

export default class LakafRequestValidator
  extends LakafAbstract
  implements LakafRequestValidatorInterface
{
  template: Json;
  onFail: { message: Json } | undefined;

  constructor() {
    super();
  }

  validate(): void {
    if (!this.runValidation()) {
      express.response.json(
        !this.onFail ? { message: "Not authorized" } : this.onFail.message
      );
    }
  }

  runValidation(): boolean {
    return true;
  }
}
