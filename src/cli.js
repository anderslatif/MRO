#!/usr/bin/env node

import prompt from "./util/prompts.js";
import { convertToJSON, convertToHTML, convertToKnexMigration, convertToObjection } from "./util/converters.js";
// import "dotenv/config";

(async () => {

    let credentials;

    if (!process.env.DB_HOST) {
        // const { choosenDatabase } = await prompt.chooseDatabase();
        const { host } = await prompt.typeHost();
        const { database } = await prompt.typeDatabaseName();
        const { user } = await prompt.typeUser();
        const { password } = await prompt.typePassword();

        credentials = { host, database, user, password };

    } else {

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
    } else if (outputFormat === "Knex.js migrations") {
        convertToKnexMigration(credentials);
    } else if (outputFormat === "Objection.js Models") {
        convertToObjection(credentials);
    }

})();


