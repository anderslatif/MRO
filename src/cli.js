#!/usr/bin/env node

import prompt from "./util/prompts.js";
import { convertToJSON, convertToKnexMigration, convertToObjection } from "./util/converters.js";

(async () => {


    // const { choosenDatabase } = await prompt.chooseDatabase();
    const { host } = await prompt.typeHost();
    const { database } = await prompt.typeDatabaseName();
    const { user } = await prompt.typeUser();
    const { password } = await prompt.typePassword();

    const { outputFormat } = await prompt.outputFormat();

    const credentials = { host, database, user, password };

    if (outputFormat === "JSON (MYSQL Data types/JS Data Types)") {
        const { mysqlKeysToKeep } = await prompt.outputMysqlKeysToKeep();
        convertToJSON(credentials, mysqlKeysToKeep);
    } else if (outputFormat === "JS File (Knex.js migration style)") {
        convertToKnexMigration(credentials);
    } else if (outputFormat === "JS File (Objection.js style)") {
        convertToObjection(credentials);
    }

})();


