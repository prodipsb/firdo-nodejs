const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} = require('../keys')
const router = express.Router();
const User = mongoose.model('User');

const Item = mongoose.model('Item');
const Packing = mongoose.model('Packing');


// import fsExtra from 'fs-extra'
const fsExtra = require('fs-extra');
const fs = require("fs");
var path = require("path");
var multer  = require('multer');

var uploadFolder = path.join(__dirname, '../assets/uploads');

router.get('/api',(req,res)=>{
  console.log("this is test apis")
  res.send('this is test apis')
  res.end()
})

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
    const filename = `${req?.body?.id}-${Date.now()}${ext}`;
  //  const filename = `${authName}-${Date.now()}${ext}`;
    console.log('eeeeerrrfile', filename);
     cb(null, filename)
  }
});

var upload = multer({ storage: storage });





router.post('/upload', upload.single("fileData"), async (req, res, next) => {

    console.log('before req.body', req?.body)

    try {

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

     //  return res.status(200).json({status: 200, message: 'File saved successfully'});
      });


     // return res.status(200).json({status: 200, message: 'File saved successfully'});
      return next();
    //  return res.status(200).send({message:'success'})

  }catch (err) {
    console.log('reponse error', err)
  }
 
});





  var storageItem = multer.diskStorage({   
    destination: function(req, file, cb) { 
   
      const folder = './assets/uploads/items';
      if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder)
      }
      cb(null, folder);    
    }, 
    filename: function (req, file, cb) { 
      const ext = path.extname(file.originalname); 
     // const filename = `${file.originalname}-${Date.now()}${ext}`;
      const filename = `${file.originalname}`;
       cb(null, filename)
    }
  });
  
  var uploadItem = multer({ storage: storageItem });


  router.post('/item/save', uploadItem.single('fileData'), async (req, res, next) => {
    console.log('req.body', req.body)
    console.log(req.file);

  let data = '';
   data = req?.file?.path ? 
        {
          title: req?.body?.title, 
          color:req?.body?.color,
          inspiration_id:req?.body?.inspiration_id,
          type:req?.body?.type,
          price:req?.body?.price,
          details:req?.body?.details,
          photo: req?.file?.path
        } : {
          title: req?.body?.title, 
          color:req?.body?.color,
          inspiration_id:req?.body?.inspiration_id,
          type:req?.body?.type,
          price:req?.body?.price,
          details:req?.body?.details,
        };

  
  const {title,color,inspiration_id,type,details,photo} = data;
  const item = new Item({title,color,inspiration_id,type,details,photo});
  const storeDate = await item.save();

  res.status(200).send({'message':'success', 'data':storeDate})

});



// ------------- packing ----------
var storagePacking = multer.diskStorage({   
  destination: function(req, file, cb) { 
 
    const folder = './assets/uploads/packings';
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
    }
    cb(null, folder);    
  }, 
  filename: function (req, file, cb) { 
    const filename = `${file.originalname}`;
     cb(null, filename)
  }
});

var uploadPacking = multer({ storage: storagePacking });


router.post('/packing/store', uploadPacking.single('fileData'), async (req, res, next) => {
  //console.log('req.body', req.body)
 // console.log(req.file);

  const packingID = req?.body?._id;

 // console.log('packing iddd',packingID)

let data = '';
 data = req?.file?.path ? 
      {
        name: req?.body?.name, 
        user_id:req?.body?.user_id,
        item_ids:JSON.parse(req?.body?.item_ids),
        photo: req?.file?.path
      } : {
        name: req?.body?.name, 
        user_id:req?.body?.user_id,
        item_ids:JSON.parse(req?.body?.item_ids),
      };

    //console.log('packing data', data);
   // return false;

    const {name,user_id,photo,item_ids} = data;

    let storePacking = '';
    if(packingID){
      if(req?.file?.path) {
       // photo = req?.file?.path

        const {name,user_id,photo,item_ids} = data;
      }else{
        const {name,user_id,item_ids} = data;
      }
      const filter = { _id: packingID };
       storePacking = await Packing.findOneAndUpdate(filter, data, {
        new: true
      });
    }else{
  
    const packing = new Packing({name,user_id,photo,item_ids});
     storePacking = await packing.save();
    }

    //console.log('create new one', storePacking)

  res.status(200).send({'message':'success', 'data':storePacking})

});




module.exports = router