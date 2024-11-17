import { Database } from "../../config/dbConnection";
import Subject from "../../shared/models/subjects.types";
import CreateSubjectDTO from '../../shared/models/subjects.types';

export class SubjectService {

    async getAllSubjects(): Promise<Subject[]> {
        console.log("Getting subjects");
        const query = `SELECT * FROM subjects`;
        const subjects = await Database.query<Subject[]>(query);
        return subjects;
    }

    async getSubjectById(id: number): Promise<Subject> {
        console.log("Getting subject by id");
        const query = `SELECT * FROM subjects WHERE id_subject = ?`;
        const subject = await Database.query<Subject[]>(query, [id]);
        return subject[0];
    }

    async createSubject(subjectData: CreateSubjectDTO): Promise<Subject> {
        console.log("Creating subject");
        const query = `INSERT INTO subjects (name, department) VALUES (?, ?)`;
        const subjectCreated = await Database.query<any>(query,
            [subjectData.name, subjectData.department]);
        return this.getSubjectById(subjectCreated.insertId);
    }

    async updateSubject(id: number, subjectData: Partial<CreateSubjectDTO>): Promise<Subject> {
        console.log("Updating subject");
        const setClause = Object.keys(subjectData)
            .map(key => `${key} = ?`)
            .join(', ');
        await Database.query(
            `UPDATE subjects SET ${setClause} WHERE id_subject = ?`,
            [...Object.values(subjectData), id]
        );

        return this.getSubjectById(id);
    }

    async deleteSubject(id: number): Promise<boolean> {
        console.log("Deleting subject");
        const result = await Database.query<any>(`DELETE FROM subjects WHERE id_subject = ?`, [id]);
        return result.affectedRows > 0;
    }
}