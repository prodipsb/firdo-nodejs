const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} = require('../keys')
const router = express.Router();
const {mogoUrl} = require('../keys');
const MyLook = require('../models/MyLook');
const ShareLook = require('../models/ShareLook');


// --------- my look  ---------
router.get('/mylooks', async(req,res)=>{


  try{
        const mylooks = await MyLook.find({user_id: req.query.user_id});
        return res.status(200).send({message:'success',data:mylooks})

  }catch(err){
    return res.status(422).send(err)
  }
 
})



router.post('/mylook/share', async (req,res)=>{
   
    const {user_id,look_id} = req.body;

    try{
      
      const sharelooks = new ShareLook({user_id,look_id});
      const storeSharelooks =  await  sharelooks.save();
      return res.status(200).send({message:'success',data:storeSharelooks})

    }catch(err){
      return res.status(422).send(err)
    }
    
    
})

router.get('/sharelooks', async(req,res)=>{


  try{

        // const shareLooks = await MyLook.find({});
        // return res.status(200).send({message:'success',data:shareLooks})


        const shareLooks = await ShareLook.aggregate([
          {
            $lookup:
              {
                from: "mylooks",
                localField: "look_id",
                foreignField: "_id",
                as: "looks"
              }
          },
          {
            $lookup:
              {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
              }
          }
        ])

        // console.log('get my all looks', shareLooks)



        return res.status(200).send({message:'success',data:shareLooks})



  }catch(err){
    return res.status(422).send(err)
  }
 
})







module.exports = router