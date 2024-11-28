import { Request, Response, NextFunction } from 'express';
import { validateJWT } from '../helpers/handleJWT';

//Express espera que un middleware devuelva void

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(`${req.method} from ${req.path}`);
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'No token provided'
      });
      return
    }

    const decoded = await validateJWT(token);

    if (!decoded) {
      res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Invalid token'
      });
      return
    }

    next();

  } catch (error) {
    res.status(401).json({
      status: 'error',
      code: 'UNAUTHORIZED',
      message: 'Authentication failed'
    });
  }
};