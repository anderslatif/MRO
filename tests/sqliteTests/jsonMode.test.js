// import { expect } from 'chai';

// import { envSQLite, envDbPath, envJSONMode, envAllKeys, envAllTables } from '../testUtil/setupEnvironment.js';

// import { testRunCLI } from '../testUtil/testRunCLI.js';
// import fs from 'fs';


// describe('Test JSON Docs creation for MySQL', () => {
// 	before('Run the CLI', () => {
//         envSQLite();
//         envDbPath();
//         envJSONMode();

//         envAllKeys();
//         envAllTables();

// 		testRunCLI();
// 	});

// 	it('should create the JSON file', () => {
// 		const fileExists = fs.existsSync('sqlite.json');

// 		expect(fileExists).to.be.true;
// 	});

// 	it('should have the correct number of tables', () => {
// 		const fileContent = fs.readFileSync('sqlite.json', 'utf8');
// 		const chinookJSON = JSON.parse(fileContent);
		
// 		const tableCount = chinookJSON.schema.length;

// 		const chinookTableCount = 11;

// 		expect(tableCount).to.equal(chinookTableCount);
// 	});
// });
