const cameroonianPhone = {
  isMTNNumber(value: number | string): boolean {
    return /^2376(5[0-4]|7[0-9]|80)[0-9]{6}$/.test(String(value));
  },
  isOrangeNumber(value: number | string): boolean {
    return /^2376(5[5-9]|9[0-9])[0-9]{6}$/.test(String(value));
  },
  isNexttelNumber(value: number | string): boolean {
    return /^23766[0-9]{7}$/.test(String(value));
  },
  isCamTelNumber(value: number | string): boolean {
    return /^2372(22|33|42|43)[0-9]{6}$/.test(String(value));
  },
  cameroonianPhoneNumberValidator(value: number | string): boolean {
    return (
      cameroonianPhone.isCamTelNumber(value) ||
      cameroonianPhone.isNexttelNumber(value) ||
      cameroonianPhone.isOrangeNumber(value) ||
      cameroonianPhone.isMTNNumber(value)
    );
  },
};

export default cameroonianPhone;
