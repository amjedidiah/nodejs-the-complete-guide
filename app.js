// Module imports
const http = require("http");
const routes = require("./routes");

// Server from HTTP module
const server = http.createServer(routes);

// ! Task 1: Spin a Node.js-driven server on Port 3000
server.listen(3000, null, null, () =>
  console.log(`Server active on port: 3000`)
);
