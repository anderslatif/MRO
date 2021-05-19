import dotenv from "dotenv";
// remember to change the path depending on where you are running it from 
// right now it expects you to run it from root (package.json location)
dotenv.config({ path: "./src/dev/.env" });

import mysql from "mysql"

const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  database : process.env.DB_DATABASE,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD
});
 
connection.connect();

export default connection;