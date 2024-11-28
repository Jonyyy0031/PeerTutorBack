import express, { Application, Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import UserController from './api/controllers/users-controller';

import tutorRouter from './api/routes/tutors-routes';
import subjectRouter from './api/routes/subjects-routes';
import userRouter from './api/routes/users-routes';
import logsRouter from './api/routes/logs-routes';

import { errorHandler } from './shared/middlewares/errorHandler';
import { authMiddleware } from './shared/middlewares/auth';
import { validateBodyMiddleware } from './shared/middlewares/validateBody';

dotenv.config();

const PORT = process.env.PORT || 3000;

const userController = new UserController();

const apiRouter = Router();

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json());

app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});


apiRouter.post("/login", userController.login);

apiRouter.use(validateBodyMiddleware)
apiRouter.use(authMiddleware);
apiRouter.use(userRouter);
apiRouter.use(subjectRouter);
apiRouter.use(tutorRouter);
apiRouter.use(logsRouter);

app.use(errorHandler as any)

app.use('*', (req, res) => {
  res.status(404).json({

    status: 'error',
    message: 'NOT_FOUND',
    error: `Ruta ${req.originalUrl} no encontrada`
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
