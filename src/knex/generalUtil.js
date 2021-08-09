export function getKnexTimestampString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth().length === 2 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const monthDate = date.getDate().length === 2 ? date.getDate() : `0${date.getDate()}`;
    const seconds = date.getSeconds().length === 2 ? date.getSeconds() : `0${date.getSeconds()}`;
    let miliSecondsString = `${date.getMilliseconds()}`;
    let miliseconds;

    if (miliSecondsString.length === 1) {
        miliseconds = `00${miliSecondsString}`;
    } else if (miliSecondsString.length === 2) {
        miliseconds = `0${miliSecondsString}`;
    } else if (miliSecondsString.length === 3) {
        miliseconds = miliSecondsString;
    } else if (miliSecondsString.length === 4) {
        miliseconds = miliSecondsString.substr(0, 2);
    }

    return `${year}${month}${monthDate}${seconds}${miliseconds}`;
}

