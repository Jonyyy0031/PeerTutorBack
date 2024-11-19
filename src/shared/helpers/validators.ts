import { Database } from "../../config/dbConnection";
import mysql from 'mysql2/promise';
import Subject from "../models/subjects.types";

export const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const validatePhone = (phone: string): boolean => {
    const re = /^\d{3}-\d{3}-\d{4}$|^\d{3}\s\d{3}\s\d{4}$/;
    return re.test(phone.replace(/\s/g, ''));
}

export const validateName = (name: string): boolean => {
    const re = /^[a-zA-Z\s]+$/;
    return re.test(name);
}

export const validateDepartment = (department: string): boolean => {
    const re = /^[a-zA-Z\s]+$/;
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

export const validateSubjectName = async (name: string, excludeId?: number): Promise<boolean> => {
    return DBFieldValidator('subjects', 'name', name, excludeId);
}

export const validateEmailTutor = async (email: string, excludeId?: number): Promise<boolean> => {
    return DBFieldValidator('tutors', 'email', email, excludeId);
}

export const subjectsExist = async (connection: mysql.PoolConnection, subjectIds: number[]): Promise<boolean> => {
    const query = `SELECT COUNT(*) as count FROM subjects WHERE id_subject IN (${subjectIds.join(',')})`;
    const [result] = await connection.execute(query, subjectIds);

    return Database.getCount(result) === subjectIds.length 
}
