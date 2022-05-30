import LakafRequest from "../../../classes/LakafRequest";
import cameroonianPhone from "../../../../helpers/cameroonianPhoneHelper";
export default class CameroonianPhoneNumberRequest extends LakafRequest {
    constructor() {
        super({
            phone_number: {
                custom: {
                    messageOnFail: "This field contains a wrong cameroonian phone number.",
                    callback(value) {
                        return cameroonianPhone.cameroonianPhoneNumberValidator(value);
                    },
                },
            },
        });
    }
}
