export function toCamelCase(tableName) {
    return toLowerCase(snakeToCamelcase(tableName));
}

export function toPascalCase(tableName) {
    return capitalize(snakeToCamelcase(tableName));
}

function snakeToCamelcase(tableName) {
    return tableName.split("_").map(word => capitalize(word)).join("");
} 

function capitalize(word) {
    if (word.length > 0) {
        return `${word.substr(0, 1).toUpperCase()}${word.substr(1, word.length)}`;
    } else {
        return "";
    }
}

export function toLowerCase(word) {
    if (word.length > 0) {
        return `${word.substr(0, 1).toLowerCase()}${word.substr(1, word.length)}`;
    } else {
        return "";
    }
}
