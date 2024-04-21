import pgPromise from 'pg-promise';

export interface DatabaseConnection {
    query(query: string, params: any[]): Promise<any>;
    close(): Promise<void>;
}