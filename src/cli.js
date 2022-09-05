#!/usr/bin/env node

import prompt from "./util/prompts.js";
import { convertToJSON, convertToHTML, convertToKnexMigration, convertToObjection } from "./util/converters.js";
let dotenv;
import('dotenv').then((module) => dotenv = module);

(async () => {

    let credentials;

    if (!dotenv) {
        // const { choosenDatabase } = await prompt.chooseDatabase();
        const { host } = await prompt.typeHost();
        const { database } = await prompt.typeDatabaseName();
        const { user } = await prompt.typeUser();
        const { password } = await prompt.typePassword();

        credentials = { host , database, user, password };

    } else {

        dotenv.config();
        credentials = { 
            host: process.env.DB_HOST, 
            database: process.env.DB_DATABASE, 
            user: process.env.DB_USER, 
            password: process.env.DB_PASSWORD
        };
        
    }


    const { outputFormat } = await prompt.outputFormat();


    if (outputFormat === "JSON (MYSQL Data types/JS Data Types)") {
        const { mysqlKeysToKeep } = await prompt.outputMysqlKeysToKeep();
        convertToJSON(credentials, mysqlKeysToKeep);
    } else if (outputFormat === "HTML Page") {
        const { mysqlKeysToKeep } = await prompt.outputMysqlKeysToKeep();
        convertToHTML(credentials, mysqlKeysToKeep);
    } else if (outputFormat === "JS File (Knex.js migration style)") {
        convertToKnexMigration(credentials);
    } else if (outputFormat === "JS File (Objection.js style)") {
        convertToObjection(credentials);
    }

})();


