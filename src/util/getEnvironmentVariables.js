import 'dotenv/config';

export function getDatabaseType() {
	const variations = [
		'DB_TYPE',
		'DATABASE_TYPE',
	];
	const validTypes = ['mysql', 'postgresql', 'sqlite'];
	return variations
		.map((variation) => process.env[variation]?.toLowerCase())
		.find((value) => validTypes.includes(value));
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
	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined);
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
	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined);
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
	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined);
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
		'POSTGRESQL_PASS',
	];
	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined);
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
	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined);
}

// for SQLite
export function getDatabasePath() {
	const variations = [
		'DB_PATH',
		'DATABASE_PATH',
	];
	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined);
}

export function getOutputFormat() {
  const variations = [
    'OUTPUT_FORMAT',
    'MRO_OUTPUT',
    'MRO_OUTPUT_FORMAT',
  ];
  return variations
    .map((variation) => process.env[variation])
    .find((value) => value !== undefined);
}

export function getKnexModuleSyntax() {
	const variations = [
		'MODULE_SYNTAX',
		'MRO_MODULE_SYNTAX',
	];

	return variations
		.map((variation) => process.env[variation])
		.find((value) => value !== undefined) || null;
}

export function getMysqlKeysToKeep() {
	const variations = [
		'MYSQL_KEYS_TO_KEEP',
		'MRO_MYSQL_KEYS_TO_KEEP',
	];

	return variations.some((variation) => process.env[variation] !== undefined);
}

export function getAllSelectedTables() {
	const variations = [
		'ALL_TABLES',
		'MRO_ALL_TABLES',
	];

	return variations.some((variation) => process.env[variation] !== undefined);
}