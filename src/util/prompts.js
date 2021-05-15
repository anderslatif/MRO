import inquirer from "inquirer";

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
        choices: ["JSON (MYSQL Datatypes)", "JSON (Javascript Datatypes)", "JS File (Knex.js migration style)", "JS File (Objection.js style)"]  
    }])
    .catch(error => {
        console.log(error);
    });
}


export default { chooseDatabase, typeHost, typeDatabaseName, typeUsername, typePassword, outputFormat  };
