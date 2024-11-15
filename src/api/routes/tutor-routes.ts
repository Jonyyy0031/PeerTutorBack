import { Router } from "express";
import { TutorController } from "../controllers/tutor-controller";

const router = Router();
const tutorController = new TutorController();

router.get("/tutors", tutorController.getTutors);
router.get("/tutors/:id", tutorController.getTutorById);
router.post("/tutors", tutorController.createTutor);
router.put("/tutors/:id", tutorController.updateTutor);
router.delete("/tutors/:id", tutorController.deleteTutor);

export default router;