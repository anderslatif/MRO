import { connectPostgresql } from './connect.js';

export function getSchemaPostgreSQL(credentials, showKeyTo) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await connectPostgresql(credentials);

      const result = await client.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';",
      );

      const schema = await Promise.all(result.rows.map(async (row) => {
        const tableName = row.table_name;
        return await getTableSchemaPostgreSQL(client, tableName, showKeyTo);
      }));

      await client.end();
      resolve(schema);
    } catch (error) {
      console.log(error);
      reject('Error connecting to database');
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
