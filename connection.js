var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'tripster_db',
  insecureAuth: true,
  //socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
})

module.exports = connection;
