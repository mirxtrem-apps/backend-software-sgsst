require("dotenv").config();
const mysql = require("mysql");

const pool = mysql.createPool({
  host: process.env.HOST,
  port: process.env.DB_PORT,
  // socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  connectTimeout: 10000,
});

pool.on("connection", (conn) => {
  console.log("Conexión exitosa a la Base de datos del software SG-SST");
});

pool.on("close", (conn) => {
  console.log("Conexión %d liberada", conn.threadId );
});

module.exports = pool;
