import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/AppErrors';

export const validateBodyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {

        if (['GET', 'DELETE'].includes(req.method)) {
            return next();
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            throw new ValidationError('El json no puede estar vacío');
        }

        next();
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({
                status: 'error',
                code: 'VALIDATION_ERROR',
                message: error.message
            });
            return;
        }

        res.status(500).json({
            status: 'error',
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Error al validar el json'
        });
    }
};