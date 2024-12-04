import { connectMysql } from './connect.js';

export function getSchemaMySQL(credentials, showKeyTo) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await connectMysql(credentials);
      const [rows] = await connection.execute('SHOW TABLES;');
      const tableKey = `Tables_in_${credentials.database}`;

      const schema = await Promise.all(rows.map(async (table) => {
        const tableName = table[tableKey];
        return await getTableSchemaMySQL(connection, tableName, showKeyTo);
      }));

      connection.end();
      resolve(schema);
    } catch (error) {
      console.log(error);
      reject('Error connecting to database');
    }
  });
}

function getTableSchemaMySQL(connection, tableName, showKeyTo) {
  return new Promise(async (resolve, reject) => {
    try {
      const getTableInfo = `SHOW FULL COLUMNS FROM ${tableName};`;
      const [rows] = await connection.execute(getTableInfo);

      let columns = rows;
      if (showKeyTo) {
        columns = await Promise.all(rows.map(async (column) => {
          if (column.Key.includes('MUL')) {
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

async function getPointsToReferenceMySQL(connection, tableName, columnName) {
  return new Promise(async (resolve) => {
    const getTableInfo = `
                    SELECT CONCAT (REFERENCED_TABLE_NAME, '.', REFERENCED_COLUMN_NAME ) AS fk 
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE REFERENCED_TABLE_SCHEMA = schema() 
                        AND TABLE_NAME = ? 
                        AND COLUMN_NAME = ?;`;

    const [rows] = await connection.query(getTableInfo, [tableName, columnName]);

    resolve(rows.map(relation => relation.fk));
  });
}
