import LakafMiddleware from "./LakafMiddleware";
export default class LakafRequestMiddleware extends LakafMiddleware {
    constructor(request, responseOnFail) {
        super();
        this.request = request;
        this.responseOnFail = responseOnFail;
    }
    intercept() {
        return this.useIt((req, res) => {
            const [newReq] = this.request.validateWithoutSendResponse(req, res);
            return Promise.resolve(newReq !== undefined);
        }, this.responseOnFail);
    }
}
