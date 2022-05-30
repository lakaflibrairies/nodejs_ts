import cameroonianPhone from "./cameroonianPhoneHelper";

const phone = {
  ...cameroonianPhone,
  cameroonianPhone,
  phoneNumberValidator(value: number | string): boolean {
    return (
      phone.isCamTelNumber(value) ||
      phone.isNexttelNumber(value) ||
      phone.isOrangeNumber(value) ||
      phone.isMTNNumber(value)
    );
  },
};

export default phone;
