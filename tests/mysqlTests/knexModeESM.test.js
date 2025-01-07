import { expect } from 'chai';

import { envSQLite, envDbPath, envKnexMode, envESM } from '../testUtil/setupEnvironment.js';

import { testRunCLI } from '../testUtil/testRunCLI.js';


describe('Hello World Test', () => {
    it('should return true for a basic assertion', () => {
        envSQLite();
        envDbPath();
        envKnexMode();
        envESM();

        testRunCLI();

        expect(true).to.be.true;
    });
});
