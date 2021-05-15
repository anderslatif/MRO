#!/usr/bin/env node

import chalk from "chalk";
import prompt from "./util/prompts.js";
import { convertToJSONMysqlDatatypes } from "./mysql/mysqlUtil.js";

(async () => {
    // const { choosenDatabase } = await prompt.chooseDatabase();
    const { host } = await prompt.typeHost();
    const { database } = await prompt.typeDatabaseName();
    const { username } = await prompt.typeUsername();
    const { password } = await prompt.typePassword();

    const { outputFormat } = await prompt.outputFormat();
    "JSON (MYSQL Datatypes)", "JSON (Javascript Datatypes)", "JS File (Knex.js migration style)", "JS File (Objection.js style)"

    const credentials = { host, database, username, password };

    if (outputFormat === "JSON (MYSQL Datatypes)") {
        //convertToJSONMysqlDatatypes(credentials);
    } else if (outputFormat === "JSON (Javascript Datatypes)") {

    } else if (outputFormat === "JS File (Knex.js migration style)") {

    } else if (outputFormat === "JS File (Objection.js style)") {

    }

})();


