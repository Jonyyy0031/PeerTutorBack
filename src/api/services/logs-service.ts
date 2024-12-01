import { Database } from "../../config/dbConnection";
import { Log, CreateLogDTO } from "../../shared/models/logs.types";
import { DatabaseError, ValidationError } from "../../shared/errors/AppErrors";
import { scheduleExist, subjectsExist, tutorExist, validateGroup, validateName, validateSchedule } from "../../shared/helpers/validators";
import { query } from "express";

export class LogsService {

    async getAllLogs(): Promise<Log[]> {
        const query = `SELECT * FROM log`;
        const logs = await Database.query<Log[]>(query);
        return logs;
    }

    async getLogById(id: number): Promise<Log> {
        const query = `
            SELECT l.*, s.day_of_week, s.hour
            FROM log l
            LEFT JOIN schedule s ON l.id = s.log_id
            WHERE l.id = ?`;
        const log = await Database.query<any[]>(query, [id]);
        return log[0];
    }

    async getLogWithInfo(id: number): Promise<Log> {
        const query = `
            SELECT l.*, t.tutor_name, s.subject_name, sc.day_of_week, sc.hour
            FROM log l
            JOIN tutor t ON l.tutor_id = t.id
            JOIN subject s ON l.subject_id = s.id
            JOIN schedule sc ON l.id = sc.log_id
            WHERE l.id = ?`;
        const log = await Database.query<any[]>(query, [id]);
        return log[0];
    }

    async getAllLogsWithInfo(): Promise<Log[]> {
        const query = `
            SELECT l.*, t.tutor_name, s.subject_name, sc.day_of_week, sc.hour
            FROM log l
            JOIN tutor t ON l.tutor_id = t.id
            JOIN subject s ON l.subject_id = s.id
            JOIN schedule sc ON l.id = sc.log_id
        `;
        const logs = await Database.query<any[]>(query);
        return logs;
    }

    async createLog(logData: CreateLogDTO): Promise<Log> {
        return Database.transaction(async (connection) => {
            try {
                validateName(logData.student_name);
                validateGroup(logData.student_group);
                await tutorExist(connection, logData.tutor_id);
                await subjectsExist(connection, [logData.subject_id]);
                validateSchedule(logData.schedules);
                await scheduleExist(connection, logData);

                const query = `INSERT INTO log (student_name, student_group, tutor_id, subject_id) VALUES (?, ?, ?, ?)`;
                const [logCreated] = await connection.execute(query,
                    [logData.student_name, logData.student_group, logData.tutor_id, logData.subject_id]);
                let logId = Database.getInsertId(logCreated);

                await this.insertSchedule(logId, logData.schedules);

                return this.getLogById(logId);

            } catch (error) {
                if (error instanceof ValidationError) {
                    throw error;
                }
                if (error instanceof DatabaseError) {
                    throw error;
                }
                throw new DatabaseError('Error inesperado al crear log');
            }
        });
    }

    async updateLog(id: number, logData: Partial<CreateLogDTO>): Promise<Log> {
        return Database.transaction(async (connection) => {
            try {

                const {schedules, ...updateData} = logData;
                console.log(updateData);
                if (logData.student_name !== undefined) validateName(logData.student_name);
                if (logData.student_group !== undefined) validateGroup(logData.student_group);
                if (logData.tutor_id !== undefined) tutorExist(connection, logData.tutor_id);
                if (logData.subject_id !== undefined) subjectsExist(connection, [logData.subject_id]);

                const setClause = Object.keys(updateData)
                .map(key => `${key} = ?`)
                .join(', ');
                await connection.execute(
                    `UPDATE log SET ${setClause} WHERE id = ?`,
                    [...Object.values(updateData), id]
                );

                if (schedules) {
                    validateSchedule(schedules);
                    await scheduleExist(connection, logData);
                    await this.updateSchedule(id, schedules);
                }

                return this.getLogWithInfo(id);
            } catch (error) {
                if (error instanceof ValidationError) {
                    throw error;
                }
                if (error instanceof DatabaseError) {
                    throw error;
                }
            throw new DatabaseError('Error inesperado al actualizar el registro' + error);
            }
        });
    }

    async deleteLog(id: number): Promise<boolean> {
        console.log("Deleting log");
        const result = await Database.query<any>(`DELETE FROM log WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    }

    async insertSchedule(logId: number, schedule: any): Promise<boolean> {
        console.log("Inserting schedule");
        const query = `INSERT INTO schedule (log_id, day_of_week, hour) VALUES (?, ?, ?)`;
        const result = await Database.query<any>(query, [logId, schedule.day_of_week, schedule.hour]);
        return result.affectedRows > 0;
    }

    async updateSchedule(logId: number, schedule: any): Promise<boolean> {
        console.log("Updating schedule");
        const query = `UPDATE schedule SET day_of_week = ?, hour = ? WHERE log_id = ?`;
        const result = await Database.query<any>(query, [schedule.day_of_week, schedule.hour, logId]);
        return result.affectedRows > 0;
    }
}