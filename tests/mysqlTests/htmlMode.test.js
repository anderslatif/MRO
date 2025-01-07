import { expect } from 'chai';

import { envMySQL, envMySQLCredentials, envHTMLMode, envAllKeys, envAllTables } from '../testUtil/setupEnvironment.js';

import { testRunCLI } from '../testUtil/testRunCLI.js';


describe('Hello World Test', () => {
	it('should return true for a basic assertion', () => {
		envMySQL();
        envMySQLCredentials();
		envHTMLMode();

		envAllKeys();
		envAllTables();


		testRunCLI();

		expect(true).to.be.true;
	});
});
