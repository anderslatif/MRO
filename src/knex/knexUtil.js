export function createMigrationFileString(schema, reverseSchema, moduleSyntax) {
  if (moduleSyntax === 'ES6') {
    return (
      `
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema${schema.map(table => createMigrationTable(table)).join('')};    
}

export function down(knex) {
    return knex.schema${reverseSchema.map(table => dropTables(table)).join('')};
}
`);
  } else if (moduleSyntax === 'CommonJS') {
    return (
      `/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema${schema.map(table => createMigrationTable(table)).join('')};        
};

exports.down = function(knex) {
    return knex.schema${reverseSchema.map(table => dropTables(table)).join('')};
};
`);
  }
}

export function createEmptyMigrationFileString() {
  return (
    `exports.up = function(knex) {
};

exports.down = function(knex) {
};
`);
}

function createMigrationTable(table) {
  return (
    `    
        .createTable('${table.table}', (table) => {
${table.columns.map(column => createMigrationColumn(column)).join('')}
        })`
  );
}

function createMigrationColumn(column, table) {
  return (
    `           table.${lookupKnexTypeFromSchema(column, table)};
`
  );
}

export function lookupKnexTypeFromSchema(column) {
  let columnType;
  const columnName = `'${column.Field}'`;
  const additionalInfo = constructAdditionalInfo(column);

  if (column.Extra.includes('auto_increment')) {
    columnType = `increments(${columnName})`;
  } else if (/char|varchar|text/.test(column.Type)) {
    const lengthMatch = column.Type.match(/\((\d+)\)/);
    const length = lengthMatch ? `, ${lengthMatch[1]}` : '';
    columnType = `string(${columnName}${length})`;
  } else if (column.Type.includes('tinyint(1)')) {
    columnType = `boolean(${columnName})`;
  } else if (column.Type.includes('int')) {
    columnType = `integer(${columnName})`;
  } else if (column.Type.includes('bigint')) {
    columnType = `bigInteger(${columnName})`;
  } else if (column.Type.includes('float') || column.Type.includes('real')) {
    columnType = `float(${columnName})`;
  } else if (column.Type.includes('decimal') || column.Type.includes('numeric')) {
    columnType = `decimal(${columnName})`;
  } else if (column.Type.includes('datetime') || column.Type.includes('timestamp')) {
    columnType = `dateTime(${columnName})`;
  } else if (column.Type.includes('date')) {
    columnType = `date(${columnName})`;
  } else if (column.Type.includes('json')) {
    columnType = `json(${columnName})`;
  } else if (column.Type.includes('blob') || column.Type.includes('binary')) {
    columnType = `binary(${columnName})`;
  } else if (column.Type.startsWith('enum')) {
    const enumValues = column.Type.match(/\((.*)\)/)[1];
    columnType = `specificType(${columnName}, 'ENUM(${enumValues})')`;
  } else {
    columnType = `specificType(${columnName}, '${column.Type}')`;
  }

  return `${columnType}${additionalInfo}`;
}

function constructAdditionalInfo(column) {
  let additionalInfo = '';

  if (column.Null === 'NO') {
    additionalInfo += '.notNullable()';
  }

  if (column.Default !== null) {
    if (column.Default.includes('nextval')) {
      additionalInfo += '.primary()';
    } else if (column.Default.toLowerCase() === 'current_timestamp') {
      additionalInfo += '.defaultTo(knex.fn.now())';
    } else {
      additionalInfo += `.defaultTo('${column.Default.replace(/'/g, "''")}')`;
    }
  }

  if (column.Type.includes('unsigned')) {
    additionalInfo += '.unsigned()';
  }

  if (column.Key === 'UNI') {
    additionalInfo += '.unique()';
  }

  if (column.Key === 'MUL') {
    additionalInfo += '.index()';
  }

  if (column.Key === 'PRI' && !additionalInfo.includes('.primary()')) {
    additionalInfo += '.primary()';
  }

  if (column.keyTo) {
    column.keyTo.forEach((keyTo) => {
      const [foreignTable, foreignColumn] = keyTo.split('.');
      additionalInfo += `;
           table.foreign('${column.Field}').references('${foreignColumn}').inTable('${foreignTable}')`;
    });
  }

  return additionalInfo;
}

function dropTables(table) {
  return (
    `
        .dropTable('${table.table}')`
  );
}
