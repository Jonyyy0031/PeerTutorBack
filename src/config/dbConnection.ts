import mysql from 'mysql2/promise';
import { dbConfig } from './dbConfig';


export class Database {
    private static instance: mysql.Pool;
    private static transactionConnection: mysql.PoolConnection | null = null

    static async GetConnection() {
        if (!Database.instance) {
            console.log("Creating new connection pool");
            Database.instance = mysql.createPool(dbConfig);
        }
        return Database.instance;
    }

    static async query<T>(query: string, params?: any[]): Promise<T> {
        const pool = Database.transactionConnection || await Database.GetConnection();
        console.log("Executing query: ", query);
        try {
            const [rows] = await pool.execute(query, params);
            return rows as T;
        } catch (error) {
            console.log("Error executing query: ", error);
            throw error;
        }
    }

    static async transaction<T>(
        callback: (connection: mysql.PoolConnection) => Promise<T>
    ): Promise<T> {
        const connection = await (await Database.GetConnection()).getConnection();
        Database.transactionConnection = connection;
        await connection.beginTransaction();

        try {
            const result = await callback(connection);
            console.log(result)
            await connection.commit();
            console.log('Transaction committed');
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            Database.transactionConnection = null
            connection.release();
        }
    }

    static getInsertId(result: any): number {
        if (!result || typeof result.insertId !== 'number') {
            throw new Error('Invalid insert result');
        }
        return result.insertId;
    }

    static getCount(result: any): number {
        if (!result?.[0] || typeof result[0].count !== 'number') {
            throw new Error('Invalid count result');
        }
        return result[0].count;
    }
}
