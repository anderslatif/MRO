const object = {
    first: "yes",
    second: "no",
    b: "okay"
};

const keysToKeep = ["first"];

let newObject = {};
keysToKeep.map(keyToKeep => {
    if (object[keyToKeep]) {
        newObject[keyToKeep] = object[keyToKeep]
    }
});



import chalk from 'chalk';

console.log(chalk.grey.inverse.bold("  nice  "), ": explanation");