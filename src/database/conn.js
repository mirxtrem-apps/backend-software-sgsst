require("dotenv").config();
const mysql = require("mysql");


const connection = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.DB_PORT,
    // socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    connectTimeout: 10000,
});

connection.connect((error) => {

    if (error) {
        throw error;
    } else {
        console.log('Conexión exitosa a la Base de datos del software SG-SST');
    }
});

module.exports = connection;
