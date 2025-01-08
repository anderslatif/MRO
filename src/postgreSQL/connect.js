import pg from 'pg';
import chalk from 'chalk';

export async function connectPostgresql(credentials) {
	try {
		const client = new pg.Client({
			host: credentials.host,
			database: credentials.database,
			port: credentials.port,
			user: credentials.user,
			password: credentials.password,
		});

		await client.connect();
		return client;
	} catch (error) {
		console.log(chalk.bgRed('Error connecting to PostgreSQL database.'));
		console.log(chalk.bgCyan('Are you sure that your credentials are correct?'));
		console.log('Host:', credentials.host);
		console.log('Database:', credentials.database);
		console.log('User:', credentials.user);
		console.log('Port:', credentials.port);
		console.log('Password:', credentials.password);

		console.log();
		console.log(error);
		process.exit(1);
	}
}
