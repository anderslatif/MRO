import chalk from 'chalk';

export function convertSchemaToNeatJson(schema, mysqlKeysToKeep, showKeyTo) {
  return schema.map(table => {
    const columns = table.columns.map(column => {
      let tableInfo = {};
      mysqlKeysToKeep.forEach(keyToKeep => {
        if (column[keyToKeep]) {
          tableInfo[keyToKeep.toLowerCase()] = column[keyToKeep];
        }
      });
      if (mysqlKeysToKeep.includes('typeJS')) {
        tableInfo.typeJS = convertMysqlTypesToJavascript(column.Type.toUpperCase());
      }
      if (showKeyTo) {
        tableInfo.keyTo = column.keyTo;
      }
      return tableInfo;
    });
    return {
      table: table.table,
      columns,
    };
  });
}

export function convertMysqlTypesToJavascript(type) {
  if (
    type.includes('TINYINT')
        || type.includes('SMALLINT')
        || type.includes('INT')
        || type.includes('MEDIUMINT')
        || type.includes('YEAR')
        || type.includes('FLOAT')
        || type.includes('DOUBLE')
  ) {
    return 'Number';
  } else if (
    type.includes('CHAR')
        || type.includes('VARCHAR')
        || type.includes('TINYTEXT')
        || type.includes('MEDIUMTEXT')
        || type.includes('LONGTEXT')
        || type.includes('TEXT')
        || type.includes('ENUM')
        || type.includes('SET')
        || type.includes('DECIMAL')
        || type.includes('BIGINT')
        || type.includes('TIME')
        || type.includes('GEOMETRY')
  ) {
    return 'String';
  } else if (
    type.includes('TIMESTAMP')
        || type.includes('DATE')
        || type.includes('DATETIME')
  ) {
    return 'Date';
  } else if (
    type.includes('TINYBLOB')
        || type.includes('MEDIUMBLOB')
        || type.includes('LONGBLOB')
        || type.includes('BLOB')
        || type.includes('BINARY')
        || type.includes('VARBINARY')
        || type.includes('BIT')
  ) {
    return 'Buffer';
  }
}

export function prettyPrintSchema(tables) {
  tables.map(table => {
    console.log();
    console.log(chalk.blue('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'));
    console.log(chalk.grey('TABLE: '), chalk.blue.inverse(' ' + table.table + ' '));
    console.log(chalk.blue('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'));
    console.table(table.columns);
  });
}
