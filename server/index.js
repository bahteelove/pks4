const express = require( "express");
const bodyParser = require('body-parser');
const cors = require ("cors")

const port = 3080

const app = express();
app.use(express.json())
app.use(cors())

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

app.use("/", require("./dataRoutes/dataRoutes"));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});