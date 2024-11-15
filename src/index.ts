import express, { Application } from 'express';
import cors from 'cors';
import tutorRouter from './api/routes/tutor-routes';

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json());

app.use("/api", tutorRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
