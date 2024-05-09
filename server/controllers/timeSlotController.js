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
    console.log("MySQL [timeSlotController] is connected");
});

// -------------------------------------------------------------------------------

// Create Time Slots Table
// GET /createtimeslotstable
const createTimeSlotsTable = (req, res) => {
    let sql = `
      CREATE TABLE time_slots (
        id INT AUTO_INCREMENT,
        doctor_id INT,
        doctor_name VARCHAR(255),
        patient_id INT,
        patient_name VARCHAR(255),
        time VARCHAR(20),
        status ENUM("taken", "not taken", "done"),
        status_time VARCHAR(255),
        PRIMARY KEY (id)
      )`;
    
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error creating <time_slots> table:", err.code, "-", err.message);
        res.status(500).send('<time_slots> table creation has failed');
        return;
      }
      console.log("<time_slots> table has been created:", result);
      res.send("<time_slots> table has been created");
    });
  };

// DELETE the table (drop table)
const DropTimeSlotsTable = (req, res) => {
    let sql = 'DROP TABLE time_slots';
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
  
  // Get Time Slots Data
  // GET /gettimeslotstable
  const getTimeSlotsData = (req, res) => {
    let sql = 'SELECT * FROM time_slots';
    db.query(sql, (err, result) => {
        if (err) {
        console.error("Error fetching <time_slots> info:", err.code, "-", err.message);
        res.status(500).send('Failed to fetch <time_slots> info');
        return;
        }
        console.log("<time_slots> info:", result);
        res.send(result);
    });
  };
  
  // to get timeSlots for a selected doctor
  // GET /gettimeslotsforselecteddoctor/:doctor_id
  const getTimeSlotsForSelectedDoctor = (req, res) => {
    const { doctor_id } = req.params;
  
    const sql = 'SELECT * FROM time_slots WHERE doctor_id = ?';
    db.query(sql, [doctor_id], (err, result) => {
      if (err) {
        console.error(`Error fetching time slots for doctor (${doctor_id}):`, err.code, "-", err.message);
        res.status(500).send(`Failed to fetch time slots for doctor (${doctor_id})`);
        return;
      }
      if (result.length === 0) {
        console.log(`No time slots found for doctor with ID ${doctor_id}`);
        res.status(404).send(`No time slots found for doctor with ID ${doctor_id}`);
        return;
      }
      res.status(200).json(result);
    });
  };
  
  // to get timeSlots by DateTime
  // GET /gettimeslotbydatetime/
  const getTimeSlotByDateTime = (req, res) => {
    const { time } = req.body
  
    const sql = 'SELECT * FROM time_slots WHERE time = ?';
    db.query(sql, [time], (err, result) => {
      if (err) {
        console.error(`Error fetching time slots by DateTime (${time}):`, err.code, "-", err.message);
        res.status(500).send(`Failed to fetch time slots by DateTime (${time})`);
        return;
      }
      if (result.length === 0) {
        console.log(`No time slots found by DateTime ${time}`);
        res.status(404).send(`No time slots found by DateTime ${time}`);
        return;
      }
      res.status(200).json(result);
    });
  };
  
  // to get timeSlots by id
  // GET /gettimeslotbyid/:id
  const getTimeSlotsByID = (req, res) => {
    const { id } = req.params;
  
    const sql = 'SELECT * FROM time_slots WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(`Error fetching time slot by id (${id}):`, err.code, "-", err.message);
        res.status(500).send(`Error fetching time slot by id (${id})`);
        return;
      }
      if (result.length === 0) {
        console.log(`No time slots found by ID ${id}`);
        res.status(404).send(`No time slots found by ID ${id}`);
        return;
      }
      res.status(200).json(result);
    });
  };
  
  // to chnage the status
  // GET /changestatustaken/:id
  const changeStatusTaken = (req, res) => {
    const { id } = req.params;
    const { patient_id, patient_name } = req.body; // Assuming patientId is passed in the request body
  
    // Construct the SQL query to update the status and patient ID of the time slot
    let sql = 'UPDATE time_slots SET status = "taken", patient_id = ?, patient_name = ? WHERE id = ?';
    
    // Execute the query with the provided slotId
    db.query(sql, [patient_id, patient_name, id], (err, result) => {
      if (err) {
        console.error("Error updating time slot status:", err.code, "-", err.message);
        res.status(500).send('Failed to update time slot status');
        return;
      }
      // Check if any row was affected by the update
      if (result.affectedRows === 0) {
        res.status(404).send('Time slot not found');
        return;
      }
      console.log("Time slot status updated successfully");
      res.send("Time slot status updated successfully");
    });
  };
  
  // to change status and status_time
  // POST /changeslotstatus/:id
  const changeStatus = (req, res) => {
    const { id } = req.params;
    const { patient_id, patient_name, status, status_time } = req.body
  
    // Construct the SQL query to update the status and patient ID of the time slot
    let sql = `UPDATE time_slots SET patient_id = ?, patient_name = ?, status = ?, status_time = ? WHERE id = ?`;
    
    // Execute the query with the provided slotId
    db.query(sql, [patient_id, patient_name, status, status_time, id], (err, result) => {
      if (err) {
        console.error("Error updating time slot status&status_time):", err.code, "-", err.message);
        res.status(500).send('Failed to update time slot status&status_time');
        return;
      }
      // Check if any row was affected by the update
      if (result.affectedRows === 0) {
        res.status(404).send('Time slot not found');
        return;
      }
      console.log("Time slot status updated successfully");
      res.send("Time slot status updated successfully");
    });
  }; 
  
  // GET /changestatusnottaken/:id
  const changeStatusNotTaken = (req, res) => {
    const { id } = req.params;
  
    // Construct the SQL query to update the status and patient ID of the time slot
    let sql = `UPDATE time_slots SET status = "not taken", status_time = '', patient_id = 0, patient_name = '' WHERE id = ?`;
    
    // Execute the query with the provided slotId
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error updating time slot status:", err.code, "-", err.message);
        res.status(500).send('Failed to update time slot status');
        return;
      }
      // Check if any row was affected by the update
      if (result.affectedRows === 0) {
        res.status(404).send('Time slot not found');
        return;
      }
      console.log("Time slot status updated successfully");
      res.send("Time slot status updated successfully");
    });
  }; 
  
  // Add Time Slot
  // POST /addnewtimeslot
  const addTimeSlot = (req, res) => {
    const { doctor_id, doctor_name, patient_id, patient_name, time, status, status_time } = req.body;
    //const doctor_id = 2;
    //const time = "9:00 AM";
    //const status = "taken";
    //const patient_id = 1;
  
    const sql = 'INSERT INTO time_slots (doctor_id, doctor_name, patient_id, patient_name, time, status, status_time) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [doctor_id, doctor_name, patient_id, patient_name, time, status, status_time], (err, result) => {
      if (err) {
        console.error(`Error adding time slot (${doctor_id}, ${time}, ${status}, ${patient_id}):`, err);
        res.status(500).send(`Error adding time slot (${doctor_id}, ${time}, ${status}, ${patient_id}):`);
        return;
      }
      console.log(`time slot (${doctor_id}, ${time}, ${status}, ${patient_id}) added successfully`);
      res.send(`time slot (${doctor_id}, ${time}, ${status}, ${patient_id}) added successfully`);
    });
  };
  
  // Delete Time Slot
  // DELETE /deletetimeslots/:id
  const deleteTimeSlot = (req, res) => {
    const { id } = req.params;
  
    const sql = 'DELETE FROM time_slots WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(`Error deleting time slot (${id}):`, err);
        res.status(500).send(`Error deleting time slot (${id})`);
        return;
      }
      console.log(`time slot (${id}) deleted successfully`);
      res.send(`time slot (${id}) deleted successfully`);
    });
  };
  
  // Delete Null Time Slots
  // DELETE /deletenulltimeslots
  const deleteNullTimeSlots = (req, res) => {
    const sql = 'DELETE FROM time_slots WHERE patient_id IS NULL';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error deleting null time slots:', err);
        res.status(500).send('Failed to delete null time slots');
        return;
      }
      console.log('Null time slots deleted successfully');
      res.send('Null time slots deleted successfully');
    });
  };
  
  // Delete Time Slots
  // GET /deletetimeslotstable
  const deleteTimeSlotsTable = (req, res) => {
    const sql = 'DROP TABLE time_slots';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error deleting time_slots table:', err);
        res.status(500).send('Error deleting time_slots table');
        return;
      }
      console.log('time_slots table deleted successfully');
      res.send('time_slots table deleted successfully');
    });
  }
  

module.exports = { 
    createTimeSlotsTable,
    getTimeSlotsData,
    addTimeSlot,
    deleteTimeSlot,
    deleteNullTimeSlots,
    deleteTimeSlotsTable,
    changeStatusTaken,
    changeStatusNotTaken,
    getTimeSlotsForSelectedDoctor,
    DropTimeSlotsTable,
    getTimeSlotsByID,
    changeStatus,
    getTimeSlotByDateTime
 }
