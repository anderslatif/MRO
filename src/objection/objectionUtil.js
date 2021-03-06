import { convertMysqlTypesToJavascript } from "../mysql/mysqlUtil.js";
import { toCamelCase, toPascalCase } from './casingUtil.js';

export function createObjectionFileString(table, className) {

    const idMethod = getIdMethod(table);
    const jsonSchema = getJsonSchema(table);
    const relationMappings = getRelationMappings(table);

    return (
`const { Model } = require('objection');

class ${className} extends Model {

    static get tableName() {
        return '${table.table}';
    }

    ${idMethod}
    ${jsonSchema}
    ${relationMappings}
}

module.exports = ${className};
`
    );
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
    const relationalTables = table.columns.filter(column => Boolean(column.keyTo));
    
    if (relationalTables.length === 0) return "";
    

    const relationClassName = [];
    relationalTables.forEach(column => column.keyTo.forEach(relationTo => relationClassName.push(toPascalCase(relationTo.split(".")[0]))));

    return (
`static get relationMappings() {
        // fixme the variable and file name should be singular
      ${relationClassName.map(className => `  const ${className} = require('./${className}');
      `).join("")}
      
        return {
        ${relationalTables.map(relationalTable => {
            return relationalTable.keyTo.map(keyTo => {
                const relationToTable = keyTo.split('.')[0];
                return (
            `
            ${toCamelCase(relationToTable)}: {
                // fixme these relations need to be fixed
                relation: ${table.Key === "MUL" ? `Model.ManyToManyRelation` : `Model.BelongsToOneRelation`},
                modelClass: ${toPascalCase(relationToTable)},
                join: {
                    from: '${table.table}.${relationalTable.Field}',
                    to: '${keyTo}'
                }
            }`);
            });
        
        })}
        };
    }`
);
}