import { expect } from 'chai';

import { envSQLite, envDbPath, envHTMLMode } from '../testUtil/setupEnvironment.js';

import { testRunCLI } from '../testUtil/testRunCLI.js';


describe('Hello World Test', () => {
	it('should return true for a basic assertion', () => {
		envSQLite();
		envDbPath();
		envHTMLMode();

		testRunCLI();

		expect(true).to.be.true;
	});
});