import { expect } from 'chai';

import { envPostgreSQLCredentials, envPostgreSQL, envPostgreSQLPort, envKnexMode, envESM } from '../testUtil/setupEnvironment.js';

import { testRunCLI } from '../testUtil/testRunCLI.js';

import fs from 'fs';

let findMatchingFile;

describe('Test Knex migration creation for PostgreSQL', () => {
	before('Run the CLI', async () => {
        envPostgreSQLCredentials();
		envPostgreSQL();
        envPostgreSQLPort();
		envKnexMode();
        envESM();

		testRunCLI();

        // lazy loading
        findMatchingFile = (await import('../testUtil/findMigrationFile.js')).findMatchingFile;
	});

	it('should create the migration file', () => {
        const migrationFile = findMatchingFile();

        expect(migrationFile).to.not.be.null
	});

    it('should contain logic for creating all tables', () => {
        const migrationFileName = findMatchingFile();
        const migrationFile = fs.readFileSync(migrationFileName, 'utf8');   

        const createTableCount = migrationFile.match(/createTable/g).length;

        const pagilaTableCount = 29;

        expect(createTableCount).to.equal(pagilaTableCount);
	});

});
