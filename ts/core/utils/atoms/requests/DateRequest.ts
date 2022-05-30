import LakafRequest from "../../../classes/LakafRequest";

export default class DateRequest extends LakafRequest {
  constructor() {
    super({
      date_field: {
        custom: {
          messageOnFail: "The date field must be a correct value of date.",
          callback(value) {
            if (typeof value !== "string") return false;

            if (![value.split("-").length, value.split("/").length].includes(3))
              return false;

            const values: string[] = value.split(/[-/]/);
            const yearValidator = /^[12][0-9]{3}$/.test;
            const monthValidator = /^0[1-9]|1[0-2]$/.test;
            const dayValidator = /^[012][1-9]|30|31$/.test;

            const removingYear: string[] = values.filter(
              (v) => !yearValidator(v)
            );

            if (removingYear.length === 3) return false;

            const report: boolean[] = [
              ...removingYear.map((el) => monthValidator(el)),
              ...removingYear.map((el) => dayValidator(el)),
            ];

            return report.filter((el) => el).length === 3;
          },
        },
      },
    });
  }
}
