import LakafRequest from "../../../classes/LakafRequest";

export default class SignUpPasswordRequest extends LakafRequest {
  constructor() {
    super({
      password: {
        required: { messageOnFail: "password field is required." },
        text: {
          minLength: 7,
          messageOnFail: "password field must contain more than 7 characters",
        },
      },
    });
  }
}
