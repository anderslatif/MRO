import * as getEnvVariables from './getEnvironmentVariables.js';
import chalk from 'chalk';

export function printDotEnvGuide(credentials) {
	const entries = [
		['DATABASE_TYPE', credentials.databaseType, getEnvVariables.getDatabaseType],
		['DATABASE_HOST', credentials.host, getEnvVariables.getHost],
		['DATABASE_PORT', credentials.port, getEnvVariables.getPort],
		['DATABASE_NAME', credentials.database, getEnvVariables.getDatabaseName],
		['DATABASE_USER', credentials.user, getEnvVariables.getUser],
		['DATABASE_PASSWORD', credentials.password ? '*********' : undefined, getEnvVariables.getPassword],
		['dbPath', credentials.dbPath, getEnvVariables.getDbPath],
		['MODULE_SYNTAX', credentials.moduleSyntax, getEnvVariables.getKnexModuleSyntax],
		['MYSQL_KEYS_TO_KEEP', credentials.mysqlKeysToKeep, getEnvVariables.getMysqlKeysToKeep],
	];

	const lines = entries
		.filter(([_, value, getter]) => value !== undefined && !getter())
		.map(([key, value]) => `${key}=${value}`);

	if (lines.length) {
		printFullWidthDivider();
		console.log(chalk.inverse('Did you know?'), chalk.grey('Add this to a .env file (where you run MRO) to avoid the prompts next time:'));
		printFullWidthDivider();
		lines.forEach(line => console.log(line));
		printFullWidthDivider();
	}
}

function printFullWidthDivider(character = '=') {
    const terminalWidth = process.stdout.columns || 80;
    const divider = character.repeat(terminalWidth);
    console.log(divider);
}