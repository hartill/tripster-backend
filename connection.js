var mysql = require('mysql');

var connection = mysql.createConnection({
  //host: '77.68.89.247',
  host: 'localhost',
  //port: '8443',
  port: '3306',
  //user: 'trip',
  //password: 'z28Nyr&1',
  user: 'root',
  password: 'root',
  database: 'trips',
  insecureAuth: true,
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
})

module.exports = connection;
