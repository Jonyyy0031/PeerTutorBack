import { Request, Response, NextFunction } from 'express';
import { validateJWT } from '../helpers/handleJWT';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(`${req.method} from ${req.path}`);
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided'
      });
    }

    const decoded = await validateJWT(token);

    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
};