import { Request, Response } from "express";
import { LakafResourceControllerInterface } from "../types/index";

export default abstract class LakafAbstractResourceController
  implements LakafResourceControllerInterface
{
  index(req: Request, res: Response) {}

  create(req: Request, res: Response) {}

  store(req: Request, res: Response) {}

  show(req: Request, res: Response) {}

  edit(req: Request, res: Response) {}

  update(req: Request, res: Response) {}

  destroy(req: Request, res: Response) {}
}
