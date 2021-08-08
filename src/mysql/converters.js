import { getSchema } from './queries.js';
import { convertMysqlTypesToJavascript, prettyPrintSchema } from './mysqlUtil.js';
import { createMigrationFileString, createEmptyMigrationFileString } from '../knex/knexUtil.js';
import { getKnexTimestampString } from '../knex/generalUtil.js';
import { createObjectionFileString } from '../objection/objectionUtil.js';
import { toPascalCase } from '../objection/caseUtil.js';
import fs from "fs";

export async function convertToJSON(credentials, mysqlKeysToKeep) {
    const showKeyTo = mysqlKeysToKeep.includes("keyTo");
    const schema = await getSchema(credentials, showKeyTo);

    const tables = schema.map(table => {
        const columns = table.columns.map(column => {
            let tableInfo = {};
            mysqlKeysToKeep.map(keyToKeep => {
                if (column[keyToKeep]) {
                    tableInfo[keyToKeep.toLowerCase()] = column[keyToKeep];
                }
            });
            if (mysqlKeysToKeep.includes("typeJS")) {
                tableInfo.typeJS = convertMysqlTypesToJavascript(column.Type.toUpperCase());
            }
            if (showKeyTo) {
                delete tableInfo.keyto;
                tableInfo.keyTo = column.keyTo;
            }
            return tableInfo;
        });
        return {
            table: table.table,
            columns
        };
    });
    prettyPrintSchema(tables);
    const stringifiedSchema = JSON.stringify({ schema: tables }, null, 4);
    fs.writeFileSync(credentials.database+".json", stringifiedSchema);
}


export async function convertToKnexMigration(credentials) {
    const showKeyForeignKeys = true;
    const schema = await getSchema(credentials, showKeyForeignKeys);
    let fileString;
    if (schema.length > 0) {
        fileString = createMigrationFileString(schema);
    
        console.log(fileString);
    } else {
        fileString = createEmptyMigrationFileString();
    }

    fs.writeFileSync(getKnexTimestampString() + "_mro_migration.js", fileString);
}

export async function convertToObjection(credentials) {
    const showKeyForeignKeys = true;
    const schema = await getSchema(credentials, showKeyForeignKeys);

    schema.forEach(table => {
        const className = toPascalCase(table.table);
        const fileString = createObjectionFileString(table, className);
        console.log(fileString);
    
        const dir = "./out";
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        fs.writeFileSync(dir + "/" + className + ".js", fileString);
    });

}