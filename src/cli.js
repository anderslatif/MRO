#!/usr/bin/env node

import prompt from './util/prompts.js';
import {
  convertToJSON, convertToHTML, convertToKnexMigration, convertToObjection,
} from './util/converters.js';
// import "dotenv/config";

(async () => {
  let credentials = {};

  if (!process.env.DB_HOST) {
    const { databaseType } = await prompt.chooseDatabase();

    if (['mysql', 'postgresql'].includes(databaseType)) {
      const { host } = await prompt.typeHost();
      const { port } = await prompt.typePort(databaseType);
      const { database } = await prompt.typeDatabaseName();
      const { user } = await prompt.typeUser();
      const { password } = await prompt.typePassword();

      credentials = {
        databaseType, host, database, port, user, password,
      };
    } else if (databaseType === 'sqlite') {
      const { dbPath } = await prompt.typeDbPath();

      credentials = { databaseType, dbPath, database: 'sqlite' };
    }
  } else {
    credentials = {
      databaseType: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    };
  }

  const { outputFormat } = await prompt.outputFormat();

  if (outputFormat === 'JSON (MYSQL Data types/JS Data Types)') {
    const { mysqlKeysToKeep } = await prompt.outputMysqlKeysToKeep();
    convertToJSON(credentials, mysqlKeysToKeep);
  } else if (outputFormat === 'HTML Page') {
    const { mysqlKeysToKeep } = await prompt.outputMysqlKeysToKeep();
    convertToHTML(credentials, mysqlKeysToKeep);
  } else if (outputFormat === 'Knex.js Migrations') {
    const { moduleSyntax } = await prompt.chooseModuleSyntax();
    credentials.moduleSyntax = moduleSyntax;
    convertToKnexMigration(credentials);
  } else if (outputFormat === 'Objection.js Models') {
    convertToObjection(credentials);
  }
})();
