import type { NextFunction, Request, Response } from "express";
import Service from "../service/Service.js";

class Controller {
    async getAlive(req: Request, res: Response, next: NextFunction) {
        try {
    
            const data = await Service.getAlive();

            return res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default new Controller();
