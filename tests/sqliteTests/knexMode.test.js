import { expect } from 'chai';

import { envSQLite, envDbPath, envKnexMode, envCommonJS, envES6 } from '../testUtil/setupEnvironment.js';

import { testRunCLI } from '../testUtil/testRunCLI.js';


describe('Hello World Test', () => {
    it('should return true for a basic assertion', () => {
        envSQLite();
        envDbPath();
        envKnexMode();
        // envES6();
        envCommonJS();

        testRunCLI();

        expect(true).to.be.true;
    });
});
