import LakafRequest from "../../../classes/LakafRequest";

export default class EmailRequest extends LakafRequest {
  constructor() {
    super({
      email: {
        required: { messageOnFail: "Email field is required." },
        // Another validation can be inserted here !!
      },
    });
  }
}
