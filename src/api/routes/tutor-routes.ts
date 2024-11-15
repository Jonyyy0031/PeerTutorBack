import { Router } from "express";
import { TutorController } from "../controllers/tutor-controller";

const router = Router();
const tutorController = new TutorController();

router.get("/tutors", tutorController.getTutors);

export default router;