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
    console.log("MySQL [patientHistoryController] is connected");
});

// -------------------------------------------------------------------------------


// Create Patient History Table
// GET /createpatienthistorytable
const createPatientHistoryTable = (req, res) => {
    let sql = 'CREATE TABLE patient_history (id INT AUTO_INCREMENT PRIMARY KEY, patient_id INT, date DATETIME, issue TEXT, advice TEXT, recipe TEXT, doctor_id INT, FOREIGN KEY (patient_id) REFERENCES patients(patient_id), FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id))';
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error creating <patient_history> table:", err.code, "-", err.message);
        res.status(500).send('<patient_history> table creation has failed');
        return;
      }
      console.log("<patient_history> table has created:", result);
      res.send("<patient_history> table has created");
    });
  };
  
  // change the column type
  const changeDateColumnType = (req, res) => {
    let sql = 'ALTER TABLE patient_history MODIFY COLUMN date VARCHAR(255)';
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error changing column type:", err.code, "-", err.message);
        res.status(500).send('Failed to change column type');
        return;
      }
      console.log("Column type changed successfully:", result);
      res.send('Column type changed successfully');
    });
  };
  
// Alter Patient History Table to add doctor_name column
// GET /alterpatienthistorytable
const alterPatientHistoryTable = (req, res) => {
  let sql = 'ALTER TABLE patient_history ADD COLUMN patient_name VARCHAR(255)';
  db.query(sql, (err, result) => {
      if (err) {
          console.error("Error altering <patient_history> table:", err.code, "-", err.message);
          res.status(500).send('<patient_history> table alteration has failed');
          return;
      }
      console.log("<patient_history> table has been altered to add column doctor_name");
      res.send("<patient_history> table has been altered to add column doctor_name");
  });
};
  
  // DELETE the table (drop table)
  const DropHistoryTable = (req, res) => {
    let sql = 'DROP TABLE patient_history';
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error deleting <time_slots> table:", err.code, "-", err.message);
        res.status(500).send('<time_slots> table deletion has failed');
        return;
      }
      console.log("<time_slots> table has been deleted");
      res.send("<time_slots> table has been deleted");
    });
  };
  
  // Get Patient History Data
  // GET /getpatienthistorytable
  const getPatientHistoryData = (req, res) => {
    let sql = 'SELECT * FROM patient_history';
    db.query(sql, (err, result) => {
        if (err) {
        console.error("Error fetching <patient_history> info:", err.code, "-", err.message);
        res.status(500).send('Failed to fetch <patient_history> info');
        return;
        }
        console.log("<patient_history> info:", result);
        res.send(result);
    });
  };
  
  // get selected patient
  // GET /getselectedpatienthistory/:patient_id
  const getSelectedPatientHistory = (req, res) => {
    const { patient_id } = req.params;
  
    const sql = 'SELECT * FROM patient_history WHERE patient_id = ?';
    db.query(sql, [patient_id], (err, result) => {
      if (err) {
        console.error(`Error retrieving patient (${patient_id}):`, err);
        res.status(500).send(`Error retrieving patient (${patient_id})`);
        return;
      }
      console.log(`(${patient_id}) patient's history retrieved successfully`);
      res.send(result)
    });
  };
  
  // Add New Patient History
  // POST //addnewpatienthistory
  const addNewPatientHistory = (req, res) => {
    const { patient_id, date, issue, advice, recipe, doctor_id, doctor_name, patient_name } = req.body;
  
    const sql = 'INSERT INTO patient_history (patient_id, date, issue, advice, recipe, doctor_id, doctor_name, patient_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [patient_id, date, issue, advice, recipe, doctor_id, doctor_name, patient_name], (err, result) => {
      if (err) {
        console.error(`Error adding new patient history (${patient_id}, ${date}, ${issue}, ${advice}, ${recipe}, ${doctor_id}):`, err);
        res.status(500).send(`Error adding new patient history (${patient_id}, ${date}, ${issue}, ${advice}, ${recipe}, ${doctor_id})`);
        return;
      }
      console.log(`new patient history (${patient_id}, ${date}, ${issue}, ${advice}, ${recipe}, ${doctor_id}) history added successfully`);
      res.send(`new patient history (${patient_id}, ${date}, ${issue}, ${advice}, ${recipe}, ${doctor_id}) history added successfully`);
    });
  };
  
  // Add Empty Patient History
  // POST /addemptypatienthistory
  const addEmptyPatientHistory = (req, res) => {
    const sql = 'INSERT INTO patient_history (patient_id, date, issue, advice, recipe, doctor_id) VALUES (NULL, NULL, "", "", "", NULL)';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error adding empty patient history:', err);
        res.status(500).send('Failed to add empty patient history');
        return;
      }
      console.log('Empty patient history added successfully');
      res.send('Empty patient history added successfully');
    });
  };
  
  // Delete Patient History
  // DELETE /deletepatienthistory/:id
  const deletePatientHistory = (req, res) => {
    const { id } = req.params;
  
    const sql = 'DELETE FROM patient_history WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(`Error deleting patient history (${id}):`, err);
        res.status(500).send(`Error deleting patient history (${id})`);
        return;
      }
      console.log(`patient history (${id}) deleted successfully`);
      res.send(`patient history (${id}) deleted successfully`);
    });
  };
  
  // Delete Null Patient History
  // DELETE /deletenullpatientshistory
  const deleteNullPatientHistory = (req, res) => {
    const sql = 'DELETE FROM patient_history WHERE patient_id IS NULL';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error deleting null patient history:', err);
        res.status(500).send('Failed to delete null patient history');
        return;
      }
      console.log('Null patient history deleted successfully');
      res.send('Null patient history deleted successfully');
    });
  };
  
  // GET /deletehistorytable
  const deleteHistoryTable = (req, res) => {
    const sql = 'DROP TABLE patient_history';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error deleting patient_history table:', err);
        res.status(500).send('Error deleting patient_history table');
        return;
      }
      console.log('patient_history table deleted successfully');
      res.send('patient_history table deleted successfully');
    });
  }
  

module.exports = { 
    createPatientHistoryTable,
    getPatientHistoryData,
    addNewPatientHistory,
    addEmptyPatientHistory,
    deletePatientHistory,
    deleteNullPatientHistory,
    
    deleteHistoryTable,
    
    
    getSelectedPatientHistory,
    
    
    DropHistoryTable,
    changeDateColumnType,
    alterPatientHistoryTable
 }
