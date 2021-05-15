import mysql from "mysql"

function connectMysql(host, database, user, password) {
    const connection     = mysql.createConnection({
        host     : host,
        database : database,
        user     : user,
        password : password
    });
    connection.connect();

    return connection;
}



export default connectMysql;