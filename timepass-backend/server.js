const http = require("http");
const cors = require("cors");
const express = require("express");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(
  cors({
    origin: "*",
  })
);

require("./sockets/groupcall1.socket")(io);

server.listen(8080, () => {
  console.log("Server listening on port 8080");
});
