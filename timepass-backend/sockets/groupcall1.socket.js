// const redisAdapter = require("socket.io-redis");

const admin = require("firebase-admin");
const serviceAccount = require("./../credentials/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

module.exports = (io, server) => {
  // FIXME: ENOTFOUND error
  // io.adapter(
  //     redisAdapter({
  //         host: "http://redis-13501.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  //         port: 13501,
  //         password: "Xi05bA2oi1oh8KkWgR4ZlVc2cigjVKEg",
  //     })
  // );

  io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);

    socket.on("JOIN_HOST", () => { });

    socket.on("JOIN_ROOM", async ({ roomId, userId, userData }) => {
      const maxRoomSize = 15;
      const roomDoc = db.collection("rooms").doc(roomId);
      try {
        let roomData = (await roomDoc.get()).data();
        if (roomData.host === userId) {
          console.log('HOSSSSSSSSSSSSSSTTTTTTTTTTTTTTTTTTTTTTTTTTTT', roomData);
          socket.join(roomId);
          await roomDoc.update({ members: { [userId]: socket.id } });
          await roomDoc.collection("onstage").doc(userId).set({
            socketId: socket.id,
            name: userData.name,
            type: "influencer",
          });

          socket.to(roomId).emit("HOST_JOINED", {
            socketId: socket.id,
            userId: userId,
            userData: userData
          });
        } else if (Object.keys(roomData.members).length < maxRoomSize) {
          await roomDoc.update({ [`members.${userId}`]: socket.id });
          socket.to(roomId).emit("NEW_USER", {
            userId: userId,
            socketId: socket.id,
            userData: userData
          });
          socket.join(roomId);
        } else {
          socket.emit("ROOM_FULL");
          console.error("room full");
        }
      } catch (error) {
        console.error("Error joining room: ", error);
      }
    });

    socket.on("LEAVE_ROOM", (roomId, userId) => {
      const membersRef = db.collection("rooms").doc(roomId);
      membersRef
        .update({ [`members.${userId}`]: admin.firestore.FieldValue.delete() })
        .then(() => {
          console.log("User removed from the room's members.");
        })
        .catch((error) => {
          console.error("Error removing user from the room:", error);
        });
    });

    socket.on("JOIN_WAITLIST", async ({ roomId, userId, userData }) => {
      await db
        .collection("rooms")
        .doc(roomId)
        .get()
        .then(async (doc) => {
          const socketId = doc.data().members[userId];
          const waitlistRef = db
            .collection("rooms")
            .doc(roomId)
            .collection("waitlist");
          await waitlistRef
            .doc(userId)
            .set({
              socketId: socketId,
              ...userData,
            })
            .then(() => {
              console.log("User added to waitlist.");
            })
            .catch((error) => {
              console.error("Error joining waitlist: ", error);
            });
        });
    });

    ////////////////////////////////
    socket.on("LEAVE_WAITLIST", ({ roomId, userId }) => {
      const waitlistRef = db
        .collection("rooms")
        .doc(roomId)
        .collection("waitlist");
      waitlistRef
        .doc(userId)
        .delete()
        .then(() => {
          console.log("User removed from waitlist.");
        })
        .catch((error) => {
          console.error("Error removing user from waitlist: ", error);
        });
    });

    ////////////////////////////////
    socket.on("RMV_FRM_STAGE", ({ roomId, userId }) => {
      const onstageRef = db
        .collection("rooms")
        .doc(roomId)
        .collection("onstage");
      onstageRef
        .doc(userId)
        .delete()
        .then(() => {
          socket.to(roomId).emit({
            socketId: socket.id
          });
          console.log("User removed from stage.");
        })
        .catch((error) => {
          console.error("Error removing user from stage: ", error);
        });
    });

    socket.on("ADD_TO_STAGE", async ({ roomId, userId, socketId }) => {
      const maxStageSize = 3;
      const onStageRef = db
        .collection("rooms")
        .doc(roomId)
        .collection("onstage");
      const querySnapshot = await onStageRef.get();
      if (querySnapshot.size < maxStageSize) {
        const userQuery = await db.collection("users").doc(userId).get();
        const userData = userQuery.data();
        onStageRef
          .doc(userId)
          .set({
            socketId: socketId,
            name: userData.name,
            type: userData.gender.toLowerCase(),
          })
          .then(() => {
            console.log("User added to the stage.");
            const waitlistRef = db
              .collection("rooms")
              .doc(roomId)
              .collection("waitlist");
            waitlistRef
              .doc(userId)
              .delete()
              .then(() => {
                socket.to(roomId).emit('NEW_STG_PRTCPNT', {
                  socketId: socketId,
                  userId: userId,
                  userData: userData
                });
                console.log("User removed from waitlist.");
              })
              .catch((error) => {
                console.error("Error removing user from waitlist: ", error);
              });
          })
          .catch((error) => {
            console.error("Error adding user to the stage: ", error);
          });
      } else {
        console.error("Max stage size reached.");
      }
    });

    ////////////////////////////////
    socket.on("SEND_SIG", ({ signal, receiverSocketId }) => {
      console.log(
        "SENDING SEND SIGNAL FROM" +
        socket.id +
        " TO " +
        receiverSocketId +
        "▶️▶️▶️▶️"
      );
      io.to(receiverSocketId).emit("R_SEND_SIG", {
        signal: signal,
        senderSocketId: socket.id,
      });
    });

    ////////////////////////////////
    socket.on("RTRN_SIG", ({ senderSocketId, signal }) => {
      console.log(
        "SENDING RECEIVE SIGNAL FROM" +
        socket.id +
        " TO " +
        senderSocketId +
        "▶️▶️▶️▶️"
      );
      io.to(senderSocketId).emit("R_RTRN_SIG", {
        signal: signal,
        receiverSocketId: socket.id,
      });
    });

    ////////////////////////////////
    socket.on("ICE_CANDIDATE", ({ receiverSocketId, candidate }) => {
      console.log(
        "SENDING ICE CANDIDATE FROM " +
        socket.id +
        " TO " +
        receiverSocketId +
        "❄️❄️❄️❄️"
      );
      socket.to(receiverSocketId).emit("R_ICE_CANDIDATE", {
        senderSocketId: socket.id,
        candidate: candidate,
      });
    });
  });
};
