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
    console.log("MySQL [praktika] is connected");
});

// GET /createuserstable
const createUserTable = (req, res) => {
    let sql = 'CREATE TABLE users (user_id INT AUTO_INCREMENT, login VARCHAR(255), password VARCHAR(255), user_name VARCHAR(255), PRIMARY KEY (user_id))';
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error creating <users> table:", err.code, "-", err.message);
        res.status(500).send('<users> table creation has failed');
        return;
      }
      console.log("<users> table has been created:", result);
      res.send("<users> table has been created");
    });
};

// POST /addnewuser
const addNewUser = (req, res) => {
    const { login, password, user_name } = req.body;

    // Insert form data into MySQL database
    const sql = 'INSERT INTO users (login, password, user_name) VALUES (?, ?, ?)';
    db.query(sql, [login, password, user_name], (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).send('Failed to submit form');
            return;
        }
        console.log('Form data inserted into MySQL');
        res.send('Form submitted successfully');
    });

};

// DELETE /deleteuser/:login
const deleteUser = (req, res) => {
    const { login } = req.params;
    let sql = 'DELETE FROM users WHERE login = ?';
    db.query(sql, [login], (err, result) => {
        if (err) {
            console.error(`Error deleting user (ID: ${login}):`, err.code, "-", err.message);
            res.status(500).send('Failed to delete user');
            return;
        }
        console.log("User deleted successfully");
        res.send(`User (ID: ${user_id}) deleted successfully`);
    });
};

// GET /getselecteduser/:login
const getSelectedUser = (req, res) => {
    const { login } = req.params;

    const sql = 'SELECT * FROM users WHERE login = ?';
    db.query(sql, [login], (err, result) => {
        if (err) {
            console.error(`Error fetching user (ID: ${login}) info:`, err.code, "-", err.message);
            res.status(500).send(`Failed to fetch user (ID: ${login}) info`);
            return;
        }
        if (result.length === 0) {
            console.log(`User with ID ${login} not found`);
            res.status(404).send(`User with ID ${login} not found`);
            return;
        }
        console.log(`User (ID: ${login}) info:`, result[0]);
        res.status(200).json(result[0]); // Return only the first row (assuming login is unique)
    });
};

// GET /getuserstable
const getUsersData = (req, res) => {
    let sql = 'SELECT * FROM users';
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching users info:", err.code, "-", err.message);
            res.status(500).send('Failed to fetch users info');
            return;
        }
        console.log("Users info:", result);
        res.send(result);
    });
};

// --------------------------------------

// GET /createmessagestable
const createMessagesTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS Messages (
                  id INT PRIMARY KEY AUTO_INCREMENT,
                  from_user VARCHAR(255) NOT NULL,
                  to_user VARCHAR(255) NOT NULL,
                  message_title VARCHAR(255) NOT NULL,
                  message_text TEXT NOT NULL,
                  send_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  status ENUM('new', 'read') DEFAULT 'new'
                )`;
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error creating Messages table:', err);
        return;
      }
      console.log('Messages table created successfully');
    });
  };  

// POST /addnewmessage
const addNewMessage = (req, res) => {
    const { from_user, to_user, message_title, message_text } = req.body;

    // Insert message data into MySQL database
    const sql = 'INSERT INTO Messages (from_user, to_user, message_title, message_text) VALUES (?, ?, ?, ?)';
    db.query(sql, [from_user, to_user, message_title, message_text], (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).send('Failed to submit message');
            return;
        }
        console.log('Message inserted into MySQL');
        res.send('Message submitted successfully');
    });

};

// GET /addnewmessage
const addNewMessageTo = (req, res) => {
    const from_user = "";
    const to_user = "hello3";
    const message_title = "test3";
    const message_text = "test3";

    // Insert message data into MySQL database
    const sql = 'INSERT INTO Messages (from_user, to_user, message_title, message_text) VALUES (?, ?, ?, ?)';
    db.query(sql, [from_user, to_user, message_title, message_text], (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).send('Failed to submit message');
            return;
        }
        console.log('Message inserted into MySQL');
        res.send('Message submitted successfully');
    });

};

// DELETE /deletemessage/:message_id
const deleteMessage = (req, res) => {
    const message_id = req.params.message_id;
    let sql = 'DELETE FROM Messages WHERE id = ?';
    db.query(sql, [message_id], (err, result) => {
        if (err) {
            console.error(`Error deleting message (ID: ${message_id}):`, err.code, "-", err.message);
            res.status(500).send('Failed to delete message');
            return;
        }
        console.log("Message deleted successfully");
        res.send(`Message (ID: ${message_id}) deleted successfully`);
    });
};

// GET /getselectedmessage/:message_id
const getSelectedMessage = (req, res) => {
    const { message_id } = req.params;

    const sql = 'SELECT * FROM Messages WHERE id = ?';
    db.query(sql, [message_id], (err, result) => {
        if (err) {
            console.error(`Error fetching message (ID: ${message_id}) info:`, err.code, "-", err.message);
            res.status(500).send(`Failed to fetch message (ID: ${message_id}) info`);
            return;
        }
        if (result.length === 0) {
            console.log(`Message with ID ${message_id} not found`);
            res.status(404).send(`Message with ID ${message_id} not found`);
            return;
        }
        console.log(`Message (ID: ${message_id}) info:`, result[0]);
        res.status(200).json(result[0]); // Return only the first row (assuming message_id is unique)
    });
};

// GET /getmessagestable
const getMessagesData = (req, res) => {
    let sql = 'SELECT * FROM Messages';
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching messages info:", err.code, "-", err.message);
            res.status(500).send('Failed to fetch messages info');
            return;
        }
        console.log("Messages info:", result);
        res.send(result);
    });
};

// GET /updatemessagestatus/:id
const updateMessageStatus = (req, res) => {
    const { id } = req.params;
  
    const sql = `UPDATE Messages SET status = "read" WHERE id = ?`;
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error updating message status:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Message not found' });
        return;
      }
  
      res.status(200).json({ message: 'Message status updated successfully' });
    });
  };
  



module.exports = {
    createUserTable,
    addNewUser,
    deleteUser,

    getSelectedUser,
    getUsersData,

    
    createMessagesTable,
    addNewMessage,
    deleteMessage,
    getSelectedMessage,
    getMessagesData,


    addNewMessageTo,
    updateMessageStatus
}