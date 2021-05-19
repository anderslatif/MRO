import { getSchema } from './queries.js';
import { convertMysqlTypesToJavascript, prettyPrintSchema } from './mysqlUtil.js';
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


async function convertToKnexMigration() {

}

async function convertToObjection() {

}