import * as bcrypt from "bcryptjs";
import { verify, decode, sign } from "jsonwebtoken";
import env from "../../env";
import LakafAbstract from "./LakafAbstract";

export default class LakafBaseService extends LakafAbstract {
  readonly jwtKey: string = env.jwtKey;
  readonly crypt = bcrypt;
  readonly jwt = { decode, sign, verify };

  constructor() {
    super();
  }

  /** @protected */
  protected formatDateTime(data: {
    toFormat: Date;
    separator?: string;
  }): string {
    const { toFormat, separator = "-" } = data;
    return (
      toFormat.getUTCFullYear() +
      separator +
      ("0" + (toFormat.getUTCMonth() + 1)).slice(-2) +
      separator +
      ("0" + toFormat.getUTCDate()).slice(-2) +
      " " +
      ("0" + toFormat.getUTCHours()).slice(-2) +
      ":" +
      ("0" + toFormat.getUTCMinutes()).slice(-2) +
      ":" +
      ("0" + toFormat.getUTCSeconds()).slice(-2)
    );
  }

  /**
   * @protected
   * @param { string } to
   * @param { string } title
   * @param { string } htmlContent
   *
   * @returns { Promise<any> }
   */
  protected sendMail(
    to: string,
    title: string,
    htmlContent: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.helpers
        .mail()
        .to(to)
        .subject(title)
        .htmlContent(htmlContent)
        .send((error, info) => {
          if (error) {
            reject(error);
          }
          resolve(info);
        });
    });
  }

  /**
   * @protected
   * @param { string } to
   * @param { string } title
   * @param { string } htmlContent
   *
   * @returns { Promise<any> }
   */
   protected sendSMS(
    to: number,
    payload: Record<"title" | "body", string | number>
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({ message: "Feature not available." })
    });
  }

  /** @protected */
  protected sendCodeByMail(
    to: string,
    title: string,
    code: string
  ): Promise<any> {
    return this.sendMail(
      to,
      title,
      this.helpers.mailTemplate.signup.default(code)
    );
  }

  /** @protected */
  protected sendResetPasswordCodeByMail(
    to: string,
    title: string,
    code: string
  ): Promise<any> {
    return this.sendMail(
      to,
      title,
      this.helpers.mailTemplate.notConnected.resetPassword(code)
    );
  }

  /** @protected */
  protected extractAndDecodeToken(authorization: string): any {
    return this.jwt.decode(this.helpers.auth.extractToken(authorization));
  }

  /** @protected */
  protected computedTotalPages(totalItems: number, itemsPerPage: number) {
    const rest: number = totalItems % itemsPerPage;
    const dividing: number = totalItems - rest;
    return rest === 0 ? dividing / itemsPerPage : 1 + dividing / itemsPerPage;
  }
}
