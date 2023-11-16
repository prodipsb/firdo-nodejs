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


router.post('/add/mylook', async (req,res)=>{

   console.log('req.body', req.body)
   
  const {user_id,items} = req.body;
  console.log('my look user', user_id)
  console.log('my look items ids', items)

  try{
    
    const mylook = new MyLook({user_id,items});
    const addedMylooks =  await  mylook.save();
    return res.status(200).send({message:'success',data:addedMylooks})

  }catch(err){
    return res.status(422).send(err)
  }
  
  
})


router.post('/mylook/update', async (req,res)=>{

  console.log('req.body', req.body)
  
 const {look_id, user_id,title, details} = req.body;
 console.log('my look user', user_id)

 try{

   // Create a filter for movies with the title "Random Harvest"
   const filter = { _id: look_id };
   /* Set the upsert option to insert a document if no documents match
   the filter */
   const options = { upsert: true };
   // Specify the update to set a value for the plot field
   const updateDoc = {
     $set: {
       title: title,
       details: details
     },
   };

   const result = await MyLook.updateOne(filter, updateDoc, options);

  // console.log('update result', result)
   return res.status(200).send({message:'success',data:result})

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
          },
          {
            $lookup:
              {
                from: "looklikes",
                localField: "look_id",
                foreignField: "look_id",
                as: "lookLike"
              }
          },
          {
            $sort: {
              createdAt: -1 // Sorting by the 'createdAt' field in descending order
            }
          }
         
        ])

        //  console.log('get my all looks', shareLooks)



        return res.status(200).send({message:'success',data:shareLooks})



  }catch(err){
    return res.status(422).send(err)
  }
 
})







module.exports = router