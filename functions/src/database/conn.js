const mysql = require('mysql');

// const connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '',
//     database : 'sisgsst'
// });

const connection = mysql.createConnection({
    host: "segsas.com",
    port: 3306,
    user: "segsasco_admin",
    password: "3Frn@%3rCkc2",
    database: "segsasco_sgsst",
  });

connection.connect(function(error) {
    if (error) {
        throw error;
    } else {
        console.log('Conexión exitosa a la Base de datos del software SG-SST');
    }
});

module.exports = connection;