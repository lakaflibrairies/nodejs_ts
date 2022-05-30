import cameroonianPhone from "./cameroonianPhoneHelper";
const phone = Object.assign(Object.assign({}, cameroonianPhone), { cameroonianPhone, phoneNumberValidator(value) {
        return (phone.isCamTelNumber(value) ||
            phone.isNexttelNumber(value) ||
            phone.isOrangeNumber(value) ||
            phone.isMTNNumber(value));
    } });
export default phone;
