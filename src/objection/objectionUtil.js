import { convertMysqlTypesToJavascript } from '../mysql/mysqlUtil.js';
import { toCamelCase, toPascalCase } from './casingUtil.js';
import pluralize from 'pluralize';

let importStatements = '';
const usesESM = false;

export function createObjectionFileString(table, className) {
  // reset the global import statements string
  importStatements = '';

  const idMethod = getIdMethod(table);
  const jsonSchema = getJsonSchema(table);
  const relationMappings = getRelationMappings(table);

  const importObjectionStatement = usesESM ? "import { Model } from 'objection';" : 'const { Model } = require(\'objection\');';
  const exportStatement = usesESM ? 'export default' : 'module.exports =';

  return (
    `${importObjectionStatement}
${importStatements}
class ${className} extends Model {

    static get tableName() {
        return '${table.table}';
    }

    ${idMethod}
    ${jsonSchema}
    ${relationMappings}
}

${exportStatement} ${className};
`);
}

function getIdMethod(table) {
  const idColumn = table.columns.find(column => column.Key === 'PRI');
  const idMethod = !idColumn ? '' : (
    `static get idColumn() {
        return '${idColumn.Field}';
    }

`);
  return idMethod;
}

function getJsonSchema(table) {
  return (
    `static get jsonSchema() {
        return {
            type: 'object',
            required: [],

            properties: {
            ${table.columns.map(column => {
      if (column.Type === 'json') {
        return getJsonTypeForJsonSchema(column);
      } else {
        return (`    ${column.Field}: { type: '${convertMysqlTypesToJavascript(column.Type.toUpperCase()).toLowerCase()}' },
            `);
      }
    }).join('')}
            }
        };
    }`
  );
}

function getJsonTypeForJsonSchema(column) {
  return (
    `   ${toCamelCase(column.Field)}: {
                    type: 'object',
                    properties: {
                        // fixme fill out if you have specific requirements to the json schema
                    }
                }`
  );
}

function getRelationMappings(table) {
  const relationalColumns = table.columns.filter(column => Boolean(column.keyTo));

  if (relationalColumns.length === 0) return '';

  const imports = new Set();
  relationalColumns.forEach(column => {
    column.keyTo.forEach(relationTo => {
      const tableName = relationTo.split('.')[0];
      imports.add(pluralize.singular(tableName));
    });
  });

  // exclude the current class from being imported
  const currentClassName = toPascalCase(pluralize.singular(table.table));
  imports.delete(currentClassName);

  if (usesESM) {
    importStatements += [...imports].map((className) => `import { ${toPascalCase(className)} } from './${toPascalCase(className)}.js';\n`).join('');
  } else {
    importStatements += [...imports].map((className) => {
      if (pluralize.singular(table.table) === className) {
        return '';
      } else {
        return `const ${toPascalCase(className)} = require('./${toPascalCase(pluralize.singular(className))}.js');\n`;
      }
    }).join('\n');
  }

  const relationMappings = relationalColumns.map(column => {
    return column.keyTo.map(keyTo => {
      const relationToTable = keyTo.split('.')[0];
      const relationName = toCamelCase(pluralize.singular(relationToTable));
      const relationType = column.Key === 'MUL' ? 'Model.ManyToManyRelation' : 'Model.BelongsToOneRelation';
      return (
        `${relationName}: {
                    relation: ${relationType},
                    modelClass: ${toPascalCase(pluralize.singular(relationToTable))},
                    join: {
                        from: '${table.table}.${column.Field}',
                        to: '${keyTo}'
                    }
                }`
      );
    }).join(',');
  }).join(',');

  return (
    `static get relationMappings() {
      
        return {
          ${relationMappings}
        };
    }`
  );
}
