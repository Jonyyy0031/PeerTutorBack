import { Router } from "express";
import SubjectsController from '../controllers/subjects-controller';

const router = Router();
const subjectsController = new SubjectsController();

router.get("/subjects", subjectsController.getSubjects);
router.get("/subjects/:id", subjectsController.getSubjectById);
router.post("/subjects", subjectsController.createSubject);
router.put("/subjects/:id", subjectsController.updateSubject);
router.delete("/subjects/:id", subjectsController.deleteSubject);

export default router;