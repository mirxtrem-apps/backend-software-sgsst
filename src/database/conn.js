require('dotenv').config();
const mysql = require('mysql');


// const connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '',
//     database : 'sisgsst'
// });

const connection = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
  });

connection.connect(function(error) {
    if (error) {
        throw error;
    } else {
        console.log('Conexión exitosa a la Base de datos del software SG-SST');
    }
});

module.exports = connection;