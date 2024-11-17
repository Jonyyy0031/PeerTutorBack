import { Database } from "../../config/dbConnection";
import Tutor_Subject from "../../shared/models/tutor_subject";
import Tutor from "../../shared/models/tutor.types";
import CreateTutorDTO from '../../shared/models/tutor.types';
import Subject from "../../shared/models/subjects.types";


export class TutorService {
    async getAllTutors(): Promise<Tutor[]> {
        console.log("Getting tutors");
        const query = `SELECT * FROM tutors`;
        const tutors = await Database.query<Tutor[]>(query);

        for (const tutor of tutors) {
            tutor.subjects = await this.getTutorSubjects(tutor.id_tutor);
        }
        console.log(tutors);
        return tutors;
    }

    async getTutorById(id: number): Promise<Tutor> {
        console.log("Getting tutor by id");
        const query = `SELECT * FROM tutors WHERE id_tutor = ?`;
        const result = await Database.query<Tutor[]>(query, [id]);

        const tutor = result[0];

        if (tutor) {
            tutor.subjects = await this.getTutorSubjects(id);
        }

        return tutor;
    }

    async getTutorSubjects(tutorId: number): Promise<Subject[]> {
        console.log("Getting tutor subjects");
        const query = `
            SELECT s.*
            FROM subjects s
            INNER JOIN tutor_subjects ts ON s.id_subject = ts.subject_id
            WHERE ts.tutor_id = ?
        `;
        const tutorSubjects = await Database.query<Subject[]>(query, [tutorId]);
        return tutorSubjects;
    }

    async createTutor(tutorData: CreateTutorDTO, subjectIds: number[] = []): Promise<Tutor> {
        console.log("Creating tutor");
        const query = `INSERT INTO tutors (name, email, phone, department, status) VALUES(?, ?, ?, ?, ?)`;
        const tutorCreated = await Database.query<any>(query,
            [tutorData.name, tutorData.email, tutorData.phone, tutorData.department, tutorData.status]);
        const tutorId = tutorCreated.insertId;

        if (subjectIds.length > 0) {
            await this.assignSubjectsToTutor(tutorId, subjectIds);
        }

        return this.getTutorById(tutorId);
    }

    async assignSubjectsToTutor(tutorId: number, subjectIds: number[]): Promise<void> {

        const placeholders = subjectIds.map(() => '(?, ?)').join(', ');
        const query = `INSERT INTO tutor_subjects (tutor_id, subject_id) VALUES ${placeholders}`;
        const values: any[] = [];
        for (const subjectId of subjectIds) {
            values.push(tutorId, subjectId);
        }
        await Database.query(query, values);
    }

    async updateTutor(id: number, tutorData: Partial<CreateTutorDTO>, subjectIds?: number[]): Promise<Tutor> {
        console.log("Updating tutor");
        const setClause = Object.keys(tutorData)
            .map(key => `${key} = ?`)
            .join(', ');
        await Database.query(
            `UPDATE tutors SET ${setClause} WHERE Id_Tutor = ? `,
            [...Object.values(tutorData), id]
        );
        if (subjectIds && subjectIds.length > 0) {

        }

        return this.getTutorById(id);
    }

    async deleteTutor(id: number): Promise<boolean> {
        console.log("Deleting tutor");
        const result = await Database.query<any>(`DELETE FROM tutors WHERE Id_Tutor = ? `, [id]);
        return result.affectedRows > 0;
    }

    async removeSubjectsFromTutor(tutorId: number, subjectIds: number[]): Promise<void> {
        await Database.query(
            'DELETE FROM tutor_subjects WHERE tutor_id = ? AND subject_id IN (?)',
            [tutorId, subjectIds]
        );
    }
}