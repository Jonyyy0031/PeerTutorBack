import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppErrors';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(error);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            code: error.code,
            message: error.message
        });
    }

    return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ha ocurrido un error interno'
    });
};