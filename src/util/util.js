import chalk from "chalk";

export function prettyPrintMysqlTables(tables) {
    tables.map(table => {
        console.log();
        console.log(chalk.blue(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`));
        console.log(chalk.grey(`TABLE: `), chalk.bgBlue(table.table));
        console.log(chalk.blue(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`));
        console.table(table.columns);
    });
}