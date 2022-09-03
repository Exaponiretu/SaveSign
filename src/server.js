const mysql = require('mysql')
const server = mysql.createConnection({
    host: "localhost",
    user: "mikus",
    password: "mikolaj123",
    database: "savesign"
})

module.exports = server;