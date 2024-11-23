import { Database } from "../../config/dbConnection";
import { ValidationError } from "../errors/AppErrors";
import mysql from 'mysql2/promise';

export const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) throw new ValidationError('Email inválido');
    return true;
};

export const validatePhone = (phone: string): boolean => {
    // /^\d{3}-\d{3}-\d{4}$|^\d{3}\s\d{3}\s\d{4}$/
    const re = /^\d{3}-\d{3}-\d{4}$/;
    if (!re.test(phone.replace(/\s/g, ''))) throw new ValidationError('Teléfono inválido');
    return true;
}

export const validateName = (name: string): boolean => {
    const re = /^[a-zA-Z\s]+$/;
    if (!re.test(name)) throw new ValidationError('Nombre inválido');
    return true;
}

export const validateNameSubject = (name: string): boolean => {
    const re = /^[a-zA-Z0-9\s]+$/;
    if (!re.test(name)) throw new ValidationError('Nombre de materia inválido');
    return true;
}

export const validateNameUser = (name: string): boolean => {
    const re = /^[a-zA-Z0-9\s]+$/;
    if (!re.test(name)) throw new ValidationError('Nombre de usuario inválido');
    return true;
}

export const validateDepartment = (department: string): boolean => {
    const re = /^[a-zA-Z0-9\s]+$/;
    if (!re.test(department)) throw new ValidationError('Departamento inválido');
    return true;
}

export const validatePassword = (password: string): boolean => {
    const re = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!re.test(password)) throw new ValidationError('Contraseña inválida');
    return true;
}

export const isValidStatus = (status: string): boolean => {
    if (!['active', 'inactive'].includes(status)) throw new ValidationError('Estado inválido');
    return true;
}

const DBFieldValidator = async (table: string, field: string, value: any, excludeId?: number): Promise<boolean> => {
    let query = `SELECT COUNT(*) as count FROM ${table} WHERE ${field} = ?`;
    const params: any[] = [value];
    if (excludeId) {
        query += ` AND id != ?`;
        params.push(excludeId);
    }
    const result = await Database.query<[{count: number}]>(query, params);

    return result[0].count === 0;
}

export const validateDBSubjectName = async (name: string, excludeId?: number): Promise<boolean> => {
    return DBFieldValidator('subject', 'name', name, excludeId);
}

export const validateDBUserName = async (name: string, excludeId?: number): Promise<boolean> => {
    return DBFieldValidator('user', 'name', name, excludeId);
}

export const validateEmailTutor = async (email: string, excludeId?: number): Promise<boolean> => {
    return DBFieldValidator('tutor', 'email', email, excludeId);
}

export const validateDBUserEmail = async (email: string, excludeId?: number): Promise<boolean> => {
    return DBFieldValidator('user', 'email', email, excludeId);
}

export const subjectsExist = async (connection: mysql.PoolConnection, subjectIds: number[]): Promise<boolean> => {
    const query = `SELECT COUNT(*) as count FROM subject WHERE id IN (${subjectIds.join(',')})`;
    const [result] = await connection.execute(query, subjectIds);

    return Database.getCount(result) === subjectIds.length
}
