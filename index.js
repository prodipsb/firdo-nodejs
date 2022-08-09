const express  = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
// const cors = require('cors');

const app = express()
const PORT =process.env.PORT || 5000;
const {mogoUrl} = require('./keys')

app.use('/assets', express.static('assets'));


// app.use(express.static('public'));

// app.use(cors());

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", '*');
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,x-auth,Accept,content-type,application/json');
//     next();
// });


require('./models/User');

const requireToken = require('./middleware/requireToken')
const authRoutes = require('./routes/authRoutes')
//app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
//  app.use(bodyParser({ extended: true }));

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(authRoutes)


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