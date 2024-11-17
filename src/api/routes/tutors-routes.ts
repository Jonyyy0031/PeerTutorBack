import { Router } from "express";
import { TutorController } from "../controllers/tutors-controller";

const router = Router();
const tutorController = new TutorController();

router.get("/tutors", tutorController.getTutors);
router.get("/tutors/:id", tutorController.getTutorById);
router.post("/tutors", tutorController.createTutor);
router.post("/tutors/:id/subjects", tutorController.assingSubjectsToTutor);
router.put("/tutors/:id", tutorController.updateTutor);
router.delete("/tutors/:id", tutorController.deleteTutor);
router.delete("/tutors/:id/subjects", tutorController.removeSubjects);

export default router;