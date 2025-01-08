import { expect } from 'chai';

import { envMySQL, envMySQLCredentials, envMySQLPort, envHTMLMode, envAllKeys, envAllTables } from '../testUtil/setupEnvironment.js';

import { testRunCLI } from '../testUtil/testRunCLI.js';
import fs from 'fs';


describe('Test HTML Docs creation for MySQL', () => {
	before('Run the CLI', () => {
		envMySQL();
        envMySQLCredentials();
		envMySQLPort();
		envHTMLMode();

		envAllKeys();
		envAllTables();

		testRunCLI();
	});

	it('should create the HTML file', () => {
		const fileExists = fs.existsSync('sakila_mro_docs.html');

		expect(fileExists).to.be.true;
	});

	it('should have the correct number of tables', () => {
		const fileContent = fs.readFileSync('sakila_mro_docs.html', 'utf8');

		const tableCount = (fileContent.match(/<h2 class="database-table-name">/g) || []).length;

		const sakilaTableCount = 23;

		expect(tableCount).to.equal(sakilaTableCount);
	});
});
