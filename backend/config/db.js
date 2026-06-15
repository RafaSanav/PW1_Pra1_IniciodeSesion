const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: "",
    database: process.env.DB_NAME
})

connection.connect((error) => {
    if (error){
        console.log("Error de conexion a la BDD");
        return;
    }
    console.log("Conexión exitosa a Mysql");
})

module.exports = connection;