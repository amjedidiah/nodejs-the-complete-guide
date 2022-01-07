// Module imports
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path")

// Route imports
const routes = require("./routes")

// Util imports
const rootDIR = require("./util/path.util")

// App
const app = express();

// Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(rootDIR, "public")))

// Routes definition
app.use(routes)

// Set listen PORT
app.listen(3000, () => console.log(`Server active on port: 3000`));
