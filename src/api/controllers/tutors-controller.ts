import { Request, Response } from 'express';
import { TutorService } from '../services/tutors-service';
import CreateTutorDTO from '../../shared/models/tutor.types';


export class TutorController {

    constructor(private tutorService: TutorService = new TutorService()) {
    }

    getTutors = async (req: Request, res: Response): Promise<void> => {
        try {
            const tutors = await this.tutorService.getAllTutors();
            res.json(tutors);
        } catch (error) {
            res.status(500).json({
                message: 'Error getting tutors',
                error: (error)
            });
        }
    }

    getTutorById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const tutor = await this.tutorService.getTutorById(id);
            if (!tutor) {
                res.status(404).json({
                    message: 'Tutor not found'
                });
                return;
            }
            res.json(tutor);
        } catch (error) {
            res.status(500).json({
                message: 'Error getting tutor',
                error: (error)
            });
        }
    }


    createTutor = async (req: Request, res: Response): Promise<void> => {
        try {
            const { tutorData, subjectIds } = req.body;
            if (!subjectIds || subjectIds.length === 0) {
                res.status(400).json({
                    message: 'At least one subject is required'
                });
                return;
            }
            const newTutor = await this.tutorService.createTutor(tutorData, subjectIds);
            res.status(201).json(newTutor);
        } catch (error) {
            res.status(500).json({
                message: 'Error creating tutor',
                error: (error)
            });
        }
    }

    updateTutor = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const { tutorData, subjectIds } = req.body;
            const updatedTutor = await this.tutorService.updateTutor(id, tutorData, subjectIds);

            if (!updatedTutor) {
                res.status(404).json({
                    message: 'Tutor not found'
                });
                return;
            }

            res.json(updatedTutor);
        } catch (error) {
            res.status(500).json({
                message: 'Error updating tutor',
                error: (error)
            });
        }
    }

    deleteTutor = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.tutorService.deleteTutor(id);

            if (!deleted) {
                res.status(404).json({
                    message: 'Tutor not found'
                });
                return;
            }

            res.json({
                message: 'Tutor deleted'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error deleting tutor',
                error: (error)
            });
            console.log(error);
        }

    }

    removeSubjects = async (req: Request, res: Response): Promise<void> => {
        try {
            const tutorId = parseInt(req.params.id);
            const { subjectIds } = req.body;

            await this.tutorService.removeSubjectsFromTutor(tutorId, subjectIds);
            const updatedTutor = await this.tutorService.getTutorById(tutorId);

            res.json(updatedTutor);
        } catch (error) {
            res.status(500).json({ message: 'Error removing subjects', error });
        }
    }
}