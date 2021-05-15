// todo change this path to ../mysql/connect.js
import connection from "../dev/connect.js";
import { prettyPrintMysqlTables } from "../util/util.js";

function getSchema(credentials) {
    // todo use the credentials to initialize a connection 
    return new Promise((resolve, reject) => {
        
        return connection.query(`SHOW TABLES;`, async (error, result, fields) => {
            if (error) {
                reject(error);
            }
            // result is an array of objects: { Tables_in_DATABASE: 'tableName' } 
            // where DATABASE is the actual name of the database 
            // and Tables_in_ is hardcoded from mysql

            const tableKey = `Tables_in_${credentials.database}`;

            const schema = result.map(async (table) => {
                const tableName = table[tableKey];

                return await getTableSchema(tableName, connection);
            });

            connection.end();
            Promise.all(schema).then(resolve)
      });

    });
}

function getTableSchema(table, connection) {
    return new Promise((resolve, reject) => {

        const getTableInfo = `SHOW FULL COLUMNS FROM ${table};`;

        return connection.query(getTableInfo, (error, result, fields) => {
            if (error) {
                reject(error);
            }
            // Array of objects with the following content:
            /* 
            
            RowDataPacket {
                Field: 'id',  <--- name of the field
                Type: 'int',
                Collation: null,
                Null: 'NO',
                Key: 'PRI',
                Default: null,
                Extra: 'auto_increment',
                Privileges: 'select,insert,update,references',
                Comment: ''
            }            
            */
            resolve({ table, columns: result });
        });

    });
}

export async function convertToJSONMysqlDatatypes() {
    const schema = await getSchema({ database: "mro" });
    const tables = schema.map(table => {
        const columns = table.columns.map(column => {
            return {
                name: column.Field,
                type: column.Type,
                default: column.Default,
                null: column.Null,
                key: column.Key,
                extra: column.Extra?.toUpperCase()
            };
        });
        return {
            table: table.table,
            columns
        };
    });
    prettyPrintMysqlTables(tables);
    return { schema: tables};
}

convertToJSONMysqlDatatypes();

export async function convertToJSONJavascriptDatatypes() {

}

async function convertToJavascriptKnexMigration() {

}

async function convertToJavascriptObjection() {

}




