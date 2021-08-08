#!/usr/bin/env node

import prompt from "./util/prompts.js";
import { convertToJSON, convertToKnexMigration, convertToObjection } from "./mysql/converters.js";

(async () => {


    // const { choosenDatabase } = await prompt.chooseDatabase();
/*     const { host } = await prompt.typeHost();
    const { database } = await prompt.typeDatabaseName();
    const { username } = await prompt.typeUsername();
    const { password } = await prompt.typePassword(); */

    const { outputFormat } = await prompt.outputFormat();

    const credentials = { database: "mro" }; //{ host, database, username, password };

    if (outputFormat === "JSON (MYSQL Data types/JS Data Types)") {
        const { mysqlKeysToKeep } = await prompt.outputMysqlKeysToKeep();
        convertToJSON(credentials, mysqlKeysToKeep);
    } else if (outputFormat === "JS File (Knex.js migration style)") {
        convertToKnexMigration(credentials);
    } else if (outputFormat === "JS File (Objection.js style)") {
        convertToObjection(credentials);
    }

})();


