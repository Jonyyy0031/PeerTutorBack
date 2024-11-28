import { Request, Response } from 'express';
import { SubjectService } from '../services/subjects-service';
import CreateSubjectDTO from '../../shared/models/subjects.types';
import { DatabaseError, ValidationError } from '../../shared/errors/AppErrors';


export class SubjectsController {

    constructor(private subjectService: SubjectService = new SubjectService()) {
    }

    getSubjects = async (req: Request, res: Response): Promise<void> => {
        try {
            const subjects = await this.subjectService.getAllSubjects();
            res.status(200).json({
                status: 'success',
                code: 'OK',
                message: 'Materias obtenidas',
                data: subjects
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

    getSubjectById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const subject = await this.subjectService.getSubjectById(id);

            if (!subject) {
                res.status(404).json({
                    status: 'error',
                    code: 'NOT_FOUND',
                    message: 'Subject not found'
                });
                return;
            }

            res.status(200).json({
                status: 'success',
                code: 'OK',
                message: 'Materia obtenida',
                data: subject
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



    createSubject = async (req: Request, res: Response): Promise<void> => {
        try {
            const subjectData: CreateSubjectDTO = req.body;
            const newSubject = await this.subjectService.createSubject(subjectData);
            res.status(201).json({
                status: 'success',
                code: 'CREATED',
                message: 'Materia creada',
                data: newSubject
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

    updateSubject = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const subjectData: Partial<CreateSubjectDTO> = req.body;
            const updatedSubject = await this.subjectService.updateSubject(id, subjectData);

            if (!updatedSubject) {
                res.status(404).json({
                    status: 'error',
                    code: 'NOT_FOUND',
                    message: 'Materia no encontrada'
                });
                return;
            }
            res.status(200).json({
                status: 'success',
                code: 'UPDATED',
                message: 'Materia actualizada',
                data: updatedSubject
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

    deleteSubject = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.subjectService.deleteSubject(id);

            if (!deleted) {
                res.status(404).json({
                    status: 'error',
                    code: 'NOT_FOUND',
                    message: 'Materia no encontrada'
                });
                return;
            }

            res.json({
                status: 'success',
                code: 'DELETED',
                message: 'Materia eliminada'
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

}

export default SubjectsController;