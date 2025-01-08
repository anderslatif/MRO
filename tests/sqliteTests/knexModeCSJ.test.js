import { expect } from 'chai';

import { envSQLite, envDbPath, envKnexMode, envCommonJS, envAllKeys, envAllTables } from '../testUtil/setupEnvironment.js';

import { testRunCLI } from '../testUtil/testRunCLI.js';

import fs from 'fs';

let findMatchingFile;

describe('Test Knex migration creation for SQLite', () => {
	before('Run the CLI', async () => {
        envSQLite();
        envDbPath();
        envKnexMode();
        envCommonJS();

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

        const chinookTableCount = 11;

        expect(createTableCount).to.equal(chinookTableCount);
	});

});
