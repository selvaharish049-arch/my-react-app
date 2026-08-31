const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "selva@123",
    database: "luxe_interior"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection error:", err);
    } else {
        console.log("MySQL Connected Successfully");
    }
});

module.exports = db;