import { expect } from 'chai';

import { envPostgreSQLCredentials, envPostgreSQL, envPostgreSQLPort, envHTMLMode, envAllKeys, envAllTables } from '../testUtil/setupEnvironment.js';

import { testRunCLI } from '../testUtil/testRunCLI.js';
import fs from 'fs';


describe('Test HTML Docs creation for PostgreSQL', () => {
	before('Run the CLI', () => {
        envPostgreSQLCredentials();
		envPostgreSQL();
     envPostgreSQLPort();
		envHTMLMode();

		envAllKeys();
		envAllTables();

		testRunCLI();
	});

	// it('should create the HTML file', () => {
	// 	const fileExists = fs.existsSync('pagila_mro_docs.html');

	// 	expect(fileExists).to.be.true;
	// });

	// it('should have the correct number of tables', () => {
	// 	const fileContent = fs.readFileSync('pagila_mro_docs.html', 'utf8');

	// 	const tableCount = (fileContent.match(/<h2 class="database-table-name">/g) || []).length;

	// 	const pagilaTableCount = 29;

	// 	expect(tableCount).to.equal(pagilaTableCount);
	// });
});
