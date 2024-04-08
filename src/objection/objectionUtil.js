import { convertMysqlTypesToJavascript } from "../mysql/mysqlUtil.js";
import { toCamelCase, toPascalCase, toLowerCase } from './casingUtil.js';
import pluralize from "pluralize";

let importStatements = "";

export function createObjectionFileString(table, className) {

    const idMethod = getIdMethod(table);
    const jsonSchema = getJsonSchema(table);
    const relationMappings = getRelationMappings(table);

    const file = `
import { Model } from 'objection';

class ${className} extends Model {

    static get tableName() {
        return '${table.table}';
    }

    ${idMethod}
    ${jsonSchema}
    ${relationMappings}
}

module.exports = ${className};
`;

    return importStatements + file;
}

function getIdMethod(table) {
    const idColumn = table.columns.find(column => column.Key === "PRI");
    const idMethod = !idColumn ? "" : (
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
                if (column.Type === "json") {
                    return getJsonTypeForJsonSchema(column);
                    return ``;
                } else {
                    return (`    ${toCamelCase(column.Field)}: { type: ${convertMysqlTypesToJavascript(column.Type.toUpperCase()).toLowerCase()} },
            `);
                }
            }).join("")}
            }
        };
    }

`
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
    
    if (relationalColumns.length === 0) return "";

    let imports = new Set();
    relationalColumns.forEach(column => {
        column.keyTo.forEach(relationTo => {
            const tableName = relationTo.split(".")[0];
            imports.add(pluralize.singular(tableName));
        });
    });

    importStatements = [...imports].map(className => 
        `import { ${toPascalCase(className)} } from './${toPascalCase(pluralize.singular(className))}.js';`
    ).join("\n");

    const relationMappings = relationalColumns.map(column => {
        return column.keyTo.map(keyTo => {
            const relationToTable = keyTo.split('.')[0];
            const relationName = toCamelCase(pluralize.singular(relationToTable));
            const relationType = column.Key === "MUL" ? `Model.ManyToManyRelation` : `Model.BelongsToOneRelation`;
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
