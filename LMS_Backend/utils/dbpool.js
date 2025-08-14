const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "sanjay",
  password: "Sanjay@180",
  database: "lms_db",
});

module.exports = pool;
