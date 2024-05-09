const mysql = require("mysql")

// Create a database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "hospital_db"
});

// Connect to the database
db.connect((err) => {
    if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
    }
    console.log("MySQL [dataController] is connected");
});

// to create a database
const createDB = (req, res) => {
  let sql = 'CREATE DATABASE IF NOT EXISTS hospital_db'; // Modified SQL query to avoid errors if the database already exists
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error creating database:", err.code, "-", err.message);
      res.status(500).send('Database creation failed');
      return;
    }
    console.log("Database created:", result);
    res.send('Database created');
  });
};

module.exports = { createDB }
