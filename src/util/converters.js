import { getSchema } from '../mysql/queries.js';
import { prettyPrintSchema, convertSchemaToNeatJson } from '../mysql/mysqlUtil.js';
import { getHTMLDocument } from '../html/htmlDocsUtil.js';
import { createMigrationFileString, createEmptyMigrationFileString } from '../knex/knexUtil.js';
import { getKnexTimestampString } from '../knex/timeUtil.js';
import { createObjectionFileString } from '../objection/objectionUtil.js';
import { toPascalCase } from '../objection/casingUtil.js';
import prompts from "./prompts.js"
import fs from "fs";
import { createDependencyGraph, topologicalSort, sortSchema } from '../knex/dependencyGraph.js';

export async function convertToJSON(credentials, mysqlKeysToKeep) {
    const showKeyTo = mysqlKeysToKeep.includes("keyTo");
    const schema = await getSchema(credentials, showKeyTo);

    const tables = convertSchemaToNeatJson(schema, mysqlKeysToKeep, showKeyTo);
    const stringifiedSchema = JSON.stringify({ schema: tables }, null, 4);

    prettyPrintSchema(tables);
    fs.writeFileSync(credentials.database+".json", stringifiedSchema);
}

export async function convertToHTML(credentials, mysqlKeysToKeep) {
    const showKeyTo = mysqlKeysToKeep.includes("keyTo");
    const schema = await getSchema(credentials, showKeyTo);

    const tables = convertSchemaToNeatJson(schema, mysqlKeysToKeep, showKeyTo);
    const selectedTables = await prompts.selectTables(tables);

    const filteredTables = tables.filter(table => selectedTables.tables.includes(table.table));

    const htmlDocument = getHTMLDocument(filteredTables, credentials.database);

    prettyPrintSchema(filteredTables);    
    fs.writeFileSync(`${credentials.database}_mro_docs.html`, htmlDocument);
}


export async function convertToKnexMigration(credentials) {
    const showKeyForeignKeys = true;
    const schema = await getSchema(credentials, showKeyForeignKeys);
    const tablesToIgnore = ['knex_migrations', 'knex_migrations_lock'];
    const schemaWithoutKnexTables = schema.filter((table) => !tablesToIgnore.includes(table.table));
    let fileString;
    if (schemaWithoutKnexTables.length > 0) {
        const graph = createDependencyGraph(schemaWithoutKnexTables);
        const sortedTables = topologicalSort(graph);
        // sorting on copies rather than the original schema
        const sortedSchema = sortSchema(schemaWithoutKnexTables, [...sortedTables]);
        const sortedSchemaReversed = [...sortedSchema].reverse();

        fileString = createMigrationFileString(sortedSchema, sortedSchemaReversed);
    
    } else {
        fileString = createEmptyMigrationFileString();
    }

    fs.writeFileSync(getKnexTimestampString() + "_mro_migration.js", fileString);
}

export async function convertToObjection(credentials) {
    const showKeyForeignKeys = true;
    const schema = await getSchema(credentials, showKeyForeignKeys);

    schema.forEach(table => {
        const className = toPascalCase(table.table);
        const fileString = createObjectionFileString(table, className);
        
        // makes it easier while testing to keep it in a folder rather than mixing the codebase with files
        const dir = process.env.NODE_ENV === "dev" ? "./out" : "";
        if (dir && !fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        fs.writeFileSync(dir + "/" + className + ".js", fileString);
    });
}