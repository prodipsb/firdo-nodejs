const { Server } = require("socket.io");
const http = require('http');
const Chat = require('../models/Chat');
let IO;

module.exports.initIO = (app) => {

  const httpServer = http.createServer(app);

  httpServer.listen(9000, () => { console.log('socket server running at 9000') })

  // console.log('aaaa', httpServer)
  IO = new Server(httpServer);

  IO.use((socket, next) => {
    if (socket.handshake.query) {
      let callerId = socket.handshake.query.callerId;
      socket.user = callerId;
      next();
    }
  });

  IO.on("connection", (socket) => {
    console.log(socket.user, "Connected");
    
    socket.join(socket.user);


    socket.on('joinroom', (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });






    socket.on('sendMessage', (newMessage) => {

      delete newMessage._id;

      console.log('before store model', newMessage)
      const storeMessage = new Chat(newMessage);

      storeMessage.save((err) => {
        if (err) {
          console.error('Error saving message:', err);
        } else {

          console.log('storeMessage', storeMessage)

          // Broadcast the new message to all connected clients
          IO.to(newMessage?.chat_room_id).emit('newMessage', storeMessage);
        }
      });


    });

    socket.on('chat message', (data) => {

      console.log('my message', data)

      delete data._id;

      console.log('my messag delet ide', data)

      // Save the message to MongoDB or any other storage
      const newMessage = new Chat(data);

      newMessage.save((err) => {
        if (err) {
          console.error('Error saving message:', err);
        } else {

          console.log('store message', newMessage)
          // Broadcast the message to all users in the room
          IO.to(data?.chat_room_id).emit('chat message', newMessage);
        }
      });


    });



    socket.on("call", (data) => {
      console.log('socker call other', data)
      let calleeId = data.calleeId;
      let rtcMessage = data.rtcMessage;

      socket.to(calleeId).emit("newCall", {
        callerId: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("answerCall", (data) => {
      let callerId = data.callerId;
      rtcMessage = data.rtcMessage;
      console.log('anser caller id', callerId)
      console.log('anser caller rtcMessage', rtcMessage)

      socket.to(callerId).emit("callAnswered", {
        callee: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("ICEcandidate", (data) => {
      console.log("ICEcandidate data.calleeId", data.calleeId);
      let calleeId = data.calleeId;
      let rtcMessage = data.rtcMessage;

      socket.to(calleeId).emit("ICEcandidate", {
        sender: socket.user,
        rtcMessage: rtcMessage,
      });
    });
  });
};

module.exports.getIO = () => {
  if (!IO) {
    throw Error("IO not initilized.");
  } else {
    return IO;
  }
};

