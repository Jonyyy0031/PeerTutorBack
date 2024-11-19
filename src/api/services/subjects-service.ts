import { Database } from "../../config/dbConnection";
import { isValidStatus, validateDepartment, validateName, validateSubjectName } from "../../shared/helpers/validators";
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
        return Database.transaction(async (connection) => {
        if (!validateName(subjectData.name)) throw new Error('Nombre de materia inválido');
        if (!validateDepartment(subjectData.department)) throw new Error('Departamento inválido');
        if (!isValidStatus(subjectData.status)) throw new Error('Estado inválido');

        const isNameUnique = await validateSubjectName(subjectData.name);
        if (!isNameUnique) throw new Error('Nombre ya registrado');

        const query = `INSERT INTO subjects (name, department, status) VALUES (?, ?, ?)`;
        const subjectCreated = await Database.query<any>(query,
            [subjectData.name, subjectData.department, subjectData.status]);
        return this.getSubjectById(subjectCreated.insertId);
        });
    }

    async updateSubject(id: number, subjectData: Partial<CreateSubjectDTO>): Promise<Subject> {
        console.log("Updating subject");

        if (subjectData.name !== undefined && !validateName(subjectData.name)) throw new Error('Nombre de materia inválido');

        if (subjectData.department !== undefined && !validateDepartment(subjectData.department)) throw new Error('Departamento inválido');

        if (subjectData.status !== undefined && !isValidStatus(subjectData.status)) throw new Error('Estado inválido');

        if (subjectData.name !== undefined) {
            const isNameUnique = await validateSubjectName(subjectData.name, id);
            if (!isNameUnique) throw new Error('Nombre ya registrado');
        }

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