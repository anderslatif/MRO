import inquirer from "inquirer";
import chalk from "chalk";

function chooseDatabase() {
    return inquirer.prompt([{
        type: "list",
        name: "choosenDatabase",
        message: "Choose database",
        choices: ["mysql"]    
    }])
    .catch(error => {
        if(error.isTtyError) {
            console.log("Prompt couldn't be rendered in the current environment");
        } else {
            console.log(error);
        }
    });
}

function typeHost() {
    return inquirer.prompt([{
        type: "confirm",
        name: "isLocalhost",
        message: "Is your database hosted on localhost."  
    }])
    .then(answer => {
        if (answer.isLocalhost) {
            return { host: "localhost" };
        } else {
            return inquirer.prompt([{
                type: "input",
                name: "host",
                message: "Type your database host address."  
            }])
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function typeDatabaseName() {
    return inquirer.prompt([{
        type: "input",
        name: "database",
        message: "Type your database name."  
    }])
    .catch(error => {
        console.log(error);
    });
}

function typeUsername() {
    return inquirer.prompt([{
        type: "input",
        name: "username",
        message: "Type your database username."  
    }])
    .catch(error => {
        console.log(error);
    });
}

function typePassword() {
    return inquirer.prompt([{
        type: "password",
        name: "password",
        message: "Type your database password."  
    }])
    .catch(error => {
        console.log(error);
    });
}

function outputFormat() {
    return inquirer.prompt([{
        type: "list",
        name: "outputFormat",
        message: "Choose an output format.",
        choices: ["JS File (Knex.js migration style)", "JSON (MYSQL Data types/JS Data Types)", "JS File (Objection.js style)"]  
    }])
    .catch(error => {
        console.log(error);
    });
}

function outputMysqlKeysToKeep() {

    return inquirer.prompt([{
        type: "checkbox",
        name: "mysqlKeysToKeep",
        message: "Select the key-value pairs you want.",
        choices: [
            { checked: true, value: "Field",name: chalk.grey.inverse.bold(" field    ") + ": column name" },
            { checked: true, value: "Type", name: chalk.grey.inverse.bold(" type     ") + ": int/varchar(255) etc." },
            { value: "Default",             name: chalk.grey.inverse.bold(" default  ") + ": null, timestamp etc." },
            { value: "Null",                name: chalk.grey.inverse.bold(" null     ") + ": YES/NO" },
            { value: "Key",                 name: chalk.grey.inverse.bold(" key      ") + ": PRI/MUL etc." },
            { value: "keyTo",               name: chalk.grey.inverse.bold(" keyTo    ") + ": Array of references 'table.columnName' if key is a Foreign Key" },
            { value: "Extra",               name: chalk.grey.inverse.bold(" extra    ") + ": AUTO_INCREMENT etc." },
            { value: "typeJS",              name: chalk.grey.inverse.bold(" typeJS   ") + ": Number/String etc.\n" +
            chalk.grey(`To learn more about type casting to JavaScript: https://www.npmjs.com/package/mysql#type-casting`) },
        ]
    }]
    )
    .catch(error => {
        console.log("error", error);
    });
}


export default { chooseDatabase, typeHost, typeDatabaseName, typeUsername, typePassword, outputFormat, outputMysqlKeysToKeep };
