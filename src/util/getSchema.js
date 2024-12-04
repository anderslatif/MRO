import { getSchemaMySQL } from '../mysql/queries.js';
import { getSchemaPostgreSQL } from '../postgreSQL/queries.js';
import { getSchemaSQLite } from '../sqlite/queries.js';

export default async function getSchema(credentials, showKeyTo) {
  if (credentials.databaseType === 'mysql') {
    return await getSchemaMySQL(credentials, showKeyTo);
  } else if (credentials.databaseType === 'postgresql') {
    return await getSchemaPostgreSQL(credentials, showKeyTo);
  } else if (credentials.databaseType === 'sqlite') {
    return await getSchemaSQLite(credentials, showKeyTo);
  }
}
