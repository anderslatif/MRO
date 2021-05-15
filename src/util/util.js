export function prettyPrintMysqlTables(tables) {
    tables.map(table => {
        console.log(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
        console.log(`TABLE:          `, table.table);
        console.log(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
        console.table(table.columns);
    });
}