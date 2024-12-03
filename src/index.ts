import express, { Application, Router } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

import UserController from './api/controllers/users-controller';
import TutorController from './api/controllers/tutors-controller';
import LogsController from './api/controllers/logs-controller';

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
const tutorController = new TutorController();
const logController = new LogsController();

const app: Application = express();

const publicRouter = Router();
const protectedRouter = Router();

app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json());

app.use('/api/public', publicRouter);
app.use('/api/admin', protectedRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});
publicRouter.post("/login", userController.login);
publicRouter.get("/tutors", tutorController.getTutors);
publicRouter.post("/tutors/:id", tutorController.tutorFeedback);
publicRouter.post("/logs", logController.createLog);

protectedRouter.use(validateBodyMiddleware);
protectedRouter.use(authMiddleware);

protectedRouter.use(userRouter);
protectedRouter.use(subjectRouter);
protectedRouter.use(tutorRouter);
protectedRouter.use(logsRouter);

app.use(errorHandler as any);

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
