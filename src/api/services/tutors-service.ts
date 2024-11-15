import { Database } from "../../config/dbConnection";
import Tutor from "../../shared/models/tutors";


export class TutorsService {
    async getAllTutors(): Promise<Tutor[]> {
        console.log("Getting tutors");
        const query = `SELECT * FROM tutors`;
        const tutors = await Database.query<Tutor[]>(query);
        console.log(tutors);
        return tutors;
    }
}