import { Database } from "../../config/dbConnection";
import Tutor from "../../shared/models/tutor.types";
import CreateTutorDTO from '../../shared/models/tutor.types';


export class TutorsService {
    async getAllTutors(): Promise<Tutor[]> {
        console.log("Getting tutors");
        const query = `SELECT * FROM tutors`;
        const tutors = await Database.query<Tutor[]>(query);
        return tutors;
    }

    async getTutorById(id: number): Promise<Tutor> {
        console.log("Getting tutor by id");
        const query = `SELECT * FROM tutors WHERE id_tutor = ?`;
        const tutor = await Database.query<Tutor[]>(query, [id]);
        return tutor[0];
    }

    async createTutor(tutorData: CreateTutorDTO): Promise<Tutor> {
        console.log("Creating tutor");
        const query = `INSERT INTO tutors (name, email, phone, department, status) VALUES (?, ?, ?, ?, ?)`;
        const tutorCreated = await Database.query<Tutor>(query,
            [tutorData.name, tutorData.email, tutorData.phone, tutorData.department, tutorData.status]);
        return this.getTutorById(tutorCreated.id_tutor);
    }

    async updateTutor(id: number, tutorData: Partial<CreateTutorDTO>): Promise<Tutor> {
        console.log("Updating tutor");
        const setClause = Object.keys(tutorData)
            .map(key => `${key} = ?`)
            .join(', ');

        await Database.query(
            `UPDATE tutors SET ${setClause} WHERE id = ?`,
            [...Object.values(tutorData), id]
        );

        return this.getTutorById(id);
    }

    async deleteTutor(id: number): Promise<boolean> {
        console.log("Deleting tutor");
        const result = await Database.query<any>(`DELETE FROM tutors WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    }
}