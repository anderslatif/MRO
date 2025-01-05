import sqlite3 from 'sqlite3';
import { readFile } from 'fs/promises';

const setupDatabase = async () => {
	const db = new sqlite3.Database('sqlite.db');

	try {
		const sql = await readFile('chinook.sql', 'utf-8');

		db.exec(sql, (err) => {
			if (err) {
				console.error('Error executing SQL file:', err);
			} else {
				console.log('Database setup complete.');
			}
		});
	} catch (error) {
		console.error('Error reading SQL file:', error);
	} finally {
		db.close();
	}
};

setupDatabase();