const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} = require('../keys')
const router = express.Router();
const {mogoUrl} = require('../keys');
const MyLook = require('../models/MyLook');
const ShareLook = require('../models/ShareLook');
const Category = require('../models/Category');
const pluralize = require('pluralize');
const Type = require('../models/Type');


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
   
  const {user_id,items} = req.body;

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
            $lookup:
              {
                from: "lookfollows",
                localField: "user_id",
                foreignField: "user_id",
                as: "lookFollow"
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




// --------- Category Route  ---------
router.get('/categories', async(req,res)=>{

  try{

    const categories = await Category.aggregate([
      {
        $lookup:
          {
            from: "types",
            localField: "_id",
            foreignField: "category_id",
            as: "types"
          }
      },
      {
        $sort: {
          title:1 
        }
      }
     
    ])


   // const categories = await Category.find({}).sort({title:1});
    return res.status(200).send({message:'success',data:categories})

  }catch(err){
    return res.status(422).send(err)
  }
 
})


router.post('/category/store', async (req,res)=>{

   
  const {title} = req.body;
  const plural = pluralize(title);

  try{
    
    const category = new Category({title, plural});
    const addedCategory =  await  category.save();
    return res.status(200).send({message:'success',data:addedCategory})

  }catch(err){
    return res.status(422).send(err)
  }
  
  
})


router.post('/category/update', async (req,res)=>{

  
 const {_id,title} = req.body;
//  console.log('my look user', user_id)

 try{

   // Create a filter 
   const filter = { _id: _id };
   /* Set the upsert option to insert a document if no documents match
   the filter */
   const options = { upsert: true };
   // Specify the update to set a value for the plot field
   const updateDoc = {
     $set: {
       title: title,
     },
   };

   const result = await Category.updateOne(filter, updateDoc, options);

   return res.status(200).send({message:'success',data:result})

 }catch(err){
   return res.status(422).send(err)
 }
 
 
})


router.get('/category/delete', async(req,res)=>{

  const categoryId = req?.query?._id;

  try{
    var query = { _id: categoryId };
    const category = await Category.findOneAndRemove(query);
    return res.status(200).send({message:'success',data:'Category deleted successfully'})

  }catch(err){
    return res.status(422).send(err)
  }
 
})


// --------- TYpe Route  ---------
router.get('/types', async(req,res)=>{

  if(req?.query?.category_id){
    var query = {category_id: req?.query?.category_id}
  }else{
    var query ={}
  }

  try{
    const types = await Type.find(query).sort({title:1});
    return res.status(200).send({message:'success',data:types})

  }catch(err){
    return res.status(422).send(err)
  }
 
})

router.get('/type', async(req,res)=>{


  try{
    const type = await Type.find({_id: req.query._id});
    return res.status(200).send({message:'success',data:type})

  }catch(err){
    return res.status(422).send(err)
  }
 
})


router.post('/type/store', async (req,res)=>{

   console.log('req.body', req.body)
   
  const {category_id, title, image} = req.body;
  const plural = pluralize(title);

  try{
    
    const type = new Type({category_id, title, plural, image});
    const addedType =  await  type.save();
    return res.status(200).send({message:'success',data:addedType})

  }catch(err){
    return res.status(422).send(err)
  }
  
  
})


router.post('/type/update', async (req,res)=>{

  
  const {_id, category_id, title, image} = req.body;
  const plural = pluralize(title);

 try{

   // Create a filter 
   const filter = { _id: _id };
   /* Set the upsert option to insert a document if no documents match
   the filter */
   const options = { upsert: true };
   // Specify the update to set a value for the plot field
   const updateDoc = {
     $set: {
       category_id:category_id,
       title: title,
       image:image
     },
   };

   const result = await Type.updateOne(filter, updateDoc, options);

   return res.status(200).send({message:'success',data:result})

 }catch(err){
   return res.status(422).send(err)
 }
 
 
})


router.get('/type/delete', async(req,res)=>{

  const typeId = req?.query?._id;

  try{
    var query = { _id: typeId };
    const type = await Type.findOneAndRemove(query);
    return res.status(200).send({message:'success',data:'Type deleted successfully'})

  }catch(err){
    return res.status(422).send(err)
  }
 
})



module.exports = router