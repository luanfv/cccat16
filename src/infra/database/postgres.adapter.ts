import pgPromise from 'pg-promise';
import { DatabaseConnection } from './database.connection';

export class PostgresAdapter implements DatabaseConnection {
    private readonly connection;

    constructor() {
        this.connection = pgPromise()('postgres://postgres:123456@localhost:5432/app')
    }
    
    async query(query: string, params: any[]): Promise<any> {
        return await this.connection.query(query, params);
    }

    async close(): Promise<void> {
        await this.connection.$pool.end();
    }
}