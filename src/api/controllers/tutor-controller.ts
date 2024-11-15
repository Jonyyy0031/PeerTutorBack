import { Request, Response } from 'express';
import { TutorsService } from '../services/tutors-service';
import CreateTutorDTO from '../../shared/models/tutor.types';
import { parse } from 'path';

export class TutorController {

    constructor(private tutorsService: TutorsService = new TutorsService()) {
    }

    getTutors = async (req: Request, res: Response): Promise<void> => {
        try {
            const tutors = await this.tutorsService.getAllTutors();
            res.json(tutors);
        } catch (error) {
            res.status(500).json({
                message: 'Error getting tutors',
                error: (error)
            });
            console.log(error);
        }
    }

    getTutorById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const tutor = await this.tutorsService.getTutorById(id);

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
            console.log(error);
        }
    }

    createTutor = async (req: Request, res: Response): Promise<void> => {
        try {
            const tutorData: CreateTutorDTO = req.body;
            const newTutor = await this.tutorsService.createTutor(tutorData);
            res.status(201).json(newTutor);
        } catch (error) {
            res.status(500).json({
                message: 'Error creating tutor',
                error: (error)
            });
            console.log(error);
        }
    }

    updateTutor = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const tutorData: Partial<CreateTutorDTO> = req.body;
            const updatedTutor = await this.tutorsService.updateTutor(id, tutorData);

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
            console.log(error);
        }
    }

    deleteTutor = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.tutorsService.deleteTutor(id);

            if (!deleted) {
                res.status(404).json({
                    message: 'Tutor not found'
                });
                return;
            }

            res.status(204).json({
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

}