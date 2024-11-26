import { Request, Response } from 'express';
import { LogsService } from '../services/logs-service';
import { DatabaseError, ValidationError } from '../../shared/errors/AppErrors';
import { CreateLogDTO, Log } from '../../shared/models/logs.types';


export class LogsController {

    constructor(private logsService: LogsService = new LogsService()) {
    }

    getLogs = async (req: Request, res: Response): Promise<void> => {
        try {
            const logs = await this.logsService.getAllLogsWithInfo();
            res.status(200).json({
                status: 'success',
                code: 'OK',
                message: 'Registros obtenidos',
                data: logs
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

    getLogById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const log = await this.logsService.getLogById(id);

            if (!log) {
                res.status(404).json({
                    status: 'error',
                    code: 'NOT_FOUND',
                    message: 'Registro no encontrado'
                });
                return;
            }

            res.status(200).json({
                status: 'success',
                code: 'OK',
                message: 'Registro obtenido',
                data: log
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

    createLog = async (req: Request, res: Response): Promise<void> => {
        try {
            const logData: CreateLogDTO = req.body;
            const newLog = await this.logsService.createLog(logData);
            res.status(201).json({
                status: 'success',
                code: 'CREATED',
                message: 'Registro creado',
                data: newLog
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

    updateLog = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const logData: Partial<CreateLogDTO> = req.body;
            const updatedLog = await this.logsService.updateLog(id, logData);

            if (!updatedLog) {
                res.status(404).json({
                    status: 'error',
                    code: 'NOT_FOUND',
                    message: 'Registro no encontrado'
                });
                return;
            }

            res.status(200).json({
                status: 'success',
                code: 'UPDATED',
                message: 'Registro actualizado',
                data: updatedLog
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

    deleteLog = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.logsService.deleteLog(id);

            if (!deleted) {
                res.status(404).json({
                    status: 'error',
                    code: 'NOT_FOUND',
                    message: 'Registro no encontrado'
                });
                return;
            }
            res.status(200).json({
                status: 'success',
                code: 'DELETED',
                message: 'Registro eliminado'
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