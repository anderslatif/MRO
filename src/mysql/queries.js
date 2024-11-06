import { connectMysql, connectPostgresql } from "../mysql/connect.js";

export default async function getSchema(credentials, showKeyTo) {
    if (credentials.databaseType === "mysql") {
        return await getSchemaMysql(credentials, showKeyTo);
    } else if (credentials.databaseType === "postgresql") {
        return await getSchemaPostgresql(credentials, showKeyTo);
    }
}

function getSchemaMysql(credentials, showKeyTo) {

    return new Promise(async (resolve, reject) => {

            try {
                const connection = await connectMysql(credentials);
                const [rows, fields] = await connection.execute("SHOW TABLES;");
                // result is an array of objects: { Tables_in_DATABASE: 'tableName' } 
                // where DATABASE is the actual name of the database 
                // where DATABASE is the actual name of the database 
                // where DATABASE is the actual name of the database 
                // and Tables_in_ is hardcoded from mysql

                const tableKey = `Tables_in_${credentials.database}`;

                const schema = await Promise.all(rows.map(async (table) => {
                    const tableName = table[tableKey];
                    return await getTableSchemaMySQL(connection, tableName, showKeyTo);
                }));
                

                connection.end();
                resolve(schema);
            } catch (error) {
                console.log(error);
                reject("Error connecting to database");
            }

    });
}

function getSchemaPostgresql(credentials, showKeyTo) {

    return new Promise(async (resolve, reject) => {

        try {
            const client = await connectPostgresql(credentials);

            const result = await client.query(
                "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
            );

            const schema = await Promise.all(result.rows.map(async (row) => {
                const tableName = row.table_name;
                return await getTableSchemaPostgreSQL(client, tableName, showKeyTo);
            }));

            await client.end();
            resolve(schema);
        } catch (error) {
            console.log(error);
            reject("Error connecting to database");
        }

    });
}


function getTableSchemaMySQL(connection, tableName, showKeyTo) {
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
                        column.keyTo = await getPointsToReferenceMySQL(connection, tableName, column.Field);
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

function getTableSchemaPostgreSQL(connection, tableName, showKeyTo) {
    return new Promise(async (resolve, reject) => {
        try {
                const getTableInfo = `
                SELECT 
                    column_name AS "Field",
                    data_type AS "Type",
                    is_nullable AS "Null",
                    column_default AS "Default",
                    CASE WHEN is_identity = 'YES' THEN 'auto_increment' ELSE '' END AS "Extra",
                    collation_name AS "Collation"
                FROM 
                    information_schema.columns
                WHERE 
                    table_name = $1
                    AND table_schema = 'public';
            `;
            const { rows } = await connection.query(getTableInfo, [tableName]);

            // Enhance columns with foreign key info if requested
            let columns = rows;
            if (showKeyTo) {
                columns = await Promise.all(rows.map(async (column) => {
                    const keyInfo = await getPointsToReferencePostgreSQL(connection, tableName, column.Field);
                    if (keyInfo) {
                        column.keyTo = keyInfo;
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

async function getPointsToReferenceMySQL(connection, tableName, columnName) {
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

async function getPointsToReferencePostgreSQL(connection, tableName, columnName) {
    return new Promise(async (resolve, reject) => {
        try {
            const getTableInfo = `
                SELECT 
                    tc.table_name AS referenced_table,
                    kcu.column_name AS referenced_column
                FROM 
                    information_schema.table_constraints AS tc
                    JOIN information_schema.key_column_usage AS kcu 
                        ON tc.constraint_name = kcu.constraint_name
                        AND tc.table_schema = kcu.table_schema
                    JOIN information_schema.constraint_column_usage AS ccu 
                        ON ccu.constraint_name = tc.constraint_name
                        AND ccu.table_schema = tc.table_schema
                WHERE 
                    tc.constraint_type = 'FOREIGN KEY' 
                    AND tc.table_name = $1 
                    AND kcu.column_name = $2;
            `;

            const { rows } = await connection.query(getTableInfo, [tableName, columnName]);

            resolve(rows.map(relation => `${relation.referenced_table}.${relation.referenced_column}`));
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

