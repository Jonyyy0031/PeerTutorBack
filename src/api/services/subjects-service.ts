import { Database } from "../../config/dbConnection";
import { DatabaseError, ValidationError } from "../../shared/errors/AppErrors";
import { isValidStatus, validateDepartment, validateName, validateNameSubject, validateDBSubjectName } from "../../shared/helpers/validators";
import Subject from "../../shared/models/subjects.types";
import CreateSubjectDTO from '../../shared/models/subjects.types';

export class SubjectService {

    async getAllSubjects(): Promise<Subject[]> {
        console.log("Getting subjects");
        const query = `SELECT * FROM subject`;
        const subjects = await Database.query<Subject[]>(query);
        return subjects;
    }

    async getSubjectById(id: number): Promise<Subject> {
        console.log("Getting subject by id");
        const query = `SELECT * FROM subject WHERE id = ?`;
        const subject = await Database.query<Subject[]>(query, [id]);
        return subject[0];
    }

    async createSubject(subjectData: CreateSubjectDTO): Promise<Subject> {
        return Database.transaction(async (connection) => {
            console.log("Creating subject");
            try {
                if (Object.keys(subjectData).length === 0) throw new ValidationError('Datos vacios');

                validateNameSubject(subjectData.subject_name);
                validateDepartment(subjectData.department);
                isValidStatus(subjectData.status);

                const isNameUnique = await validateDBSubjectName(subjectData.subject_name);
                if (!isNameUnique) throw new ValidationError('La materia ya existe');

                const query = `INSERT INTO subject (subject_name, department, status) VALUES (?, ?, ?)`;
                const [subjectCreated] = await connection.execute(query,
                    [subjectData.subject_name, subjectData.department, subjectData.status]);
                let subjectId = Database.getInsertId(subjectCreated);

                return this.getSubjectById(subjectId);
            } catch (error) {
                if (error instanceof ValidationError) {
                    throw error;
                }
                if (error instanceof DatabaseError) {
                    throw error;
                }
                throw new DatabaseError('Error inesperado al crear materia');
            }
        });
    }

    async updateSubject(id: number, subjectData: Partial<CreateSubjectDTO>): Promise<Subject> {
        console.log("Updating subject");
        return Database.transaction(async (connection) => {
            try {
                if (Object.keys(subjectData).length === 0) throw new ValidationError('Datos vacios');
                if (subjectData.subject_name !== undefined) validateNameSubject(subjectData.subject_name);
                if (subjectData.department !== undefined) validateDepartment(subjectData.department);
                if (subjectData.status !== undefined) isValidStatus(subjectData.status);
                if (subjectData.subject_name !== undefined) {
                    const isNameUnique = await validateDBSubjectName(subjectData.subject_name, id);
                    if (!isNameUnique) throw new ValidationError('La materia ya existe');
                }

                const setClause = Object.keys(subjectData)
                    .map(key => `${key} = ?`)
                    .join(', ');
                await connection.execute(
                    `UPDATE subject SET ${setClause} WHERE id = ?`,
                    [...Object.values(subjectData), id]
                );

                return this.getSubjectById(id);
            } catch (error) {
                if (error instanceof ValidationError) {
                    throw error;
                }
                if (error instanceof DatabaseError) {
                    throw error;
                }
                throw new DatabaseError('Error inesperado al actualizar materia');
            }
        });
    }

    async deleteSubject(id: number): Promise<boolean> {
        console.log("Deleting subject");
        const result = await Database.query<any>(`DELETE FROM subject WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    }
}