const express  = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
// const cors = require('cors');

const app = express()
const PORT =process.env.PORT || 5000;
const {mogoUrl} = require('./keys')

app.use('/assets', express.static('assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cors());

mongoose.set('useFindAndModify', false);

require('./models/User');
require('./models/Item');
require('./models/UserItem')
require('./models/Inspiration')
require('./models/CalendarEvent')
require('./models/ItemType')
require('./models/Packing')
require('./models/Color')

const cors = require('cors')



const requireToken = require('./middleware/requireToken')
const authRoutes = require('./routes/authRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const itemRoutes = require('./routes/itemRoutes')
const chatRoutes = require('./routes/chatRoutes')

app.use(cors());
app.use('/', authRoutes);
app.use('/api/v1', uploadRoutes);
app.use('/api/v1', itemRoutes);
app.use('/api/v1', chatRoutes);



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

app.listen(PORT,()=>{
    console.log("server running "+PORT)
})