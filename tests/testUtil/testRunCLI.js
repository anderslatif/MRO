import { execSync } from 'child_process';
import { resolve } from 'path';

export function testRunCLI() {
	try {
		const cliPath = resolve('src', 'cli.js');
        console.log('cliPath:', cliPath);
		execSync(`node ${cliPath}`, {
			env: {
			...process.env,
			}
		});
	} catch (error) {
		throw error;
	}
}
