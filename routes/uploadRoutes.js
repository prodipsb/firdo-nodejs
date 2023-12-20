const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { jwtkey } = require('../keys')
const router = express.Router();
const User = mongoose.model('User');

const Item = mongoose.model('Item');
const Packing = mongoose.model('Packing');
const pluralize = require('pluralize');



// import fsExtra from 'fs-extra'
const fsExtra = require('fs-extra');
const fs = require("fs");
var path = require("path");
var multer = require('multer');
const MyLook = require('../models/MyLook');
const Type = require('../models/Type');

var uploadFolder = path.join(__dirname, '../assets/uploads');

router.get('/api', (req, res) => {
  console.log("this is test apis")
  res.send('this is test apis')
  res.end()
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {

    const folder = './assets/uploads/avatar/' + req?.body?.id
    console.log('folder')
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
    // console.log('eeeeerrrfile', filename);
    cb(null, filename)
  }
});

var upload = multer({ storage: storage });





router.post('/upload', upload.single("fileData"), async (req, res, next) => {

  // console.log('before req.body', req?.body)

  try {

    // console.log('before req.file', req?.file)

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

    let data = { avatar: req?.file?.path }

    console.log('prooo data', data)


    User.findOneAndUpdate({ _id: req?.body?.id }, { $set: data }, { new: true, useFindAndModify: false }, (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }

      // console.log('updated user info', doc);

      //  return res.status(200).json({status: 200, message: 'File saved successfully'});
    });


    // return res.status(200).json({status: 200, message: 'File saved successfully'});
    return next();
    //  return res.status(200).send({message:'success'})

  } catch (err) {
    console.log('reponse error', err)
  }

});





var storageItem = multer.diskStorage({
  destination: function (req, file, cb) {

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

  let data = '';
  data = req?.file?.path ?
    {
      title: req?.body?.title,
      color: req?.body?.color,
      user_id: req?.body?.user_id,
      inspiration_id: req?.body?.inspiration_id,
      category_id: req?.body?.category_id,
      type_id: req?.body?.type,
      price: req?.body?.price,
      details: req?.body?.details,
      photo: req?.file?.path
    } : {
      title: req?.body?.title,
      color: req?.body?.color,
      user_id: req?.body?.user_id,
      inspiration_id: req?.body?.inspiration_id,
      category_id: req?.body?.category_id,
      type_id: req?.body?.type,
      price: req?.body?.price,
      details: req?.body?.details,
    };


  const { title, color, user_id, inspiration_id, category_id, type_id, price, details, photo } = data;
  const item = new Item({ title, color, user_id, inspiration_id, category_id, type_id, price, details, photo });
  const storeDate = await item.save();

  res.status(200).send({ 'message': 'success', 'data': storeDate })

});



// ------------- packing ----------
var storagePacking = multer.diskStorage({
  destination: function (req, file, cb) {

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
      user_id: req?.body?.user_id,
      item_ids: JSON.parse(req?.body?.item_ids),
      photo: req?.file?.path
    } : {
      name: req?.body?.name,
      user_id: req?.body?.user_id,
      item_ids: JSON.parse(req?.body?.item_ids),
    };

  //console.log('packing data', data);
  // return false;

  const { name, user_id, photo, item_ids } = data;

  let storePacking = '';
  if (packingID) {
    if (req?.file?.path) {
      // photo = req?.file?.path

      const { name, user_id, photo, item_ids } = data;
    } else {
      const { name, user_id, item_ids } = data;
    }
    const filter = { _id: packingID };
    storePacking = await Packing.findOneAndUpdate(filter, data, {
      new: true
    });
  } else {

    const packing = new Packing({ name, user_id, photo, item_ids });
    storePacking = await packing.save();
  }

  //console.log('create new one', storePacking)

  res.status(200).send({ 'message': 'success', 'data': storePacking })

});




// ===== mylook images upload ===== //

var storageMyLookImages = multer.diskStorage({

  destination: function (req, file, cb) {

    const authId = req.body.user_id;

    const folder = `./assets/uploads/mylook/${authId}`;
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }
    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file?.originalname);
    // const filename = `${file?.originalname}-${Date.now()}.${ext}`;
    // console.log('made file name', filename)
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename)
  }

});


var uploadMyLook = multer({ storage: storageMyLookImages });

router.post('/mylook/store', uploadMyLook.array('photos[]'), async (req, res, next) => {

  // console.log('req.body', req.body)
  // console.log('single file',req.file);
  // console.log('multiple files',req.files);

  const storeFile = req?.file?.path;

  let Arrphotos = [];
  
  req.files.forEach((image) => { 
    Arrphotos.push(image.path);
  });

  data = 
    {
      title: req?.body?.title,
      user_id: req?.body?.user_id,
      details: req?.body?.details,
      photos: Arrphotos
    }

    console.log('my look store', data)
    // return

    const { title, user_id, details, photos } = data;

    const mylook = new MyLook({ title, user_id, details, photos});
    storeMyLook = await mylook.save();

  

  res.status(200).send({ 'message': 'success', 'data': storeMyLook })

});

// ===== my look images upload ===== //



// ===== chat file upload ===== //

var storageChatFile = multer.diskStorage({
  destination: function (req, file, cb) {

    const room = req.body.room;

    const folder = `./assets/uploads/chat/${room}`;
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file?.originalname);
    // const filename = `${file?.originalname}-${Date.now()}.${ext}`;
    // console.log('made file name', filename)
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename)
  }
});

var uploadItem = multer({ storage: storageChatFile });

router.post('/chat/file/store', uploadItem.single('chatfile'), async (req, res, next) => {

  const storeFile = req?.file?.path;

  res.status(200).send({ 'message': 'success', 'data': storeFile })

});

// ===== chat file upload ===== //



// ===== type images upload ===== //

var storageTypeImages = multer.diskStorage({

  destination: function (req, file, cb) {
    const folder = `./assets/uploads/type`;
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }
    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file?.originalname);
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename)
  }

});


var uploadType = multer({ storage: storageTypeImages });

router.post('/type/store', uploadType.single('image'), async (req, res, next) => {
 
  const {category_id, title } = req.body;
  const plural = pluralize(title);
  const image = req?.file?.path;


  const type = new Type({ category_id, title, plural, image});

  // Save the user and handle validation errors
  await type.save()
  .then((data) => {
    // This block will not be executed since the data is invalid
    res.status(200).send({ 'message': 'success', 'data': data })
  })
  .catch((error) => {
    if (error instanceof mongoose.Error.ValidationError) {
      // Handle validation error
      console.error('Validation error:', error.message);
      res.status(412).send({ 'message': 'Validation error', 'data': error.message })
    } else {
      // Handle other types of errors
      console.error('Unexpected error:', error);
      res.status(412).send({ 'message': 'Unexpected error', 'data': error })
    }
  });

  

});

// ===== my look images upload ===== //


module.exports = router