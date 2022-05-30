import LakafBaseController from "./LakafBaseController";
class NotFoundController extends LakafBaseController {
    constructor() {
        super();
    }
    response(req, res) {
        res.json({ msg: "Not found route !!" });
    }
}
const LakafNotFoundController = new NotFoundController();
export default LakafNotFoundController;
