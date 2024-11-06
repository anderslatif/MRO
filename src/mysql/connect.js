import mysql from "mysql2/promise";
import pg from "pg";

export async function connectMysql(credentials) {
    const connection = await mysql.createConnection({
        host     : credentials.host,
        database : credentials.database,
        user     : credentials.user,
        password : credentials.password
    });

    return connection;
}

export async function connectPostgresql(credentials) {
    const client = new pg.Client({
        host     : credentials.host,
        database : credentials.database,
        user     : credentials.user,
        password : credentials.password,
        port     : credentials.port, // Optional, default is 5432 for PostgreSQL
    });

    await client.connect();
    return client;
}