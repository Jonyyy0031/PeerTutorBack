import { Request, Response } from 'express';
import { SubjectService } from '../services/subjects-service';
import CreateSubjectDTO from '../../shared/models/subjects.types';


export class SubjectsController {

    constructor(private subjectService: SubjectService = new SubjectService()) {
    }

    getSubjects = async (req: Request, res: Response): Promise<void> => {
        try {
            const subjects = await this.subjectService.getAllSubjects();
            res.json(subjects);
        } catch (error) {
            res.status(500).json({
                message: 'Error getting subjects',
                error: (error)
            });
        }
    }

    getSubjectById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const subject = await this.subjectService.getSubjectById(id);

            if (!subject) {
                res.status(404).json({
                    message: 'Subject not found'
                });
                return;
            }

            res.json(subject);

        } catch (error) {
            res.status(500).json({
                message: 'Error getting subject',
                error: (error)
            });
        }
    }



    createSubject = async (req: Request, res: Response): Promise<void> => {
        try {
            const subjectData: CreateSubjectDTO = req.body;
            const newSubject = await this.subjectService.createSubject(subjectData);
            res.status(201).json(newSubject);
        } catch (error) {
            res.status(500).json({
                message: 'Error creating subject',
                error: (error)
            });
        }
    }

    updateSubject = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const subjectData: Partial<CreateSubjectDTO> = req.body;
            const updatedSubject = await this.subjectService.updateSubject(id, subjectData);

            if (!updatedSubject) {
                res.status(404).json({
                    message: 'Subject not found'
                });
                return;
            }

            res.json(updatedSubject);
        } catch (error) {
            res.status(500).json({
                message: 'Error updating subject',
                error: (error)
            });
        }
    }

    deleteSubject = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.subjectService.deleteSubject(id);

            if (!deleted) {
                res.status(404).json({
                    message: 'Subject not found'
                });
                return;
            }

            res.json({
                message: 'Subject deleted'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error deleting subject',
                error: (error)
            });
        }
    }

}