import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import tutorRouter from './api/routes/tutors-routes';
import subjectRouter from './api/routes/subjects-routes';
import userRouter from './api/routes/users-routes';

dotenv.config();

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json());

app.use("/api", tutorRouter);
app.use("/api", subjectRouter);
app.use("/api", userRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
