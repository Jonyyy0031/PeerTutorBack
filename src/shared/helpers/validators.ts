import { Database } from "../../config/dbConnection";
import { ValidationError } from "../errors/AppErrors";
import mysql from 'mysql2/promise';
import { CreateLogDTO, Schedule } from "../models/logs.types";

export const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) throw new ValidationError('Email inválido');
    return true;
};

export const validatePhone = (phone: string): boolean => {
    // /^\d{3}-\d{3}-\d{4}$|^\d{3}\s\d{3}\s\d{4}$/
    const re = /^\d{3}-\d{3}-\d{4}$/;
    if (!re.test(phone.replace(/\s/g, ''))) throw new ValidationError('Teléfono inválido: Debe tener el formato xxx-xxx-xxxx');
    return true;
}

export const validateName = (name: string): boolean => {
    const re = /^[a-zA-Z\s]+$/;
    if (!re.test(name)) throw new ValidationError('Nombre inválido: Solo se aceptan letras');
    return true;
}

export const validateNameSubject = (name: string): boolean => {
    const re = /^[a-zA-Z0-9\s]+$/;
    if (!re.test(name)) throw new ValidationError('Nombre de materia inválido: Solo se aceptan letras y números');
    return true;
}

export const validateNameUser = (name: string): boolean => {
    const re = /^[a-zA-Z0-9\s]+$/;
    if (!re.test(name)) throw new ValidationError('Nombre de usuario inválido: Solo se aceptan letras y números');
    return true;
}

export const validateDepartment = (department: string): boolean => {
    const re = /^[a-zA-Z0-9\s]+$/;
    if (!re.test(department)) throw new ValidationError('Departamento inválido: Solo se aceptan letras y números');
    return true;
}

export const validatePassword = (password: string): boolean => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    if (!re.test(password)) throw new ValidationError('Contraseña inválida: Debe contener al menos 8 caracteres, un numero, una mayúscula y un simbolo ');
    return true;
}

export const validateGroup = (group: string): boolean => {
    const re = /^[0-9]{2}[A-Z]{2}$/;
    if (!re.test(group)) throw new ValidationError('Grupo inválido: Debe contener 2 números y 2 letras mayúsculas');
    return true;
}

export const isValidStatus = (status: string): boolean => {
    if (!['active', 'inactive'].includes(status)) throw new ValidationError('Estado inválido: Solo se acepta Activo o Inactivo');
    return true;
}

export const isValidShift = (shift: string): boolean => {
    if (!['matutino', 'vespertino'].includes(shift)) throw new ValidationError('Turno inválido: Solo se acepta Matutino o Vespertino');
    return true;
}

export const validateSchedule = (schedule: Schedule): boolean => {
    const validDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const validHours = ['07:00:00', '08:00:00', '09:00:00', '10:00:00',
        '11:00:00', '12:00:00', '13:00:00'];
    return validDays.includes(schedule.day_of_week) && validHours.includes(schedule.hour);
}

const DBFieldValidator = async (table: string, field: string, value: any, excludeId?: number): Promise<boolean> => {
    let query = `SELECT COUNT(*) as count FROM ${table} WHERE ${field} = ?`;
    const params: any[] = [value];
    if (excludeId) {
        query += ` AND id != ?`;
        params.push(excludeId);
    }
    const result = await Database.query<[{ count: number }]>(query, params);

    return result[0].count === 0;
}

export const validateDBSubjectName = async (subject_name: string, excludeId?: number): Promise<boolean> => {
    return DBFieldValidator('subject', 'subject_name', subject_name, excludeId);
}

export const validateDBTutorName = async (tutor_name: string, excludeId?: number): Promise<boolean> => {
    return DBFieldValidator('tutor', 'tutor_name', tutor_name, excludeId);
}

export const validateDBUserName = async (user_name: string, excludeId?: number): Promise<boolean> => {
    return DBFieldValidator('user', 'user_name', user_name, excludeId);
}

export const validateEmailTutor = async (email: string, excludeId?: number): Promise<boolean> => {
    return DBFieldValidator('tutor', 'email', email, excludeId);
}

export const validateDBUserEmail = async (email: string, excludeId?: number): Promise<boolean> => {
    return DBFieldValidator('user', 'email', email, excludeId);
}

export const tutorExist = async (connection: mysql.PoolConnection, tutorId: number): Promise<boolean> => {
    const query = `SELECT COUNT(*) as count FROM tutor WHERE id = ?`;
    const [result] = await connection.execute(query, [tutorId]);
    return Database.getCount(result) === 1;
}

export const subjectsExist = async (connection: mysql.PoolConnection, subjectIds: number[] ): Promise<boolean> => {
    const query = `SELECT COUNT(*) as count FROM subject WHERE id IN (${subjectIds.join(',')})`;
    const [result] = await connection.execute(query, subjectIds);

    return Database.getCount(result) === subjectIds.length
}

export const scheduleExist = async (connection: mysql.PoolConnection, logData: Partial<CreateLogDTO>): Promise<boolean> => {
    const query = `
    SELECT count(*) as count
    FROM schedule s
    INNER JOIN log l ON s.log_id = l.id
    WHERE l.tutor_id = ?
    AND l.subject_id = ?
    AND s.day_of_week = ?
    AND s.hour = ?;`
    const [result] = await connection.execute(query, [logData.tutor_id, logData.subject_id, logData.schedules?.day_of_week, logData.schedules?.hour]);
    if (Database.getCount(result) > 0) throw new ValidationError('El horario ya está ocupado');
    return true;
}
