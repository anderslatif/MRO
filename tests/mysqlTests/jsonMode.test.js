// import { expect } from 'chai';

// import { envMySQL, envMySQLCredentials, envMySQLPort, envJSONMode, envAllKeys, envAllTables  } from '../testUtil/setupEnvironment.js';

// import { testRunCLI } from '../testUtil/testRunCLI.js';
// import fs from 'fs';


// describe('Test JSON Docs creation for MySQL', () => {
// 	before('Run the CLI', () => {
// 		envMySQL();
//      envMySQLCredentials();
// 		envMySQLPort();
// 		envJSONMode();

// 		envAllKeys();
// 		envAllTables();

// 		testRunCLI();
// 	});

// 	it('should create the JSON file', () => {
// 		const fileExists = fs.existsSync('sakila.json');

// 		expect(fileExists).to.be.true;
// 	});

// 	it('should have the correct number of tables', () => {
// 		const fileContent = fs.readFileSync('sakila.json', 'utf8');
// 		const sakilaJSON = JSON.parse(fileContent);
		
// 		const tableCount = sakilaJSON.schema.length;

// 		const sakilaTableCount = 23;

// 		expect(tableCount).to.equal(sakilaTableCount);
// 	});
// });
