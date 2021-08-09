import connect from "../mysql/connect.js";

export function getSchema(credentials, showKeyTo) {

    return new Promise(async (resolve, reject) => {
        const connection = await connect(credentials);

        return connection.query(`SHOW TABLES;`, async (error, result, fields) => {
            if (error) {
                reject(error);
            }
            // result is an array of objects: { Tables_in_DATABASE: 'tableName' } 
            // where DATABASE is the actual name of the database 
            // and Tables_in_ is hardcoded from mysql

            const tableKey = `Tables_in_${credentials.database}`;

            const schema = await Promise.all(result.map(async (table) => {
                const tableName = table[tableKey];

                return await getTableSchema(connection, tableName, showKeyTo);
            }));

            connection.end();
            resolve(schema);
      });

    });
}

function getTableSchema(connection, tableName, showKeyTo) {
    return new Promise((resolve, reject) => {

        const getTableInfo = `SHOW FULL COLUMNS FROM ${tableName};`;

        return connection.query(getTableInfo, async (error, result, fields) => {
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

            if (showKeyTo) {
                result = await Promise.all(result.map(async (column) => {
                    if (column.Key.includes("MUL")) {
                        column.keyTo = await getPointsToReference(connection, tableName, column.Field);
                    }
                        return column;                    
                }));
            }
            resolve({ table: tableName, columns: result });
        });

    });
}

async function getPointsToReference(connection, tableName, columnName) {
    return new Promise((resolve, reject) => {
        const getTableInfo = `
                    SELECT CONCAT (REFERENCED_TABLE_NAME, '.', REFERENCED_COLUMN_NAME ) AS fk 
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE REFERENCED_TABLE_SCHEMA = schema() 
                        AND TABLE_NAME = ? 
                        AND COLUMN_NAME = ?;`;
        

        return connection.query(getTableInfo, [tableName, columnName], (error, result, fields) => {
            if (error) {
                reject(error);
            }
            resolve(result.map(relation => relation.fk));
        });

    });
}
