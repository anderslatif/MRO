import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function connectSQLite(credentials) {
  const db = await open({
    filename: credentials.dbPath,
    driver: sqlite3.Database,
  });

  return db;
}
