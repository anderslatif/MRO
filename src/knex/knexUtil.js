export function createMigrationFileString(schema, reverseSchema) {
    return (
`/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema${schema.map(table => createMigrationTable(table)).join("")}        
};

exports.down = function(knex) {
    return knex.schema${reverseSchema.map(table => dropTables(table)).join("")};
};
`);
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
${table.columns.map(column => createMigrationColumn(column)).join("")}
        })`
    );
}

function createMigrationColumn(column, table) {
    return (
`           table.${lookupKnexTypeFromMysql(column, table)};
`
        );
}

export function lookupKnexTypeFromMysql(column) {
    let columnType;
    const columnName = `'${column.Field}'`;
    const additionalInfo = constructAdditionalInfo(column);

    if (column.Extra.includes("auto_increment")) {
        columnType = `increments(${columnName})`;
    } else if (column.Type.includes("char") || column.Type.includes("varchar") || column.Type.includes("text")) {
        columnType = `string(${columnName})`;
    } else if (column.Type.includes("tinyint(1)")) {
        columnType = `boolean(${columnName})`;
    } else if (column.Type.includes("int")) {
        columnType = `integer(${columnName})`;
    } else if (column.Type.includes("bigint")) {
        columnType = `bigInteger(${columnName})`;
    } else if (column.Type.includes("float")) {
        columnType = `float(${columnName})`;
    } else if (column.Type.includes("decimal")) {
        columnType = `decimal(${columnName})`;
    } else if (column.Type.includes("datetime")) {
        columnType = `dateTime(${columnName})`;
    } else if (column.Type.includes("date")) {
        columnType = `date(${columnName})`;
    } else if (column.Type.includes("timestamp")) {
        columnType = `timestamp(${columnName})`;
    } else if (column.Type.includes("json")) {
        columnType = `json(${columnName})`;
    } else if (column.Type.includes("blob")) {
        columnType = `binary(${columnName})`;
    } else if (column.Type.includes("enum")) {
        // Example ENUM type: column.Type = "enum('val1','val2')"
        const enumValues = column.Type.match(/\((.*)\)/)[1];
        columnType = `specificType(${columnName}, 'ENUM(${enumValues})')`;
    } else {
        columnType = `specificType(${columnName}, '${column.Type}')`;
    }

    return `${columnType}${additionalInfo}`;
}

function constructAdditionalInfo(column) {
    let additionalInfo = "";

    if (column.Null === "NO") {
        additionalInfo += `.notNullable()`;
    }

    if (column.Default !== null) {
        // it it's a nextval sequence field in PostgreSQl
        if (column.Default.includes("nextval")) {
            additionalInfo += `.primary()`;
        } else {
            additionalInfo += `.defaultTo('${column.Default}')`;
        }
    }

    if (column.Type.includes("unsigned")) {
        additionalInfo += `.unsigned()`;
    }

    if (column.Key === "UNI") {
        additionalInfo += `.unique()`;
    }

    if (column.Key === "MUL") {
        additionalInfo += `.index()`;
    }

    if (column.Key === "PRI") {
        additionalInfo += `.primary()`;
    }

    if (column.keyTo) {
        column.keyTo.forEach((keyTo) => {
            const currentColumn = column.Field;
            const [foreignTable, foreignColumn] = keyTo.split('.');

            additionalInfo += `;
           table.foreign('${currentColumn}').references('${foreignColumn}').inTable('${foreignTable}')`;
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

