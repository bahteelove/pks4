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
    console.log("MySQL [patientController] is connected");
});

// -------------------------------------------------------------------------------

// Create Patients Table
// GET /createpatientstable
const createPatientsTable = (req, res) => {
    let sql = 'CREATE TABLE patients (patient_id INT AUTO_INCREMENT PRIMARY KEY, patient_name VARCHAR(255), notes TEXT)';
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error creating <patients> table:", err.code, "-", err.message);
        res.status(500).send('<patients> table creation has failed');
        return;
      }
      console.log("<patients> table has created:", result);
      res.send("<patients> table has created");
    });
  };

// Alter Patient Table to add a column
// GET /alterpatienttable
const alterPatientTable = (req, res) => {
  let sql = 'ALTER TABLE patients ADD COLUMN email VARCHAR(255)';
  db.query(sql, (err, result) => {
      if (err) {
          console.error("Error altering <patient> table:", err.code, "-", err.message);
          res.status(500).send('<patient> table alteration has failed');
          return;
      }
      console.log("<patient> table has been altered to add column doctor_name");
      res.send("<patient> table has been altered to add column doctor_name");
  });
};

// Delete a column from the patient table
// GET /deletepatientcolum
const deletePatientColumn = (req, res) => {
  let sql = 'ALTER TABLE patients DROP COLUMN notes';
  db.query(sql, (err, result) => {
      if (err) {
          console.error("Error deleting column from patient table:", err.code, "-", err.message);
          res.status(500).send("Failed to delete column from patient table");
          return;
      }
      console.log("Column has been deleted from the patient table");
      res.send("Column has been deleted from the patient table");
  });
};
  
  // Get Patients Data
  // GET /getpatientstable
  const getPatientsData = (req, res) => {
    let sql = 'SELECT * FROM patients';
    db.query(sql, (err, result) => {
        if (err) {
        console.error("Error fetching <patients> info:", err.code, "-", err.message);
        res.status(500).send('Failed to fetch <patients> info');
        return;
        }
        console.log("<patients> info:", result);
        res.send(result);
    });
  };
  
  // get selected patient
  // GET /getselectedpatient/:patient_id
  const getSelectedPatient = (req, res) => {
    const { patient_id } = req.params;
  
    const sql = 'SELECT * FROM patients WHERE patient_id = ?';
    db.query(sql, [patient_id], (err, result) => {
      if (err) {
        console.error(`Error retrieving patient (${patient_id}):`, err);
        res.status(500).send(`Error retrieving patient (${patient_id})`);
        return;
      }
      if (result.length === 0) {
        console.log(`Patient with ID ${patient_id} not found`);
        res.status(404).send(`Patient with ID ${patient_id} not found`);
        return;
      }
      console.log(`Patient (${patient_id}) retrieved successfully`);
      res.json(result[0]); // Assuming you want to return the first (and only) result
    });
  };
  
  // Add New Patient
  // POST /addnewpatient
  const addNewPatient = (req, res) => {
    const { patient_name, phone_number, avatar, birthday, email } = req.body;
  
    const sql = 'INSERT INTO patients (patient_name, phone_number, avatar, birthday, email) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [patient_name, phone_number, avatar, birthday, email], (err, result) => {
      if (err) {
        console.error(`Error adding new patient (${patient_name}):`, err);
        res.status(500).send(`Error adding new patient (${patient_name})`);
        return;
      }
      console.log(`new patient (${patient_name}) added successfully`);
      res.send(`new patient (${patient_name}) added successfully`);
    });
  };
  
  // Add Empty Patient
  // POST //addemptypatient
  const addEmptyPatient = (req, res) => {
    const sql = 'INSERT INTO patients (patient_name, notes) VALUES ("", "")';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error adding empty patient:', err);
        res.status(500).send('Failed to add empty patient');
        return;
      }
      console.log('Empty patient added successfully');
      res.send('Empty patient added successfully');
    });
  };
  
  // Delete Patient
  // DELETE /deletepatient/:patient_id
  const deletePatient = (req, res) => {
    const { patient_id } = req.params;
  
    const sql = 'DELETE FROM patients WHERE patient_id = ?';
    db.query(sql, [patient_id], (err, result) => {
      if (err) {
        console.error(`Error deleting patient (${patient_id}):`, err);
        res.status(500).send(`Error deleting patient (${patient_id})`);
        return;
      }
      console.log(`patient (${patient_id}) deleted successfully`);
      res.send(`patient (${patient_id}) deleted successfully`);
    });
  };
  
  // Delete Null Patients
  // DELETE /deletenullpatients
  const deleteNullPatients = (req, res) => {
    const sql = 'DELETE FROM patients WHERE patient_name = "" OR patient_name IS NULL';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error deleting null patients:', err);
        res.status(500).send('Failed to delete null patients');
        return;
      }
      console.log('Null patients deleted successfully');
      res.send('Null patients deleted successfully');
    });
  };
  

module.exports = { 
    createPatientsTable,
  getPatientsData,
  addNewPatient,
  addEmptyPatient,
  deletePatient,
  deleteNullPatients,
  getSelectedPatient,
  alterPatientTable,
  deletePatientColumn
 }
