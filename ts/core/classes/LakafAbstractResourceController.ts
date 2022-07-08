import { Request, Response } from "express";
import { LakafResourceControllerInterface } from "../types/index";

export default abstract class LakafAbstractResourceController
  implements LakafResourceControllerInterface
{
  /**
   * @param { Request } req
   * @param { Response } res
   */
  index(req: Request, res: Response) {}

  /**
   * @param { Request } req
   * @param { Response } res
   */
  create(req: Request, res: Response) {}

  /**
   * @param { Request } req
   * @param { Response } res
   */
  store(req: Request, res: Response) {}

  /**
   * @param { Request } req
   * @param { Response } res
   */
  show(req: Request, res: Response) {}

  /**
   * @param { Request } req
   * @param { Response } res
   */
  edit(req: Request, res: Response) {}

  /**
   * @param { Request } req
   * @param { Response } res
   */
  update(req: Request, res: Response) {}

  /**
   * @param { Request } req
   * @param { Response } res
   */
  destroy(req: Request, res: Response) {}
}
