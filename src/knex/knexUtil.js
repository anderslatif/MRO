// todo should sort the tables in order of cascade (creation and dropping)

export function createMigrationFileString(schema) {
    return (
`exports.up = function(knex) {
${schema.map(table => createMigrationTable(table)).join("")}        
};

exports.down = function(knex) {
    return knex.schema${schema.map(table => dropTables(table)).join("")};
};
`);
}

export function createEmptyMigrationFileString(schema) {
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
    knex.schema.createTable('${table.table}', (table) => {
${table.columns.map(column => createMigrationColumn(column)).join("")}
    });
    `
    );
}

function createMigrationColumn(column) {
    return (
`        table.${lookupKnexTypeFromMysql(column)};
`
        );
}

export function lookupKnexTypeFromMysql(column) {
    // ('${column.Field}')${constructAdditionalInfo(column)}
    // missing: jsonB, uuid('id').primary()
    if (column.Extra === "auto_increment") {
        return `uuid('${column.Field}').primary()${constructAdditionalInfo(column)}`
    } else  if (column.Type.includes("char") || column.Type.includes("text")) {
        // and contains varchar
        return `string()${constructAdditionalInfo(column)}`;
    } else if (column.Type.includes("tinyint(1)")) {
        return `boolean()${constructAdditionalInfo(column)}`;           
    } else if (column.Type.includes("int") || column.Type.includes("bit")) {
        // todo is this a correct match?
        return `integer()${constructAdditionalInfo(column)}`;
        // remember to add .unsigned() if it is 
    } else if (column.Type.includes("text")) {
        return;
    } else if (column.Type.includes("blob")) {
        return;
    } else if (column.Type.includes("json")) {
        return `json()`;
    } else if (column.Type.includes("enum")) {
        return;
    } else if (column.Type.includes("float")) {
        return `float()${constructAdditionalInfo(column)}`;
    } else if (column.Type.includes("decimal")) {
        return `decimal()${constructAdditionalInfo(column)}`;
    } else if (column.Type.includes("datetime")) {
        return `time()${constructAdditionalInfo(column)}`;
    } else if (column.Type.includes("date")) {
        return `date()${constructAdditionalInfo(column)}`;
    } else if (column.Type.includes("timestamp")) {
        const defaultTimestamp= column.Extra.includes("DEFAULT_GENERATED") ? `.defaultTo(knex.fn.now())` : "";
        return `timestamp()${defaultTimestamp}${constructAdditionalInfo(column)}`;
    }
}

function constructAdditionalInfo(column) {
    // notNull, nullable etc...
    let additionalInfo = "";
    
    if (column.KEY === "PRI") {
        additionalInfo += `.primary()`;
    }
    if (column.Null === "NO") {
        additionalInfo += `.notNull()`
    } else if (column.Null === "YES") {
        additionalInfo += `.unsigned()`
    }
    // constraints
    if (column.Key === "UNI") {
        additionalInfo += `.unique()`;
    }

    // indices (foreign keys)
    if (column.keyTo) {
        additionalInfo += column.keyTo.map(keyTo => `.foreign('${column.Field}').references('${keyTo}')`).join("");
    }

    // variations
    if (column.Type.includes("unsigned")) {
        additionalInfo += `.unsigned()`
    }

    return additionalInfo;
}

function dropTables(table) {
    return (
`
           .dropTable('${table.table}')`
    );
}

