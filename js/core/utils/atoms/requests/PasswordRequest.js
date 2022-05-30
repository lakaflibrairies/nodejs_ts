import LakafRequest from "../../../classes/LakafRequest";
export default class PasswordRequest extends LakafRequest {
    constructor() {
        super({
            password: {
                required: { messageOnFail: "Password field is required." },
                text: {
                    minLength: 1,
                    messageOnFail: "Password field must be not empty.",
                },
            },
        });
    }
}
