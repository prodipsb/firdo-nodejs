const express  = require('express') 
const http = require('http');
const {Server}  = require('socket.io');

const app = express();



const cors = require('cors')

const PORT =process.env.PORT || 5000;
const {mogoUrl} = require('./keys')

const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use('/assets', express.static('assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cors());

mongoose.set('useFindAndModify', false);

// ==== socket service ====
// require('./utils/sockerService');
// ==== socket service ====


// ==== models ====
require('./models/User');
require('./models/Item');
require('./models/UserItem')
require('./models/Inspiration')
require('./models/CalendarEvent')
require('./models/ItemType')
require('./models/Packing')
require('./models/Color')
require('./models/Chat')
require('./models/MyLook')
require('./models/ShareLook')
require('./models/Comment')
require('./models/Category')

// ==== models ====




// ==== routes ====
const requireToken = require('./middleware/requireToken')
const authRoutes = require('./routes/authRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const itemRoutes = require('./routes/itemRoutes')
const chatRoutes = require('./routes/chatRoutes');
const PostRoute = require('./routes/PostRoute');
const GlobalRoutes = require('./routes/GlobalRoutes');
const Chat = require('./models/Chat');
// ==== routes ====

app.use(cors());
app.use('/', authRoutes);
app.use('/api/v1', uploadRoutes);
app.use('/api/v1', itemRoutes);
app.use('/api/v1', chatRoutes);
app.use('/api/v1', GlobalRoutes);
app.use('/api/v1', PostRoute);



mongoose.set("useCreateIndex", true);
mongoose.connect(mogoUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected',()=>{
    console.log("connected to mongo!")
})

mongoose.connection.on('error',(err)=>{
    console.log("this is error",err)
})


// app.get('/',requireToken,(req,res)=>{
//     res.send({email:req.user.email})
// })


// ...

// const server = http.createServer(app);
// const io = new Server(server);

// io.on('connection', (socket) => {
//     console.log('A user connected');

    // socket.on("call", (data) => {
    //   console.log('call data', data)
    //   let calleeId = data.calleeId;
    //   console.log('callee ID', calleeId)
    //   let rtcMessage = data.rtcMessage;

    //   console.log('callee message', rtcMessage)

    //   socket.to(calleeId).emit("newCall", {
    //     callerId: socket.user,
    //     rtcMessage: rtcMessage,
    //   });
    // });
  
    // socket.on('joinroom', (room) => {
    //   socket.join(room);
    //   console.log(`User joined room: ${room}`);
    // });


    
  
   

    // socket.on('sendMessage', (newMessage) => {

    //   delete newMessage._id;

    //   console.log('before store model', newMessage)
    //   const storeMessage = new Chat(newMessage);

    //   storeMessage.save((err) => {
    //     if (err) {
    //       console.error('Error saving message:', err);
    //     } else {

    //       console.log('storeMessage', storeMessage)

    //        // Broadcast the new message to all connected clients
    //         io.to(newMessage?.chat_room_id).emit('newMessage', storeMessage);
    //     }
    //   });

      
    //   });
  
    // socket.on('chat message', (data) => {

    //     console.log('my message', data)

    //     delete data._id;

    //     console.log('my messag delet ide', data)
      
    //   // Save the message to MongoDB or any other storage
    //   const newMessage = new Chat(data);
  
    //   newMessage.save((err) => {
    //     if (err) {
    //       console.error('Error saving message:', err);
    //     } else {

    //         console.log('store message', newMessage)
    //       // Broadcast the message to all users in the room
    //       io.to(data?.chat_room_id).emit('chat message', newMessage);
    //     }
    //   });

      
    // });

    // socket.join(socket.user);

    // socket.on("call", (data) => {
    //   let calleeId = data.calleeId;
    //   console.log('callee ID', calleeId)
    //   let rtcMessage = data.rtcMessage;

    //   console.log('callee message', rtcMessage)

    //   socket.to(calleeId).emit("newCall", {
    //     callerId: socket.user,
    //     rtcMessage: rtcMessage,
    //   });
    // });
    
    // socket.on("answerCall", (data) => {
    //   console.log('click answer', data)
    //   let callerId = data.callerId;
    //   rtcMessage = data.rtcMessage;

    //   socket.to(callerId).emit("callAnswered", {
    //     callee: socket.user,
    //     rtcMessage: rtcMessage,
    //   });
    // });
    
    // socket.on("ICEcandidate", (data) => {
    //   console.log("ICEcandidate data.calleeId", data.calleeId);
    //   let calleeId = data.calleeId;
    //   let rtcMessage = data.rtcMessage;

    //   socket.to(calleeId).emit("ICEcandidate", {
    //     sender: socket.user,
    //     rtcMessage: rtcMessage,
    //   });
    // });



  //   socket.on('disconnect', () => {
  //     console.log('User disconnected');
  //   });

  // });
  
  

  


app.listen(PORT,()=>{
    console.log("server running "+PORT)
})

// server.listen(9000, () => {console.log('socket server running at 9000') })


const { getIO, initIO } = require('./utils/socket');

// const httpServer = http.createServer(app);

// initIO(server);
initIO(app);

getIO();

