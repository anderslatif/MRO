import mysql from "mysql2/promise";
import pg from "pg";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

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
        port     : credentials.port,
    });

    await client.connect();
    return client;
}

export async function connectSQLite(credentials) {
    const db = await open({
        filename: credentials.dbPath,
        driver: sqlite3.Database
    });

    return db;
}