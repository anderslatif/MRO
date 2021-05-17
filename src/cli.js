#!/usr/bin/env node

import prompt from "./util/prompts.js";
import { convertToJSONMysqlDatatypes } from "./mysql/mysqlUtil.js";

(async () => {
    // const { choosenDatabase } = await prompt.chooseDatabase();
    const { host } = await prompt.typeHost();
    const { database } = await prompt.typeDatabaseName();
    const { username } = await prompt.typeUsername();
    const { password } = await prompt.typePassword();

    const { outputFormat } = await prompt.outputFormat();

    const credentials = { host, database, username, password };

    if (outputFormat === "JSON (MYSQL Datatypes)") {
        const {} = prompt.outputMysqlToJsonFormat();
        //convertToJSONMysqlDatatypes(credentials);
    } else if (outputFormat === "JS File (Knex.js migration style)") {

    } else if (outputFormat === "JS File (Objection.js style)") {

    }

})();


