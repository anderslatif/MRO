export function resetEnvironment() {
    delete process.env.DB_TYPE;
    delete process.env.DATABASE_USER;
    delete process.env.DATABASE_PASSWORD;
    delete process.env.DATABASE_NAME;
    delete process.env.DB_PORT;
    delete process.env.DB_PATH;
    delete process.env.MRO_OUTPUT_FORMAT;
    delete process.env.MRO_MODULE_SYNTAX;
    delete process.env.MRO_ALL_KEYS;
    delete process.env.MRO_ALL_TABLES;
}

export function envMySQL() {
    process.env.DB_TYPE = 'mysql';
}

export function envPostgreSQL() {
    process.env.DB_TYPE = 'postgresql';
}

export function envSQLite() {
    process.env.DB_TYPE = 'sqlite';
}

// Database Name, User and Password

export function envMySQLCredentials() {
    process.env.DATABASE_USER = 'root';
    process.env.DATABASE_PASSWORD = 'root_password';
    process.env.DATABASE_NAME = 'sakila';
}

export function envPostgreSQLCredentials() {
    process.env.DATABASE_USER = 'postgres';
    process.env.DATABASE_PASSWORD = 'password';
    process.env.DATABASE_NAME = 'pagila';
}

// Database Port

export function envMySQLPort() {
    // my docker-compose.yml exposes the database on port 3307
    // this is to allow testing locally where local MySQL might be using port 3306
    process.env.DB_PORT = '3307';
}

export function envPostgreSQLPort() {
    process.env.DB_PORT = '5432';
}


// DB Path for SQLite

export function envDbPath() {
    // Since the tests are run from root
    process.env.DB_PATH = './tests/sqlite/sqlite.db';
}


// Output Modes

export function envJSONMode() {
    process.env.MRO_OUTPUT_FORMAT = 'json';
}

export function envHTMLMode() {
    process.env.MRO_OUTPUT_FORMAT = 'html';
}

export function envKnexMode() {
    process.env.MRO_OUTPUT_FORMAT = 'knex';
}

export function envObjectionMode() {
    process.env.MRO_OUTPUT_FORMAT = 'objection';
}


// Output Format

export function envCommonJS() {
    process.env.MRO_MODULE_SYNTAX = 'CJS';
}

export function envESM() {
    process.env.MRO_MODULE_SYNTAX = 'ESM';
}

// Keys / Tables to keep

export function envAllKeys() {
    process.env.MRO_ALL_KEYS = '*';
}

export function envAllTables() {
    process.env.MRO_ALL_TABLES = '*';
}