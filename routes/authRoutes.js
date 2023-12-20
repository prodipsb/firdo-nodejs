const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} = require('../keys')
const router = express.Router();
const User = mongoose.model('User');

// import fsExtra from 'fs-extra'
const fsExtra = require('fs-extra');


var path = require("path");
var multer  = require('multer');


const fs = require("fs");


router.get('/',(req,res)=>{
  console.log("Frydo - no men land! conn")
  res.send('Frydo - no men land!')
  res.end()
})

router.get('/test',(req,res)=>{
  console.log("this is test pro")
  res.send('this is test')
  res.end()
})



router.post('/api/v1/user/signup',async (req,res)=>{
   
  console.log('req.body', req.body)
    const {name,email,password,provider,provider_id,avatar} = req.body;
    try{
      const user = new User({name,email,password,provider,provider_id,avatar});
      await  user.save();
      const token = jwt.sign({userId:user._id},jwtkey)
      res.send({token})

    }catch(err){
      return res.status(422).send(err)
    }
    
    
})



router.post('/api/v1/user/signin',async (req,res)=>{
  console.log('login user', req.body)
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).send({error :"must provide email or password"})
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).send({error :"User not found"})
    }
    try{
      await user.comparePassword(password);  
       // Update user's active status to true
       user.isActive = true;
       await user.save();  
      const token = jwt.sign({userId:user._id},jwtkey);
      res.status(200).send({token:token, user:user});
    }catch(err){
        return res.status(422).send({error :"Email or Password Invalid"})
    }
    


})

router.get('/api/v1/getusers', async(req,res)=>{

  try{
    const users = await User.find({});
    return res.status(200).send({message:'success',data:users})

  }catch(err){
    return res.status(422).send(err)
  }
 
})


router.get('/getuser', async(req,res)=>{

  const email = req?.query?.email;
  try{
    const user = await User.findOne({email: email});
    console.log('user', user)
    return res.status(200).send({message:'success',data:user})

  }catch(err){
    return res.status(422).send(err)
  }
 
})



router.post('/updateuser', (req, res) => {

  let data = {
    id: req?.body?.id,
    name: req?.body?.name, 
    email:req?.body?.email,
    about:req?.body?.about,
  };

      User.findOneAndUpdate({_id: req?.body?.id}, {$set:data}, {new: true}, (err, doc) => {
          if (err) {
              console.log("Something wrong when updating data!");
          }
      
        //  console.log('updated user info', doc);
         return res.status(200).send({message:'success',data:doc})

     //  return res.status(200).json({status: 200, message: 'File saved successfully'});
    });


});


router.post('/update/user/device-token', (req, res) => {

  let filters = {
    _id: req?.body?.auth_id,
   // device_token: req?.body?.device_token, 
  };
  // console.log('user token filter', filters)

      User.findOneAndUpdate(filters, {$set:{device_token: req?.body?.device_token}}, {new: true}, (err, doc) => {
          if (err) {
              console.log("Something wrong when updating data!");
          }
      
        //  console.log('updated user info', doc);
         return res.status(200).send({message:'success',data:doc})

     //  return res.status(200).json({status: 200, message: 'File saved successfully'});
    });


});



router.post('/api/v1/user/logout', async(req,res)=>{
  // console.log('login user', req.body)
  const authId = req.body._id;

    const user = await User.findById(authId)
    // console.log('useruser', user)

    try{
       // Update user's active status to true
       user.isActive = false;
       await user.save();  
      // const token = jwt.sign({userId:user._id},jwtkey);
       res.status(200).send({message:'Logout Successfull!'});
    }catch(err){
        return res.status(422).send({error :"Logout Invalid"})
    }
    


})



//  var storage = multer.diskStorage({   
//   destination: function(req, file, cb) { 
 
//     const folder = './assets/uploads/avatar/'+ req?.body?.id
//     if (!fs.existsSync(folder)) {
//         fs.mkdirSync(folder)
//     }
//     fsExtra.emptyDirSync(folder);
//     cb(null, folder);    
//   }, 
//   filename: function (req, file, cb) { 
//     const ext = path.extname(file.originalname); 
//     const authName = (req?.body?.name)?.replace(/\s+/g, '-')?.toLowerCase();
//     const filename = `${req?.body?.id}-${Date.now()}${ext}`;
//   //  const filename = `${authName}-${Date.now()}${ext}`;
//     console.log('eeeeerrrfile', filename);
//      cb(null, filename)
//   }
// });

// var upload = multer({ storage: storage });








/*
router.post('/upload', upload.single("fileData"), async (req, res, next) => {



    console.log('before req.body', req?.body)


    try {
      // 'avatar' is the name of our file input field in the HTML form
      // req.file contains information of uploaded file
      // req.body contains information of text fields

          console.log('before req.file', req?.file)

          // if (!req.file) {
          //     return res.send('Please select an image to upload');
          // }
          // else if (err instanceof multer.MulterError) {
          //     return res.send(err);
          // }
          // else if (err) {
          //     return res.send(err);
          // }

          // const classifiedsadd = {
          //     image: req.file.filename
          // }; 
          // res.send("ok")




         let data ={ avatar: req?.file?.path }
        
        console.log('prooo data', data)


        User.findOneAndUpdate({_id: req?.body?.id}, {$set:data}, {new: true, useFindAndModify: false}, (err, doc) => {
          if (err) {
              console.log("Something wrong when updating data!");
          }
      
          console.log('updated user info', doc);
      
       //  return res.send({doc})
       // return  res.status(200).send({message:'success11'})
        // return next();

        //return res.status(200).json({ result:doc });
        // return res.status(200).send({message:'success',data:doc})

     //  return res.status(200).json({status: 200, message: 'File saved successfully'});
      });

      console.log('hello node js')

     // return res.status(200).json({status: 200, message: 'File saved successfully'});
      return next();
      return res.status(200).send({message:'success'})

  }catch (err) {
    console.log('reponse error', err)
  }



});

*/


module.exports = router