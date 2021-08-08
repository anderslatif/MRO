import { convertMysqlTypesToJavascript } from "../mysql/mysqlUtil.js";
import { toCamelCase, toPascalCase } from './caseUtil.js';

export function createObjectionFileString(table, className) {
    console.log(table)

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

// todo - handle mysql json type 
function getJsonSchema(table) {
    return (
`static get jsonSchema() {
        return {
            type: 'object',
            required: [],

            properties: {
            ${table.columns.map(column => `    ${toCamelCase(column.Field)}: { type: ${convertMysqlTypesToJavascript(column.Type.toUpperCase()).toLowerCase()} },
            `).join("")}
            }
        };
    }

`
);
}

function getRelationMappings(table) {
    const relationalTable = table.columns.filter(column => Boolean(column.keyTo));
    
    if (relationalTable.length === 0) return "";
    

    const relationClassName = []; 
    relationalTable.forEach(column => column.keyTo.forEach(relationTo => relationClassName.push(toPascalCase(relationTo.split(".")[0]))));

    return (
`static get relationMappings() {
        // todo the variable and file name should be singular
        ${relationClassName.map(className => `  const ${className} = require('./${className});
        `).join("")}
        
        ${relationalTable.map((table) => {
            return table.keyTo.map(keyTo => {
                const relationToTable = keyTo.split('.')[0];
                return `
        ${toCamelCase(relationToTable)}: {
            // todo these relations need to be fixed
            relation: ${table.Key === "MUL" ? `Model.ManyToManyRelation` : `Model.BelongsToOneRelation`},
            modelClass: ${toPascalCase(relationToTable)},
            join: {
                from: '${table.table}.${table.Field}',
                to: '${keyTo}'
            }
        }
        `;
            }).join("");
        
        }).join("")}`
);
}