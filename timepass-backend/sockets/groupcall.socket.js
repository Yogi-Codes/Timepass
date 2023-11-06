const activeConnections = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (room) => {
      socket.join(room);
      activeConnections[socket.id] = room;
    });

    socket.on("offer", (offer) => {
      const room = activeConnections[socket.id];
      socket.to(room).emit("offer", offer);
    });

    socket.on("answer", (answer) => {
      const room = activeConnections[socket.id];
      socket.to(room).emit("answer", answer);
    });

    socket.on("ice-candidate", (candidate) => {
      const room = activeConnections[socket.id];
      socket.to(room).emit("ice-candidate", candidate);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      const room = activeConnections[socket.id];
      socket.to(room).emit("user-disconnected", socket.id);
      delete activeConnections[socket.id];
    });
  });
};
