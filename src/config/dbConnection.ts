import mysql from 'mysql2/promise';
import { dbConfig } from './dbConfig';
import { DatabaseError, ValidationError } from '../shared/errors/AppErrors';


export class Database {
    private static instance: mysql.Pool;
    private static transactionConnection: mysql.PoolConnection | null = null

    static async GetConnection() {
        if (!Database.instance) {
            console.log("Creating new connection pool");
            try {
                Database.instance = mysql.createPool(dbConfig);
            } catch (error: any) {
                throw new DatabaseError(`Error al conectar a la base de datos: ${error.message}`);
            }
        }
        return Database.instance;
    }

    static async query<T>(query: string, params?: any[]): Promise<T> {
        const pool = Database.transactionConnection || await Database.GetConnection();
        console.log("Executing query: ", query);
        try {
            const [rows] = await pool.execute(query, params);
            return rows as T;
        } catch (error: any) {
            console.log("Error executing query: ", error);
            if (error.code === 'ER_DUP_ENTRY') {
                throw new DatabaseError('Ya existe un registro con esos datos');
            }
            throw new DatabaseError(error);
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
            await connection.commit();
            return result;
        } catch (error: any) {
            await connection.rollback();
            if (error instanceof DatabaseError || error instanceof ValidationError) {
                throw error;
            }
            throw new DatabaseError(`Error en la transacción: ${error.message}`);
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
