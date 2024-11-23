import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import tutorRouter from './api/routes/tutors-routes';
import subjectRouter from './api/routes/subjects-routes';
import userRouter from './api/routes/users-routes';
import { errorHandler } from './shared/middlewares/errorHandler';

dotenv.config();

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json());

app.use("/api", tutorRouter);
app.use("/api", subjectRouter);
app.use("/api", userRouter);


app.use('*', (req, res) => {
  res.status(404).json({

    status: 'error',
    message: 'NOT_FOUND',
    error: 'Ruta no encontrada'
  });
});

app.use(errorHandler as any)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
