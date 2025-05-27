import { ConnectionOptions } from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();

const createDbConfig = (): ConnectionOptions => {
    if (process.env.DATABASE_URL) {
        console.log('🚀 Using Railway MySQL (Production)');
        return {
            uri: process.env.DATABASE_URL,
            multipleStatements: true,
            dateStrings: true,
            ssl: {
                rejectUnauthorized: false
            },
            connectTimeout: 60000
        };
    } else {
        console.log('💻 Using Local MySQL (Development)');
        return {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true,
            dateStrings: true,
        };
    }
};

export const dbConfig: ConnectionOptions = createDbConfig();