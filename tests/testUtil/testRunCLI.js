import { execSync } from 'child_process';
import { resolve } from 'path';

export function testRunCLI() {
	const cliPath = resolve('src', 'cli.js');
	try {
		const output = execSync(`node ${cliPath}`, {
			env: {
				...process.env,
			},
			cwd: process.cwd(),
			stdio: 'inherit', // Capture both stdout and stderr
		});
		console.log(output.toString()); // Log the CLI output
	} catch (error) {
        console.error('CLI Error Output:', error.stderr?.toString());
        console.error('CLI Error Message:', error.message);
		throw error;
	}
}