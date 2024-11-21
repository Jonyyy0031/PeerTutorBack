import { Database } from "../../config/dbConnection";
import mysql from 'mysql2/promise';

export const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
    // /^\d{3}-\d{3}-\d{4}$|^\d{3}\s\d{3}\s\d{4}$/
    const re = /^\d{3}-\d{3}-\d{4}$/;
    return re.test(phone.replace(/\s/g, ''));
}

export const validateName = (name: string): boolean => {
    const re = /^[a-zA-Z\s]+$/;
    return re.test(name);
}

export const validateNameSubject = (name: string): boolean => {
    const re = /^[a-zA-Z0-9\s]+$/;
    return re.test(name);
}

export const validateDepartment = (department: string): boolean => {
    const re = /^[a-zA-Z0-9\s]+$/;
    return re.test(department);
}

export const isValidStatus = (status: string): boolean => {
    return ['active', 'inactive'].includes(status);
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

export const validateEmailTutor = async (email: string, excludeId?: number): Promise<boolean> => {
    return DBFieldValidator('tutor', 'email', email, excludeId);
}

export const subjectsExist = async (connection: mysql.PoolConnection, subjectIds: number[]): Promise<boolean> => {
    const query = `SELECT COUNT(*) as count FROM subject WHERE id IN (${subjectIds.join(',')})`;
    const [result] = await connection.execute(query, subjectIds);

    return Database.getCount(result) === subjectIds.length
}
