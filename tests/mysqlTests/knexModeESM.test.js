// import { expect } from 'chai';

// import { envMySQL, envMySQLCredentials, envMySQLPort, envKnexMode, envESM, envAllKeys, envAllTables } from '../testUtil/setupEnvironment.js';

// import { testRunCLI } from '../testUtil/testRunCLI.js';

// import fs from 'fs';

// let findMatchingFile;

// describe('Test JSON Docs creation for MySQL', () => {
// 	before('Run the CLI', async () => {
// 		envMySQL();
//         envMySQLCredentials();
// 		envMySQLPort();
//         envKnexMode();
//         envESM();

// 		envAllKeys();
// 		envAllTables();

// 		testRunCLI();

//         // lazy loading
//         findMatchingFile = (await import('../testUtil/findMigrationFile.js')).findMatchingFile;
// 	});

// 	it('should create the migration file', () => {
//         const migrationFile = findMatchingFile();

//         expect(migrationFile).to.not.be.null
// 	});

//     it('should contain logic for creating all tables', () => {
//         const migrationFileName = findMatchingFile();
//         const migrationFile = fs.readFileSync(migrationFileName, 'utf8');   

//         const createTableCount = migrationFile.match(/createTable/g).length;

//         const sakilaTableCount = 23;

//         expect(createTableCount).to.equal(sakilaTableCount);
// 	});

// });
