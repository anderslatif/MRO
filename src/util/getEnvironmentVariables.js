import 'dotenv/config';

export function getDatabaseType() {
	const variations = [
		'DB_TYPE',
    	'DATABASE_TYPE',
	];
	return variations.find((variation) => process.env[variation]);
}

export function getHost() {
	const variations = [
		'DB_HOST',
		'DATABASE_HOST',
		'SQL_HOST',
		'DB_SERVER',
		'PG_HOST',
		'POSTGRES_HOST',
		'POSTGRESQL_HOST',
	];
	return variations.find((variation) => process.env[variation]);
}

export function getDatabaseName() {
	const variations = [
		'DB_DATABASE',
		'DATABASE',
		'DB_NAME',
		'DATABASE_NAME',
		'PG_DATABASE',
		'PG_DB',
		'POSTGRES_DATABASE',
		'POSTGRES_DB',
		'POSTGRESQL_DATABASE',
		'POSTGRESQL_DB',
	];
	return variations.find((variation) => process.env[variation]);
}

export function getUser() {
	const variations = [
		'DB_USER',
		'DATABASE_USER',
		'USER',
		'DB_USERNAME',
		'USERNAME',
		'PG_USER',
		'POSTGRES_USER',
		'POSTGRESQL_USER',
	];
	return variations.find((variation) => process.env[variation]);
}

export function getPassword() {
	const variations = [
		'DB_PASSWORD',
		'DATABASE_PASSWORD',
		'PASSWORD',
		'DB_PASS',
		'PG_PASSWORD',
		'PG_PASS',
		'POSTGRES_PASSWORD',
		'POSTGRES_PASS',
		'POSTGRESQL_PASSWORD',
		'POSTGRESWL_PASS',
	];
	return variations.find((variation) => process.env[variation]);
}

export function getPort() {
	const variations = [
		'DB_PORT',
		'DATABASE_PORT',
		'SQL_PORT',
		'PG_PORT',
		'POSTGRES_PORT',
		'POSTGRESQL_PORT',
	];
	return variations.find((variation) => process.env[variation]);
}

// for SQLite
export function getDatabasePath() {
	const variations = [
		'DB_PATH',
		'DATABASE_PATH',
	];
	return variations.find((variation) => process.env[variation]);
}