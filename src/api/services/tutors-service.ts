import { Database } from "../../config/dbConnection";
import Tutor from "../../shared/models/tutor.types";
import CreateTutorDTO from '../../shared/models/tutor.types';
import Subject from "../../shared/models/subjects.types";
import { isValidStatus, validateDepartment, validateEmail, validateEmailTutor, validateName, validatePhone, subjectsExist } from '../../shared/helpers/validators';


export class TutorService {
    async getAllTutors(): Promise<Tutor[]> {
        console.log("Getting tutors");
        const query = `SELECT * FROM tutor`;
        const tutors = await Database.query<Tutor[]>(query);
        for (const tutor of tutors) {
            tutor.subjectIds = await this.getTutorSubjects(tutor.id);
        }
        return tutors;
    }

    async getTutorById(id: number): Promise<Tutor> {
        console.log("Getting tutor by id");
        const query = `SELECT * FROM tutor WHERE id = ?`;
        const result = await Database.query<Tutor[]>(query, [id]);
        const tutor = result[0];

        if (tutor) {
            tutor.subjectIds = await this.getTutorSubjects(id);
        }

        return tutor;
    }

    async getTutorSubjects(tutorId: number): Promise<Subject[]> {
        console.log("Getting tutor subjects");
        const query = `
            SELECT s.*
            FROM subject s
            INNER JOIN tutor_subjects ts ON s.id = ts.subject_id
            WHERE ts.tutor_id = ?
        `;
        const tutorSubjects = await Database.query<Subject[]>(query, [tutorId]);
        return tutorSubjects;
    }

    async createTutor(tutorData: CreateTutorDTO, subjectIds: number[] = []): Promise<Tutor> {
        return Database.transaction(async (connection) => {

            if (!validateName(tutorData.name)) throw new Error('Nombre de tutor inválido');
            if (!validateDepartment(tutorData.department)) throw new Error('Departamento inválido');
            if (!validateEmail(tutorData.email)) throw new Error('Email inválido');
            if (!validatePhone(tutorData.phone)) throw new Error('Teléfono inválido');
            if (!isValidStatus(tutorData.status)) throw new Error('Estado inválido');

            const isEmailUnique = await validateEmailTutor(tutorData.email);
            if (!isEmailUnique) throw new Error('Email ya registrado');

            if (subjectIds.length > 0) {
                const SubjectsExist = await subjectsExist(connection, subjectIds);
                if (!SubjectsExist) throw new Error('Existen materias no registradas');
            }

            const query = 'INSERT INTO tutor (name, email, phone, department, status) VALUES(?, ?, ?, ?, ?)'
            const [tutorCreated] = await connection.execute(query,
                [tutorData.name, tutorData.email, tutorData.phone, tutorData.department, tutorData.status]
            );
            console.log(tutorCreated);
            const tutorId = Database.getInsertId(tutorCreated);

            await this.assignSubjectsToTutor(tutorId, subjectIds, 'add');

            return this.getTutorById(tutorId);
        });
    }

    async assignSubjectsToTutor(tutorId: number, subjectIds: number[], mode: 'replace' | 'add'): Promise<void> {
        console.log("Assigning subjects to tutor");

        switch (mode) {
            case 'replace':
                await this.removeSubjectsFromTutor(tutorId, subjectIds);
                break;

            case 'add':
                break;
        }

        if (subjectIds.length > 0) {
            const placeholders = subjectIds.map(() => '(?, ?)').join(', ');
            const values = subjectIds.flatMap(subjectId => [tutorId, subjectId]);

            const query = `
                INSERT INTO tutor_subjects (tutor_id, subject_id)
                VALUES ${placeholders}
                ON DUPLICATE KEY UPDATE tutor_id = tutor_id
            `;

            await Database.query(query, values);
        }
    }

    async updateTutor(id: number, tutorData: Partial<CreateTutorDTO>, subjectIds?: number[]): Promise<Tutor> {
        return Database.transaction(async (connection) => {
            if (tutorData.name !== undefined && !validateName(tutorData.name)) throw new Error('Nombre de tutor inválido');
            if (tutorData.department !== undefined && !validateDepartment(tutorData.department)) throw new Error('Departamento inválido');
            if (tutorData.status !== undefined && !isValidStatus(tutorData.status)) throw new Error('Estado inválido');
            if (tutorData.phone !== undefined && !validatePhone(tutorData.phone)) throw new Error('Teléfono inválido');
            if (tutorData.email !== undefined && !validateEmail(tutorData.email)) throw new Error('Email inválido');

            if (tutorData.email !== undefined) {
                const isEmailUnique = await validateEmailTutor(tutorData.email, id);
                if (!isEmailUnique) throw new Error('Email ya registrado');
            }
            const setClause = Object.keys(tutorData)
            .map(key => `${key} = ?`)
            .join(',');
            await connection.execute(
                `UPDATE tutor SET ${setClause} WHERE id = ? `,
                [...Object.values(tutorData), id]
            );

            if (subjectIds !== undefined && subjectIds.length > 0) {
                const isSubjectsValid = await subjectsExist(connection, subjectIds);
                if (!isSubjectsValid) throw new Error('Algunas materias no están registradas');
                await this.assignSubjectsToTutor(id, subjectIds, 'replace');
            }

            return this.getTutorById(id);
        })
    }

    async deleteTutor(id: number): Promise<boolean> {
        console.log("Deleting tutor");
        const result = await Database.query<any>(`DELETE FROM tutor WHERE id = ? `, [id]);
        return result.affectedRows > 0;
    }

    async removeSubjectsFromTutor(tutorId: number, subjectIds: number[]): Promise<void> {
        console.log(tutorId)
        console.log(subjectIds)
        const query = `DELETE FROM tutor_subjects WHERE tutor_id = ? AND subject_id IN (${subjectIds.join(',')})`;
        await Database.query(query, [tutorId, ...subjectIds]);
    }
}