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
    console.log("MySQL [doctorController] is connected");
});
// -------------------------------------------------------------------------------

// to crate doctors table
// GET /createdoctorstable
const createDoctorsTable = (req, res) => {
    let sql = 'CREATE TABLE doctors (doctor_id INT AUTO_INCREMENT, doctor_name VARCHAR(255), specialization VARCHAR(255), avatar VARCHAR(255), PRIMARY KEY (doctor_id))';
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error creating <doctors> table:", err.code, "-", err.message);
        res.status(500).send('<doctors> table creation has failed');
        return;
      }
      console.log("<doctors> table has created:", result);
      res.send("<doctors> table has created");
    });
  };
  
  // to get <doctors> data
  // GET /getdoctorstable
  const getDoctorsData = (req, res) => {
    let sql = 'SELECT * FROM doctors';
    db.query(sql, (err, result) => {
        if (err) {
        console.error("Error fetching <doctors> info:", err.code, "-", err.message);
        res.status(500).send('Failed to fetch <doctors> info');
        return;
        }
        console.log("<doctors> info:", result);
        res.send(result);
    });
  };
  
  // to get a selected doctor
  // GET /getselecteddoctor/:doctor_id
  const getSelectedDoctor = (req, res) => {
    const { doctor_id } = req.params;
  
    const sql = 'SELECT * FROM doctors WHERE doctor_id = ?';
    db.query(sql, [doctor_id], (err, result) => {
      if (err) {
        console.error(`Error fetching doctor (${doctor_id}) info:`, err.code, "-", err.message);
        res.status(500).send(`Failed to fetch doctor (${doctor_id}) info`);
        return;
      }
      if (result.length === 0) {
        console.log(`Doctor with ID ${doctor_id} not found`);
        res.status(404).send(`Doctor with ID ${doctor_id} not found`);
        return;
      }
      console.log(`Doctor (${doctor_id}) info:`, result[0]);
      res.status(200).json(result[0]); // Return only the first row (assuming doctor_id is unique)
    });
  };
  
  
  // to add an empty doctor
  // POST /addemptydoctor
  const addEmptyDoctor = (req, res) => {
    let post = { doctor_name: "", specialization: "", avatar: "" };
    let sql = 'INSERT INTO doctors SET ?';
    let query = db.query(sql, post, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Users has added...")
    })
  };
  
  // endpoint
  // POST /submitform
  const addNewDoctor = (req, res) => {
    const { doctor_name, specialization, avatar } = req.body;
  
    // Insert form data into MySQL database
    const sql = 'INSERT INTO doctors (doctor_name, specialization, avatar) VALUES (?, ?, ?)';
    db.query(sql, [doctor_name, specialization, avatar], (err, result) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
        res.status(500).send('Failed to submit form');
        return;
      }
      console.log('Form data inserted into MySQL');
      res.send('Form submitted successfully');
    });
  
  };
  
  // to delete a doctor
  // DELETE deletedoctor/:doctor_name
  const deleteDoctor = (req, res) => {
      const doctor_name = req.params.doctor_name;
      let sql = 'DELETE FROM doctors WHERE doctor_name = ?';
      db.query(sql, [doctor_name], (err, result) => {
          if (err) {
          console.error(`Error deleting doctor (${doctor_name}):`, err.code, "-", err.message);
          res.status(500).send('Failed to delete doctor');
          return;
          }
          console.log("doctor deleted successfully");
          res.send(`doctor (${doctor_name}) deleted successfully`);
      });
  };
  
  // to delete empty doctors
  // DELETE /deleteemptydoctors
  const deleteNullDoctors = (req, res) => {
    let sql = `DELETE FROM doctors WHERE doctor_name = '' OR doctor_name IS NULL OR doctor_name = ' ';`;
    db.query(sql, (err, result) => {
        if (err) {
        console.error(`Error deleting doctor:`, err.code, "-", err.message);
        res.status(500).send(`Failed to delete doctor`);
        return;
        }
        console.log(`doctor deleted successfully`);
        res.send(`doctor deleted successfully`);
    });
  };

  
module.exports = { 
    createDoctorsTable,
  getDoctorsData,
  addEmptyDoctor,
  addNewDoctor,
  deleteDoctor,
  deleteNullDoctors,
  getSelectedDoctor
 }
