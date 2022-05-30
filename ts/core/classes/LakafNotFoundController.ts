import { Request, Response } from "express";
import LakafBaseController from "./LakafBaseController";

class NotFoundController extends LakafBaseController {
  constructor() {
    super();
  }

  response(req: Request, res: Response): void {
    res.json({ msg: "Not found route !!" });
  }
}

const LakafNotFoundController = new NotFoundController();

export default LakafNotFoundController;
