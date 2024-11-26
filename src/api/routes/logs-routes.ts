import { Router } from "express";
import { LogsController } from "../controllers/logs-controller";

const router = Router();
const logsController = new LogsController();

router.get("/logs", logsController.getLogs);
router.get("/logs/:id", logsController.getLogById);
router.post("/logs", logsController.createLog);
router.put("/logs/:id", logsController.updateLog);
router.delete("/logs/:id", logsController.deleteLog);

export default router;