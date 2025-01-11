import { expect } from 'chai';

import { envPostgreSQLCredentials, envPostgreSQL, envPostgreSQLPort, envJSONMode, envAllKeys, envAllTables } from '../testUtil/setupEnvironment.js';

import { testRunCLI } from '../testUtil/testRunCLI.js';
import fs from 'fs';


describe('Test JSON Docs creation for PostgreSQL', () => {
	before('Run the CLI', () => {
        envPostgreSQLCredentials();
		envPostgreSQL();
        envPostgreSQLPort();
		envJSONMode();

		envAllKeys();
		envAllTables();

		testRunCLI();
	});

	it('should create the JSON file', () => {
		const fileExists = fs.existsSync('pagila.json');

		expect(fileExists).to.be.true;
	});

	it('should have the correct number of tables', () => {
		const fileContent = fs.readFileSync('pagila.json', 'utf8');
		const pagilaJSON = JSON.parse(fileContent);
		
		const tableCount = pagilaJSON.schema.length;

		const pagilaTableCount = 29;

		expect(tableCount).to.equal(pagilaTableCount);
	});
});
