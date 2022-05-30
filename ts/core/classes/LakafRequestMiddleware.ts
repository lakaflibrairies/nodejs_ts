import { Json, LakafMiddlewareAction } from "../types/index";
import LakafMiddleware from "./LakafMiddleware";
import LakafRequest from "./LakafRequest";

export default class LakafRequestMiddleware extends LakafMiddleware {
  constructor(
    private request: LakafRequest,
    private responseOnFail?: Json | string
  ) {
    super();
  }

  intercept(): LakafMiddlewareAction {
    return this.useIt((req, res) => {
      const [newReq] =
        this.request.validateWithoutSendResponse(req, res);
        return Promise.resolve(newReq !== undefined);
    }, this.responseOnFail);
  }
}
