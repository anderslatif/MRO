// import { expect } from 'chai';

// import { envSQLite, envDbPath, envHTMLMode, envAllKeys, envAllTables } from '../testUtil/setupEnvironment.js';

// import { testRunCLI } from '../testUtil/testRunCLI.js';

// import fs from 'fs';

// describe('Test HTML Docs creation for SQLite', () => {
//     before('Run the CLI', () => {
//         envSQLite();
//         envDbPath();
//         envHTMLMode();

//         envAllKeys();
//         envAllTables();

// 		testRunCLI();
// 	});

//     it('should create the HTML file', () => {
// 		const fileExists = fs.existsSync('sqlite_mro_docs.html');

// 		expect(fileExists).to.be.true;
// 	});

// 	it('should have the correct number of tables', () => {
// 		const fileContent = fs.readFileSync('sqlite_mro_docs.html', 'utf8');

// 		const tableCount = (fileContent.match(/<h2 class="database-table-name">/g) || []).length;

// 		const chinookTableCount = 11;

// 		expect(tableCount).to.equal(chinookTableCount);
// 	});
// });
