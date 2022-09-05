import connect from "../mysql/connect.js";

export function getSchema(credentials, showKeyTo) {

    return new Promise(async (resolve, reject) => {
        

            try {
                const connection = await connect(credentials);
                const [rows, fields] = await connection.execute("SHOW TABLES;");
                // result is an array of objects: { Tables_in_DATABASE: 'tableName' } 
            // result is an array of objects: { Tables_in_DATABASE: 'tableName' } 
                // result is an array of objects: { Tables_in_DATABASE: 'tableName' } 
                // where DATABASE is the actual name of the database 
            // where DATABASE is the actual name of the database 
                // where DATABASE is the actual name of the database 
                // and Tables_in_ is hardcoded from mysql

                const tableKey = `Tables_in_${credentials.database}`;

                const schema = await Promise.all(rows.map(async (table) => {
                    const tableName = table[tableKey];
                    return await getTableSchema(connection, tableName, showKeyTo);
                }));
                

                connection.end();
                resolve(schema);
            } catch (error) {
                console.log(error);
                reject("Error connecting to database");
            }

    });
}

function getTableSchema(connection, tableName, showKeyTo) {
    return new Promise(async (resolve, reject) => {

        try {
            const getTableInfo = `SHOW FULL COLUMNS FROM ${tableName};`;
            const [rows, fields] = await connection.execute(getTableInfo);

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
            let columns = rows;
            if (showKeyTo) {
                columns = await Promise.all(rows.map(async (column) => {
                    if (column.Key.includes("MUL")) {
                        column.keyTo = await getPointsToReference(connection, tableName, column.Field);
                    }
                    return column;                    
                }));
            }
            resolve({ table: tableName, columns });
        } catch (error) {
            console.log(error);
            reject(error);
        }

    });
}

async function getPointsToReference(connection, tableName, columnName) {
    return new Promise(async (resolve, reject) => {
        const getTableInfo = `
                    SELECT CONCAT (REFERENCED_TABLE_NAME, '.', REFERENCED_COLUMN_NAME ) AS fk 
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE REFERENCED_TABLE_SCHEMA = schema() 
                        AND TABLE_NAME = ? 
                        AND COLUMN_NAME = ?;`;
        

        const [rows, fields] = await connection.query(getTableInfo, [tableName, columnName]);
    
        resolve(rows.map(relation => relation.fk));

    });
}
