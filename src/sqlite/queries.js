import { connectSQLite } from "./connect.js";

export function getSchemaSQLite(credentials, showKeyTo) {

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
