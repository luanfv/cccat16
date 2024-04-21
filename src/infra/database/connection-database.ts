export interface ConnectionDatabase {
    query(query: string, params: any[]): Promise<any>;
    close(): Promise<void>;
}