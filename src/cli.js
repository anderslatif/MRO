#!/usr/bin/env node

import prompt from './util/prompts.js';
import {
  convertToJSON, convertToHTML, convertToKnexMigration, convertToObjection,
} from './util/converters.js';

import * as getEnvVariables from './util/getEnvironmentVariables.js';

(async () => {
  let credentials = {};

    const { databaseType } = getEnvVariables.getDatabaseType() || await prompt.chooseDatabase();

  if (['mysql', 'postgresql'].includes(databaseType)) {
    
    const { host } = getEnvVariables.getHost() || await prompt.typeHost();
    const { port } = getEnvVariables.getPort() || await prompt.typePort(databaseType);
    const { database } = getEnvVariables.getDatabaseName() || await prompt.typeDatabaseName();
    const { user } = getEnvVariables.getUser() || await prompt.typeUser();
    const { password } = getEnvVariables.getPassword() || await prompt.typePassword();

    credentials = {
      databaseType, host, database, port, user, password,
    };
  } else if (databaseType === 'sqlite') {
    const { dbPath } = getEnvVariables.getDatabasePath() || await prompt.typeDbPath();

    credentials = { databaseType, dbPath, database: 'sqlite' };
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
