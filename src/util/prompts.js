import { select, confirm, input, checkbox} from '@inquirer/prompts';
import chalk from 'chalk';
import fs from 'fs';
import * as getEnvVariables from './getEnvironmentVariables.js';
import { get } from 'https';


export async function chooseDatabaseType() {
  if (getEnvVariables.getDatabaseType()) {
    return getEnvVariables.getDatabaseType();
  }
  return await select({
    message: 'Choose database',
    choices: [
      { name: 'MySQL', value: 'mysql' },
      { name: 'PostgreSQL', value: 'postgresql' },
      { name: 'SQLite', value: 'sqlite' },
    ],
  });
}

export async function typeHost() {
	const host = getEnvVariables.getHost();
	if (host) {
		return host;
	}

	const isLocalhost = await confirm({
		message: 'Is your database hosted on localhost?',
	});

	if (isLocalhost) {
		return 'localhost';
	}

	return await input({
		message: 'Type your database host address (IP address or hostname):',
	});
}

export async function typePort(databaseType) {
	if (getEnvVariables.getPort()) {
		return getEnvVariables.getPort();
	}

	const defaultPort = { mysql: 3306, postgresql: 5432 }[databaseType] || '';

	return await input({
		type: 'input',
		name: 'port',
		message: 'Type your database port.',
		default: defaultPort,
		validate: (input) => {
			if (Number.isInteger(Number(input))) {
				return true;
			}
			return 'Please provide a valid port number.';
		},
	});
}

export async function typeDbPath() {
	if (getEnvVariables.getDatabasePath()) {
		return getEnvVariables.getDatabasePath();
	}


	return await input({
		message: 'Point to your database file.',
		validate: (input) => {
			if (fs.existsSync(input)) {
				return true;
			}
			return 'File not found. Please provide a valid path.';
		},
	});
}

export async function typeDatabaseName() {
	const databaseName = getEnvVariables.getDatabaseName();
	if (databaseName) {
		return databaseName;
	}

	return await input({
		message: 'Type your database name:',
	});
}

export async function typeUser() {
	if (getEnvVariables.getUser()) {
		return getEnvVariables.getUser();
	}

	return await input({
		message: 'Type your database username:',
	});
}

export async function typePassword() {
	if (getEnvVariables.getPassword()) {
		return getEnvVariables.getPassword();
	}

	return await password({
		message: 'Type your database password:',
	});
}

export async function outputFormat() {
	if (getEnvVariables.getOutputFormat()) {
		return getEnvVariables.getOutputFormat();
	}

	return await select({
		message: 'Choose an output format:',
		choices: [
			{ name: 'JSON', value: 'json' },
			{ name: 'HTML Documentation', value: 'html' },
			{ name: 'Knex.js Migrations', value: 'knex' },
			{ name: 'Objection.js Models', value: 'objection' },
		],
	});
}

export async function chooseModuleSyntax() {
	if (getEnvVariables.getKnexModuleSyntax()) {
		return getEnvVariables.getKnexModuleSyntax();
	}

	return await select({
		message: 'Choose your desired module syntax for the Knex.js migration files:',
		choices: [
			{ name: 'ES6', value: 'es6' },
			{ name: 'CommonJS', value: 'CommonJS' },
		],
	});
}

export async function outputMysqlKeysToKeep() {
	if (getEnvVariables.getAllMySQLKeys()) {
		// return all tables as checked
		return [
			"Field",
			"Type",
			"Default",
			"Null",
			"Key",
			"keyTo",
			"Extra",
			"typeJS"
		]
	}

	return await checkbox({
		message: 'Select the key-value pairs you want:',
		choices: [
			{ checked: true, value: 'Field', name: chalk.grey.inverse.bold(' field    ') + ': column name' },
			{ checked: true, value: 'Type', name: chalk.grey.inverse.bold(' type     ') + ': int/varchar(255) etc.' },
			{ value: 'Default', name: chalk.grey.inverse.bold(' default  ') + ': null, timestamp etc.' },
			{ value: 'Null', name: chalk.grey.inverse.bold(' null     ') + ': YES/NO' },
			{ value: 'Key', name: chalk.grey.inverse.bold(' key      ') + ': PRI/MUL etc.' },
			{ value: 'keyTo', name: chalk.grey.inverse.bold(' keyTo    ') + ": Array of references 'table.columnName' if key is a Foreign Key" },
			{ value: 'Extra', name: chalk.grey.inverse.bold(' extra    ') + ': AUTO_INCREMENT etc.' },
			{
				value: 'typeJS',
				name:
					chalk.grey.inverse.bold(' typeJS   ') +
					': Number/String etc.\n' +
					chalk.grey(' about type casting to JavaScript: https://www.npmjs.com/package/mysql#type-casting'),
			},
		],
	});
}

export async function selectTables(tables) {
	if (getEnvVariables.getAllTables()) {
		return tables.map((table) => table.table);
	}

	return await checkbox({
		message: 'Select the tables you want to document:',
		choices: tables.map((table) => ({
			checked: true,
			value: table.table,
			name: table.table,
		})),
	});
}

