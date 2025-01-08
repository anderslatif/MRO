import mysql from 'mysql2/promise';
import chalk from 'chalk';

export async function connectMysql(credentials) {
  try {
    const connection = await mysql.createConnection({
      host: credentials.host,
      database: credentials.database,
      port: credentials.port,
      user: credentials.user,
      password: credentials.password,
    });

    return connection;
  } catch (error) {
    console.log(chalk.bgRed('Error connecting to MySQL database.'));
    console.log(chalk.bgCyan("Are you sure that your credentials are correct?"));
    console.log("Host:", credentials.host);
    console.log("Database:", credentials.database);
    console.log("User:", credentials.user);
    console.log("Port:", credentials.port);
    console.log("Password:", credentials.password);

    console.log();
    console.log(error);
    process.exit(1);
  }
}
