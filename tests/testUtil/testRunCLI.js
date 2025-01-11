import { execSync } from 'child_process';
import { resolve } from 'path';

export function testRunCLI() {
	const cliPath = resolve('src', 'cli.js');
	try {
		const output = execSync(`node ${cliPath}`, {
			env: {
				...process.env,
			},
			// cwd: process.cwd(),
			stdio: 'pipe', // Capture both stdout and stderr
		});
		console.log(output.toString()); // Log the CLI output
	} catch (error) {
		console.error(error.stderr?.toString() || error.message); // Log any errors
		throw error;
	}
}