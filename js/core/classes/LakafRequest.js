import LakafBaseRequest from "./LakafBaseRequest";
export default class LakafRequest extends LakafBaseRequest {
    constructor(rules, urlRules, checkIntruders = true) {
        super(rules, urlRules, checkIntruders);
    }
    validate(req, res) {
        let validation = this.validation(req);
        if (!validation.success) {
            res.json({
                failure: true,
                report: validation.message,
            });
            return [undefined, res];
        }
        validation = this.urlValidation(req);
        if (!validation.success) {
            res.json({
                failure: true,
                report: validation.message,
            });
            return [undefined, res];
        }
        return [req, res];
    }
    validateWithoutSendResponse(req, res) {
        let validation = this.validation(req);
        if (!validation.success) {
            return [undefined, res, validation];
        }
        validation = this.urlValidation(req);
        if (!validation.success) {
            return [undefined, res, validation];
        }
        return [req, res, validation];
    }
}
