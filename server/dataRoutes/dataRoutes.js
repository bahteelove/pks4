const express = require("express");
const router = express.Router();

const { createDB, deleteHistoryTable } = require("../controllers/dataController")

const {
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
} = require("../controllers/praktika")

// ---------------------------------------------------------------------

router.route('/createdatabase').get(createDB)

// ---------------------------------------------------------------------

router.route('/createuserstable').get(createUserTable);

router.route('/addnewuser').post(addNewUser);

router.route('/deleteuser/:login').delete(deleteUser);

// ---------------------------------------------------------

router.route('/getuserstable').get(getUsersData);

router.route('/getselecteduser/:login').get(getSelectedUser);

// ---------------------------------------------------------------------

// GET /createmessagestable
router.route('/createmessagestable').get(createMessagesTable);

// POST /addnewmessage
router.route('/addnewmessage').post(addNewMessage);

// GET /addnewmessageto
router.route('/addnewmessageto').get(addNewMessageTo);

// DELETE /deletemessage/:message_id
router.route('/deletemessage/:message_id').delete(deleteMessage);

// ---------------------------------------------------------

// GET /getselectedmessage/:message_id
router.route('/getselectedmessage/:message_id').get(getSelectedMessage);

// GET /getmessagestable
router.route('/getmessagestable').get(getMessagesData);

// GET /updatemessagestatus/:id
router.route('/updatemessagestatus/:id').get(updateMessageStatus);

module.exports = router;