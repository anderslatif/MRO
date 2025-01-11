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

console.log("************MRO_OUTPUT_FORMAT************", process.env.MRO_OUTPUT_FORMAT);

const outputFormat = await prompt.outputFormat();

console.log("************OUTPUT FORMAT************", outputFormat);

if (outputFormat === 'json') {
    console.log(credentials)
    const mysqlKeysToKeep = await prompt.outputMysqlKeysToKeep();
    convertToJSON(credentials, mysqlKeysToKeep);
} else if (outputFormat === 'html') {
    const mysqlKeysToKeep = await prompt.outputMysqlKeysToKeep();
    console.log("************HTML************", mysqlKeysToKeep);
    convertToHTML(credentials, mysqlKeysToKeep);
} else if (outputFormat === 'knex') {
    const moduleSyntax = await prompt.chooseModuleSyntax();
    credentials.moduleSyntax = moduleSyntax;
    convertToKnexMigration(credentials);
} else if (outputFormat === 'objection') {
    convertToObjection(credentials);
}
