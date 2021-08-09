import mysql from "mysql"

export default function connectMysql(credentials) {
    const connection     = mysql.createConnection({
        host     : credentials.host,
        database : credentials.database,
        user     : credentials.user,
        password : credentials.password
    });
    connection.connect();

    return connection;
}
