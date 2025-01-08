import { beforeEach, after } from 'mocha';
import { resetEnvironment } from './testUtil/setupEnvironment.js';

export function globalSetup() {
	beforeEach(() => {
		resetEnvironment();
	});
}