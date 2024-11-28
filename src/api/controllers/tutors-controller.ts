import { Request, Response } from 'express';
import { TutorService } from '../services/tutors-service';
import { DatabaseError, ValidationError } from '../../shared/errors/AppErrors';


export class TutorController {

    constructor(private tutorService: TutorService = new TutorService()) {
    }

    getTutors = async (req: Request, res: Response): Promise<void> => {
        try {
            const tutors = await this.tutorService.getAllTutors();
            res.status(200).json({
                status: 'success',
                code: 'OK',
                message: 'Tutores obtenidos',
                data: tutors
            })
        } catch (error) {
            if (error instanceof DatabaseError) {
                res.status(500).json({
                    status: 'error',
                    code: 'DATABASE_ERROR',
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error interno del servidor'
            });
        }
    }

    getTutorById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const tutor = await this.tutorService.getTutorById(id);
            if (!tutor) {
                res.status(404).json({
                    status: 'error',
                    code: 'NOT_FOUND',
                    message: 'Tutor no encontrado'
                });
                return;
            }
            res.status(200).json({
                status: 'success',
                code: 'OK',
                message: 'Tutor obtenido',
                data: tutor
            })
        } catch (error) {
            if (error instanceof DatabaseError) {
                res.status(500).json({
                    status: 'error',
                    code: 'DATABASE_ERROR',
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error interno del servidor'
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
            res.status(201).json({
                status: 'success',
                code: 'CREATED',
                message: 'Tutor creado',
                data: newTutor
            })
        } catch (error: any) {
            if (error instanceof ValidationError) {
                res.status(400).json({
                    status: 'error',
                    code: 'VALIDATION_ERROR',
                    message: error.message
                });
                return;
            }
            if (error instanceof DatabaseError) {
                res.status(500).json({
                    status: 'error',
                    code: 'DATABASE_ERROR',
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error interno del servidor'
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
                    status: 'error',
                    code: 'NOT_FOUND',
                    message: 'Tutor no encontrado'
                });
                return;
            }

            res.status(200).json({
                status: 'success',
                code: 'UPDATED',
                message: 'Tutor actualizado',
                data: updatedTutor
            })
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).json({
                    status: 'error',
                    code: 'VALIDATION_ERROR',
                    message: error.message
                });
                return;
            }
            if (error instanceof DatabaseError) {
                if (error.message.includes('Ya existe')) {
                    res.status(409).json({
                        status: 'error',
                        code: 'DUPLICATE_ENTRY',
                        message: error.message
                    });
                    return;
                }
                res.status(500).json({
                    status: 'error',
                    code: 'DATABASE_ERROR',
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error interno del servidor'
            });
        }
    }

    deleteTutor = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.tutorService.deleteTutor(id);

            if (!deleted) {
                res.status(404).json({
                    status: 'error',
                    code: 'NOT_FOUND',
                    message: 'Tutor no encontrado'
                });
                return;
            }

            res.json({
                status: 'success',
                code: 'DELETED',
                message: 'Tutor eliminado'
            });
        } catch (error) {
            if (error instanceof DatabaseError) {
                res.status(500).json({
                    status: 'error',
                    code: 'DATABASE_ERROR',
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error interno del servidor'
            });

        }

    }
}

export default TutorController;