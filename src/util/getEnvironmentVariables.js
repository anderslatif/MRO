import 'dotenv/config';

export function getDatabaseType() {
	const variations = [
		'DATABASE_TYPE',
		'DB_TYPE',
	];
	const validTypes = ['mysql', 'postgresql', 'sqlite'];
	return variations
		.map((variation) => process.env[variation]?.toLowerCase())
		.find((value) => validTypes.includes(value));
}

export function getHost() {
	const variations = [
		'DATABASE_HOST',
		'DB_HOST',
		'DB_SERVER',
		'PG_HOST',
		'POSTGRES_HOST',
		'POSTGRESQL_HOST',
		'SQL_HOST',
	];
	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined);
}

export function getDatabaseName() {
	const variations = [
		'DATABASE',
		'DATABASE_NAME',
		'DB_DATABASE',
		'DB_NAME',
		'PG_DATABASE',
		'PG_DB',
		'POSTGRES_DATABASE',
		'POSTGRES_DB',
		'POSTGRESQL_DATABASE',
		'POSTGRESQL_DB',
	];
	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined);
}

export function getUser() {
	const variations = [
		'DATABASE_USER',
		'DB_USER',
		'DB_USERNAME',
		'PG_USER',
		'POSTGRES_USER',
		'POSTGRESQL_USER',
	];
	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined);
}

export function getPassword() {
	const variations = [
		'DATABASE_PASSWORD',
		'DB_PASS',
		'DB_PASSWORD',
		'PG_PASS',
		'PG_PASSWORD',
		'POSTGRES_PASS',
		'POSTGRES_PASSWORD',
		'POSTGRESQL_PASS',
		'POSTGRESQL_PASSWORD',
		'PASSWORD',
	];
	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined);
}

export function getPort() {
	const variations = [
		'DATABASE_PORT',
		'DB_PORT',
		'PG_PORT',
		'POSTGRES_PORT',
		'POSTGRESQL_PORT',
		'SQL_PORT',
	];
	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined);
}

// for SQLite
export function getDatabasePath() {
	const variations = [
		'DATABASE_PATH',
		'DB_PATH',
	];
	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined);
}

export function getOutputFormat() {
	const variations = [
		'MRO_OUTPUT',
		'MRO_OUTPUT_FORMAT',
		'OUTPUT_FORMAT',
	];
	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined);
}

export function getKnexModuleSyntax() {
	const variations = [
		'MRO_MODULE_SYNTAX',
		'MODULE_SYNTAX',
	];

	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined) || undefined;
}

export function getAllMySQLKeys() {
	const variations = [
		'ALL_KEYS',
		'MRO_ALL_KEYS',
	];

	return variations.some((variation) => process.env[variation] !== undefined);
}

export function getAllTables() {
	const variations = [
		'ALL_TABLES',
		'MRO_ALL_TABLES',
	];

	return variations.some((variation) => process.env[variation] !== undefined);
}