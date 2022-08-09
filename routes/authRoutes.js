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
        return res.status(422).send({error :"User not found"})
    }
    try{
      await user.comparePassword(password);    
      const token = jwt.sign({userId:user._id},jwtkey)
      res.send({token:token, user:user})
    }catch(err){
        return res.status(422).send({error :"Email or Password Invalid"})
    }
    


})


router.get('/getuser',(req,res)=>{

  const _id = req?.query?.id;

  User.findById(_id, function (err, docs) {
    if (err){
        console.log(err);
    }
    else{

        //console.log("Result : ", docs);
        res.status(200).send({message:'success',data:docs})
    }
});

  //const user = User.findOne({_id})
  //console.log('user',user)
  //const idd = req.query.id;
  //res.send(idd)
   //res.status(200).send({message:user})
  // res.end()
})



 const fs = require("fs");
 var path = require('path');


 var storage = multer.diskStorage({   
  destination: function(req, file, cb) { 
 
    const folder = './assets/uploads/avatar/'+ req?.body?.id
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
    }
    fsExtra.emptyDirSync(folder);
    cb(null, folder);    
  }, 
  filename: function (req, file, cb) { 
    const ext = path.extname(file.originalname); 
    const authName = (req?.body?.name)?.replace(/\s+/g, '-')?.toLowerCase();
    const filename = `${req?.body?.id}${ext}`;
  //  const filename = `${authName}-${Date.now()}${ext}`;
    console.log('eeeeerrrfile', filename);
     cb(null, filename)
  }
});

var upload = multer({ storage: storage });

router.post('/updateuser', (req, res) => {

  let data = {
    id: req?.body?.id,
    name: req?.body?.name, 
    email:req?.body?.email,
    about:req?.body?.about,
  };

  console.log('user data', data);

      User.findOneAndUpdate({_id: req?.body?.id}, {$set:data}, {new: true}, (err, doc) => {
          if (err) {
              console.log("Something wrong when updating data!");
          }
      
          console.log('updated user info', doc);
      
       //  return res.send({doc})
       // return  res.status(200).send({message:'success11'})
        // return next();

        //return res.status(200).json({ result:doc });
         return res.status(200).send({message:'success',data:doc})

     //  return res.status(200).json({status: 200, message: 'File saved successfully'});
    });


});


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




         let data = req?.file?.path ? 
               {
                 name: req?.body?.name, 
                 email:req?.body?.email,
                 about:req?.body?.about,
                 avatar: req?.file?.path
               } : {
                 name: req?.body?.name, 
                 email:req?.body?.email,
                 about:req?.body?.about,
               };
        
        console.log('prooo data', data)


    //     User.findOneAndUpdate({_id: req?.body?.id}, {$set:data}, {new: true}, (err, doc) => {
    //       if (err) {
    //           console.log("Something wrong when updating data!");
    //       }
      
    //       console.log('updated user info', doc);
      
    //    //  return res.send({doc})
    //    // return  res.status(200).send({message:'success11'})
    //     // return next();

    //     //return res.status(200).json({ result:doc });
    //    //  return res.status(200).send({message:'success',data:doc})

    //  //  return res.status(200).json({status: 200, message: 'File saved successfully'});
    //   });

      console.log('hello node js')

     // return res.status(200).json({status: 200, message: 'File saved successfully'});

      return res.status(200).send({message:'success'})

  }catch (err) {
    console.log('reponse error', err)
  }


 


    






/*


  upload(req, res, async (err) => {
    console.log('req.body', req.body)
   // return res.send({message:req?.body})
    if(err) {
      res.status(400).send("Something went wrong!");
    }
    console.log(req.file);
 //   res.send(req.fileData);

  let data = '';
   data = req?.file?.path ? 
        {
          name: req?.body?.name, 
          email:req?.body?.email,
          about:req?.body?.about,
          avatar: req?.file?.path
        } : {
          name: req?.body?.name, 
          email:req?.body?.email,
          about:req?.body?.about,
        };

  console.log('data2233', data);
  //return false;

  
   //return res.send({message:data});


  User.findOneAndUpdate({_id: req?.body?.id}, {$set:data}, {new: true}, (err, doc) => {
    if (err) {
        console.log("Something wrong when updating data!");
    }

    console.log('updated user info', doc);
    // console.log('updated user res', res);

  //  res.send({doc})
   // res.status(200).send({message:'success11'})
    res.status(200).send({message:'success11',data:doc})
});

 //res.send({'message':'success'});

//  const userinfo = User.findByIdAndUpdate(req?.body?.id , 
//                       data,
//                       {upsert: true})
//       .exec(function (err, user) {
//           if (err) throw err;
//           console.log('after updated user', user);
//       });


//       console.log('userinfo', userinfo);


//       res.status(200).send({'message':'success', 'data':userinfo})






    });


  // }catch(err){
  //     return res.status(422).send({error :"Email or Password Invalid"})
  // }



*/





  //below code will read the data from the upload folder. Multer     will automatically upload the file in that folder with an  autogenerated name
  // fs.readFile(req.file.path,(err, contents)=> {
  //  if (err) {
  //  console.log('Error: ', err);
  // }else{
  //  console.log('File contents ',contents);
  // }


  // var file = __dirname + "/" + req.file.originalname;
  // fs.readFile(req.file.path, function (err, data) {
  //     fs.writeFile(file, data, function (err) {
  //         if (err) {
  //             console.log(err);
  //         } else {
  //             var response = {
  //                 message: 'File uploaded successfully',
  //                 filename: req.file.originalname
  //             };
  //         }
  //         console.log(response);
  //         res.json(response);
  //     });
  // });


});




module.exports = router