import { Router } from "express";
import Controller from "../controllers/Controller.js";

const router = Router();

router.get('/proxy/alive', Controller.getAlive);
export default router;
