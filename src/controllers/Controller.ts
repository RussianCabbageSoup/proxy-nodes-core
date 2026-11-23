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

    async request(req: Request, res: Response, next: NextFunction) {
        try {
            const { targetUrl } = req.body || {};

            const data = await Service.request(targetUrl);

            return res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default new Controller();
