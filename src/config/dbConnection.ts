import mysql from 'mysql2/promise';
import { dbConfig } from './dbConfig';


export class Database {
    private static instance: mysql.Pool;

    static async GetConnection() {
        if (!Database.instance) {
            console.log("Creating new connection pool");
            Database.instance = mysql.createPool(dbConfig);
        }
        return Database.instance;
    }

    static async query<T>(query: string, params?: any[]): Promise<T> {
        const pool = await Database.GetConnection();
        console.log("Executing query: ", query);
        try {
            const [rows] = await pool.execute(query, params);
            return rows as T;
        } catch (error) {
            console.log("Error executing query: ", error);
            throw error;
        } finally {
            pool.end();
        }
    }
}
