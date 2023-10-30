const { Server } = require("socket.io");
const http = require('http');
const Chat = require('../models/Chat');
let IO;

module.exports.initIO = (app) => {

  const httpServer = http.createServer(app);

  httpServer.listen(9000, () => { console.log('socket server running at 9000') })

  IO = new Server(httpServer);

  IO.use((socket, next) => {
    if (socket.handshake.query) {
      let callerId = socket.handshake.query.callerId;
      socket.roomID = socket.handshake.query.room;
      socket.userProfile = socket.handshake.query.user;
      socket.callerName = socket.handshake.query.name;
      socket.user = callerId;
      next();
    }
  });


  const onlineUsers = new Map();

  IO.on("connection", (socket) => {
    // console.log(socket.roomID, 'socket.roomID');
    console.log("User Connected", socket.user);
    console.log("Connected Room", socket.roomID);


    if(socket.user){
    onlineUsers.set(socket.user, socket.user);
    }

    // console.log('line', onlineUsers)

    // if(socket.user && !onlineUsers.includes(socket.user)){
    //   onlineUsers.push(socket.user)
    // }

     socket.join(socket.user);
     socket.join(socket.roomID);

    // socket.emit('local:user:joined', {user:socket.user})

    socket.on('user:join', ({callerId}) => {

       

        console.log('node joined', callerId)
        let user = socket.user;
        IO.to(callerId).emit('user:joined', {user})
    })

    socket.on('joinroom', (room) => {
      console.log('user room', room)
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });


    // var online = Object.keys(IO.engine.clients)
    // console.log('eee', online)

    socket.once('get-socket-users', () => {
      // Broadcast the updated list of online users to all clients
      IO.emit('onlineUsers', Array.from(onlineUsers.values()));

      
    })





    socket.on('sendMessage', (newMessage) => {

      delete newMessage._id;

      // console.log('before store model', newMessage)
      const storeMessage = new Chat(newMessage);

      storeMessage.save((err) => {
        if (err) {
          console.error('Error saving message:', err);
        } else {

          // console.log('storeMessage', storeMessage)

          // Broadcast the new message to all connected clients
           IO.to(newMessage?.chat_room_id).emit('newMessage', storeMessage);
         // IO.emit('newMessage', storeMessage);
        }
      });


    });

    socket.on('chat message', (data) => {

      console.log('my message', data)

      delete data._id;

      // console.log('my messag delet ide', data)

      // Save the message to MongoDB or any other storage
      const newMessage = new Chat(data);

      newMessage.save((err) => {
        if (err) {
          console.error('Error saving message:', err);
        } else {

          // console.log('store message', newMessage)
          // Broadcast the message to all users in the room
           IO.to(data?.chat_room_id).emit('chat message', newMessage);
          //IO.emit('chat message', newMessage);
        }
      });


    });



    socket.on("call", (payload) => {
      // console.log('socker call other', payload)
      let calleeId = payload.calleeId;
      let rtcMessage = payload.rtcMessage;
      let caller = payload.caller;
      let roomID = payload.roomID;
      let mediaType = payload.mediaType;

      console.log('node call return', calleeId)


      socket.to(calleeId).emit("newCall", {
        callerId: socket.user,
        caller: caller,
        roomID:roomID,
        mediaType:mediaType,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("answerCall", (data) => {
      let callerId = data.callerId;
      rtcMessage = data.rtcMessage;
      // console.log('anser caller id', callerId)
      // console.log('anser caller rtcMessage', rtcMessage)

      socket.to(callerId).emit("callAnswered", {
        callee: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("ICEcandidate", (data) => {
      // console.log("ICEcandidate data.calleeId", data);
      // console.log("ICEcandidate socket.user", socket.user);
      let calleeId = data.calleeId;
      let rtcMessage = data.rtcMessage;

      socket.to(calleeId).emit("ICEcandidate", {
        sender: socket.user,
        rtcMessage: rtcMessage,
      });
    });



    socket.on("peer:nego:needed", ({calleeId, rtcMessage}) => {
      console.log('peer:nego:needed', rtcMessage)
      IO.to(calleeId).emit("peer:nego:needed", {from: socket.user, offer:rtcMessage})
    })

    socket.on("peer:nego:done", ({to, ans}) => {
      console.log('peer:nego:done', ans)
        IO.to(to).emit("peer:nego:final", {from: socket.user, ans})
    })



    socket.on("call:end", (payload) => {

      console.log('node call end', payload)
      let calleeId = payload.calleeId;


      IO.to(calleeId).emit("call:ended", {callerId: socket.user});

    });

    // socket.on("peer:close", ({to}) => {
    //     IO.to(to).emit("peer:closed", {from: socket.id})
    // })

    // socket.join(1)
    socket.on('offerVideoCall', (data) => {
        const { offerDescription, chatRoomId } = data
        socket.to(chatRoomId).emit('offerVideoCall', {
            offerDescription,
        })
    })

    socket.on('answerOfferVideoCall', (data) => {
        const { answerDescription, chatRoomId } = data
        socket.to(chatRoomId).emit('answerOfferVideoCall', answerDescription)
    })

    socket.on('iceCandidate', (data) => {
        const { iceCandidate, chatRoomId } = data
        socket.to(chatRoomId).emit('iceCandidate', iceCandidate)
    })


    socket.on("join_room", (socketId) => {
      console.log('user join', socketId)
     socket.join(socketId)
       IO.to(socketId).emit("new_joined_room", {user: socket.id, room: 1})
    })

    socket.on("call_user", ({offer, user}) => {
        IO.to(user).emit("incoming_call", {from: socket.id, offer})
    })

    socket.on("call_accepted", ({to, answer}) => {
        IO.to(to).emit("call_accepted", {from: socket.id, answer})
    })

    // socket.on("call_accepted", ({from, answer}) => {
    //     IO.to(from).emit("peer:nego:final", {from: socket.id, answer})
    // })


    socket.on('join', (roomID, callback) => {
      console.log('join', roomID);
  
      let socketIds = socketIdsInRoom(roomID);
      console.log(socketIds);
  
      callback(socketIds);
      socket.join(roomID);
      socket.room = roomID;
    });
  
    socket.on('exchange', data => {
      console.log('exchange', data.to);
  
      data.from = socket.id;
      let to = IO.sockets.connected[data.to];
      to.emit('exchange', data);
    });
  
    socket.on('disconnect', () => {
      console.log('disconnect');

      
  
      if (socket.roomID) {
        let room = socket.roomID;
        IO.to(room).emit('leave', socket.id);
        socket.leave(room);
  
        console.log('leave');
      }

      onlineUsers.delete(socket.user);

      // Broadcast the updated list of online users to all clients
      IO.emit('onlineUsers', Array.from(onlineUsers.values()));

    });



  });
};

/* ==============================
 Socket Functions
 ================================ */
 function socketIdsInRoom(roomID) {
  let socketIds = IO.adapter.rooms[roomID];
  if (socketIds) {
    let collection = [];
    for (let key in socketIds) {
      collection.push(key);
    }
    return collection;
  } else {
    return [];
  }
}

module.exports.getIO = () => {
  if (!IO) {
    throw Error("IO not initilized.");
  } else {
    return IO;
  }
};

