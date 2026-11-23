import { Router } from "express";
import Controller from "../controllers/Controller.js";

const router = Router();

router.get('/proxy/alive', Controller.getAlive);

router.post('/proxy/request', Controller.request);

export default router;
