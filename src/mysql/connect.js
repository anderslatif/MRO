import mysql from "mysql2/promise"

export default async function connectMysql(credentials) {
    const connection = await mysql.createConnection({
        host     : credentials.host,
        database : credentials.database,
        user     : credentials.user,
        password : credentials.password
    });

    return connection;
}
