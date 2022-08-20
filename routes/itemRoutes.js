const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} = require('../keys')
const router = express.Router();
const User = mongoose.model('User');
const Item = mongoose.model('Item');



router.get('/itemapi',(req,res)=>{
  console.log("this is test itemapi")
  res.send('this is test itemapi')
  res.end()
})


router.get('/items', async(req,res)=>{

  try{
    var query = { type: "shirt" };
    const items = await Item.find(query);
   // console.log('items', items)
    return res.status(200).send({message:'success',data:items})

  }catch(err){
    return res.status(422).send(err)
  }
 
})


router.get('/item', async(req,res)=>{

  const id = req?.query?.id;

  try{
    var query = { _id: id };
    const item = await Item.findOne(query);
   // console.log('items', items)
    return res.status(200).send({message:'success',data:item})

  }catch(err){
    return res.status(422).send(err)
  }
 
})



router.get('/items/shoe', async(req,res)=>{

  try{
    var query = { type: "shoe" };
    const shoes = await Item.find(query);
    return res.status(200).send({message:'success',data:shoes})

  }catch(err){
    return res.status(422).send(err)
  }
 
})



module.exports = router