const mysql = require('mysql');
const dbconfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'getdev'
  }
  
  conn = mysql.createPool(dbconfig);
  module.exports = conn;