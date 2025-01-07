import { expect } from 'chai';

import { envSQLite, envDbPath, envKnexMode, envCommonJS } from '../testUtil/setupEnvironment.js';

import { testRunCLI } from '../testUtil/testRunCLI.js';


describe('Hello World Test', () => {
    it('should return true for a basic assertion', () => {
        envSQLite();
        envDbPath();
        envKnexMode();
        envCommonJS();

        testRunCLI();

        expect(true).to.be.true;
    });
});
