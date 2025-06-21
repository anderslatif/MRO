#!/usr/bin/env node

import * as prompt from './util/prompts.js';
import {
  convertToJSON, convertToHTML, convertToKnexMigration, convertToObjection,
} from './util/converters.js';

let credentials = {};

const databaseType = await prompt.chooseDatabaseType();

if (['mysql', 'postgresql'].includes(databaseType)) {

    const host = await prompt.typeHost();
    const port = await prompt.typePort(databaseType);
    const database = await prompt.typeDatabaseName();
    const user = await prompt.typeUser();
    const password = await prompt.typePassword();

    credentials = {
        databaseType, host, database, port, user, password,
    };

} else if (databaseType === 'sqlite') {
    const dbPath = await prompt.typeDbPath();

    credentials = { databaseType, dbPath, database: 'sqlite' };
}

const outputFormat = await prompt.outputFormat();

if (outputFormat === 'json') {
    const mysqlKeysToKeep = await prompt.outputMysqlKeysToKeep();
    credentials.mysqlKeysToKeep = mysqlKeysToKeep;
    convertToJSON(credentials);
} else if (outputFormat === 'html') {
    const mysqlKeysToKeep = await prompt.outputMysqlKeysToKeep();
    credentials.mysqlKeysToKeep = mysqlKeysToKeep;
    convertToHTML(credentials);
} else if (outputFormat === 'knex') {
    const moduleSyntax = await prompt.chooseModuleSyntax();
    credentials.moduleSyntax = moduleSyntax;
    convertToKnexMigration(credentials);
} else if (outputFormat === 'objection') {
    convertToObjection(credentials);
} else {
    console.error("Invalid output format. Environment Key: OUTPUT_FORMAT");
}

process.on('uncaughtException', (error) => {
    // in case the user exits the program with Ctrl+C, then don't show the inquirer.js error to the user
    if (error instanceof Error && error.name === 'ExitPromptError') {
        process.exit(0);
    } else {
      // Rethrow unknown errors
      throw error;
    }
});
