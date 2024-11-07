import { connectMysql, connectPostgresql, connectSQLite } from "../mysql/connect.js";

export default async function getSchema(credentials, showKeyTo) {
    if (credentials.databaseType === "mysql") {
        return await getSchemaMySQL(credentials, showKeyTo);
    } else if (credentials.databaseType === "postgresql") {
        return await getSchemaPostgreSQL(credentials, showKeyTo);
    } else if (credentials.databaseType === "sqlite") {
        return await getSchemaSQLite(credentials, showKeyTo);
    }
}

function getSchemaMySQL(credentials, showKeyTo) {

    return new Promise(async (resolve, reject) => {

            try {
                const connection = await connectMysql(credentials);
                const [rows, fields] = await connection.execute("SHOW TABLES;");
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

function getSchemaPostgreSQL(credentials, showKeyTo) {

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


function getSchemaSQLite(credentials, showKeyTo) {

    return new Promise(async (resolve, reject) => {

        try {
            const db = await connectSQLite(credentials);

            const tables = await db.all(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
            );

            const schema = await Promise.all(tables.map(async (table) => {
                const tableName = table.name;
                return await getTableSchemaSQLite(db, tableName, showKeyTo);
            }));

            await db.close();
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

function getTableSchemaSQLite(connection, tableName, showKeyTo) {
    return new Promise(async (resolve, reject) => {
        try {
            const getTableInfo = `
                PRAGMA table_info(${tableName});
            `;
            const columns = await connection.all(getTableInfo);

            const formattedColumns = columns.map(column => ({
                Field: column.name,
                Type: column.type,
                Null: column.notnull === 0 ? "YES" : "NO",
                Default: column.dflt_value,
                Extra: column.pk ? 'PRIMARY KEY' : '',
                Collation: null // SQLite does not have collation info in `PRAGMA table_info`
            }));

            if (showKeyTo) {
                for (let column of formattedColumns) {
                    const keyInfo = await getPointsToReferenceSQLite(connection, tableName, column.Field);
                    if (keyInfo) {
                        column.keyTo = keyInfo;
                    }
                }
            }

            resolve({ table: tableName, columns: formattedColumns });
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

async function getPointsToReferenceSQLite(connection, tableName, columnName) {
    return new Promise(async (resolve, reject) => {
        try {
            const getForeignKeyInfo = `
                PRAGMA foreign_key_list(${tableName});
            `;
            const foreignKeys = await connection.all(getForeignKeyInfo);

            const relatedKeys = foreignKeys
                .filter(fk => fk.from === columnName)
                .map(fk => `${fk.table}.${fk.to}`);

            resolve(relatedKeys);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}
