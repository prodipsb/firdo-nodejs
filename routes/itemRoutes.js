const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} = require('../keys')
const router = express.Router();
const User = mongoose.model('User');
const Item = mongoose.model('Item');
const UserItem = mongoose.model('UserItem');
const Inspiration = mongoose.model('Inspiration')
const CalendarEvent = mongoose.model('CalendarEvent')
const ItemType = mongoose.model('ItemType')
const Packing = mongoose.model('Packing')
const Color = mongoose.model('Color')
const {mogoUrl} = require('../keys')


router.get('/itemapi',(req,res)=>{
  console.log("this is test itemapi")
  res.send('this is test itemapi')
  res.end()
})


router.get('/items', async(req,res)=>{

  try{
   
    const type = req?.query?.type;
    var query = type ? {type:type} : {}

    const color = req?.query?.color;
    console.log(color)
    
     query = color ? Object.assign(query, {color: color}) : query
     console.log('query', query)
   // var query = { type: type };
    const items = await Item.find({});
   // console.log('items', items)
    return res.status(200).send({message:'success',data:items})

  }catch(err){
    return res.status(422).send(err)
  }
 
})



router.get('/items/by-type', async(req,res)=>{

  try{
  //   const type = req?.query?.type;
  //   var query = type ? {type:type} : {}
  //  // var query = { type: type };
  //   const items = await Item.find(query);
  //  // console.log('items', items)
  //   return res.status(200).send({message:'success',data:items})


//   Message.aggregate(
//     [
//         { "$match": { "to": user } },
//         { "$sort": { "date": 1 } },
//         { "$group": { 
//             "_id": "from",
//             "to": { "$first": "$to" },
//             "message": { "$first": "$message" },
//             "date": { "$first": "$date" },
//             "origId": { "$first": "$_id" }
//         }},
//         { "$lookup": {
//              "from": "users",
//              "localField": "from",
//              "foreignField": "_id",
//              "as": "from"
//         }},
//         { "$lookup": {
//              "from": "users",
//              "localField": "to",
//              "foreignField": "_id",
//              "as": "to"
//         }},
//         { "$unwind": { "path" : "$from" } },
//         { "$unwind": { "path" : "$to" } }
//     ],
//     function(err,results) {
//         if (err) throw err;
//         return results;
//     }
// )


      // const itemTypes = await ItemType.find({});
      //  console.log('itemTypes', itemTypes)
      // return res.status(200).send({message:'success',data:itemTypes})



      // const typeItems = await ItemType.aggregate(
      //   [
      //      // { "$match": { "to": user } },
      //      // { "$sort": { "date": 1 } },
      //      { "$group": { 
      //          "type": "$slug",
      //           // "to": { "$first": "$to" },
      //           // "message": { "$first": "$message" },
      //           // "date": { "$first": "$date" },
      //           // "origId": { "$first": "$_id" }
      //      }},
      //       { "$lookup": {
      //           "from": "items",
      //           "localField": "slug",
      //           "foreignField": "type",
      //           "as": "typeItems"
      //       }},
      //       // { "$lookup": {
      //       //     "from": "users",
      //       //     "localField": "to",
      //       //     "foreignField": "_id",
      //       //     "as": "to"
      //       // }},
      //       { "$unwind": { "path" : "$typeItems" } },
      //     //  { "$unwind": { "path" : "$to" } }
          
      //   ],
      //   function(err,results) {
      //       if (err) throw err;
      //       return results;
      //   }
      // )

      //  console.log('typeItems', typeItems)
      //  return res.status(200).send({message:'success',data:typeItems})



      const typeItems = await ItemType.aggregate([

        {
          $lookup: {
            from: 'items',
            localField: 'slug',
            foreignField: 'type',
            as: 'items',
          },
        },
    
      ]);
    
      
    
     //  console.log('typeItems', typeItems);
      return res.status(200).send({message:"success", data: typeItems});

      

  }catch(err){
    return res.status(422).send(err)
  }
 
})


router.get('/item', async(req,res)=>{

  const id = req?.query?.id;

  try{
    var query = id ? { _id: id } : {};
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



router.post('/user/item-store',async (req,res)=>{
   
  console.log('req.body', req.body)
    const {user_id,item_id,shoe_id,pant_id} = req.body;
    try{
      
      const userItems = new UserItem({user_id,item_id,shoe_id,pant_id});
      const storeUserItems =  await  userItems.save();
      return res.status(200).send({message:'success',data:storeUserItems})

    }catch(err){
      return res.status(422).send(err)
    }
    
    
})


//inpiration route
router.get('/inspirations', async(req,res)=>{

  const inspirations = await Inspiration.aggregate([

    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: 'inspiration_id',
        as: 'items',
      },
    },

  ]);

  

  // console.log('updated', inspirations);
  return res.status(200).send({message:"success", data: inspirations});

 
})



// ------ calendar event -------
router.post('/user/calendar/event-store',async (req,res)=>{
   
  console.log('req.body', req.body)
    const {date, user_id, item_id} = req.body;
    try{
      
      const calendarEvent = new CalendarEvent({date, user_id, item_id});
      const storeCalendarEvent =  await  calendarEvent.save();
      return res.status(200).send({message:'success',data:storeCalendarEvent})

    }catch(err){
      return res.status(422).send(err)
    }
    
    
})


router.post('/user/calendar/text-event-store',async (req,res)=>{
   
  console.log('req.body', req.body)
    const {date, name, user_id, type, details} = req.body;
    try{
      
      const calendarEvent = new CalendarEvent({date, name, user_id, type, details});
      const storeCalendarEvent =  await  calendarEvent.save();
      return res.status(200).send({message:'success',data:storeCalendarEvent})

    }catch(err){
      return res.status(422).send(err)
    }
    
    
})


router.get('/user/calendar/events',async (req,res)=>{
   
 // console.log('req.body', req.query)
 // const date = req?.query?.date;
  const userId = req?.query?.user_id;
 // console.log('userId', userId)

  try{
    // var query = { date: date, user_id:userId };
    var query = { user_id:userId };
    console.log(' query', query)


    
    //  const item = await CalendarEvent.find(query);
    //  console.log('found item', item);
    //  return false;
  //   return res.status(200).send({message:'success',data:item})



  const myEvents = await CalendarEvent.aggregate([
   // { $match: { user_id: { $eq: { $toObjectId: userId} } } },
  //  { $match: { $expr: { $eq: [ '$user_id', '$$userId' ] } } },
  { $match: { $expr : { $eq: [ '$user_id' , { $toObjectId: userId } ] } } },
    {
      $lookup: {
        from: 'items',
        localField: 'item_id',
        foreignField: '_id',
        as: 'items',
      },
    },
    // {"$unwind":"$items"},
    // {"$match":{"items._id":"630085bdc98eed7fcbed897e"}}

  ]);

  

  //console.log('updated', JSON.stringify(myEvents));
 // console.log('updated222', JSON.stringify(myEvents?.items));
  return res.status(200).send({message:"success", data: myEvents});

  }catch(err){
    return res.status(422).send(err)
  }
    
    
})


router.get('/user/calendar/day/events',async (req,res)=>{
   
  console.log('req.body', req.query)
  const date = req?.query?.date;
  const userId = req?.query?.user_id;
  // console.log('userId', userId)

  try{
     var query = { date: date, user_id:userId };
   // var query = { user_id:userId };
    console.log(' query', query)


    
    //  const item = await CalendarEvent.find(query);
    //  console.log('found item', item);
    //  return false;
  //   return res.status(200).send({message:'success',data:item})

  //const tt = CalendarEvent.aggregate([
  //  { $match: { is_processed: false,} },
    // { $lookup: {
    //     from: 'items',
    //     let: { 'itemId': '$_id', 'date': '$date' },
    //     pipeline: [{ $match: { 
    //         date: { $gte: '$$date', $lt: '$$date' },
    //     }}],
    //     as: 'items'
    // } }


   // { "$match": { "is_processed": false,} },
    // { "$lookup": {
    //   "from": "items",
    //   "let": { "itemId": "$_id", "date": "$date"},
    //   "pipeline": [
    //     { "$match": {
    //       "$expr": {
    //         "$and": [
    //           { "$eq": [ "$date", "$$date" ] },
    //         ]
    //       }
    //     }}
    //   ],
    //   "as": "items"
    // }}


   // { $match: { date: '2022-09-02T00:00:00.000+00:00',} },
    // { $lookup: {
    //     from: 'items',
    //     let: { 'itemId': '$_id' },
    //     pipeline: [{ $match: { $expr: { $eq: [ '$item_id', '$$itemId' ]}} }],
    //     as: 'items'
    // } },
    // {"$unwind":"$items"},
// ]);

// console.log('updated', tt);

// return false;


  let params  = {date: '2022-09-02T00:00:00.000+00:00'}
  let targetDate =  date+'T00:00:00.000Z';
  const myEvents = await CalendarEvent.aggregate([

    // {
    //   $lookup: {
    //     from: "items",
    //     let: { item_id: "$_id" },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: { $eq: ["$$item_id", "$item_id"] },
    //           user_id: objectId(userId)
    //         }
    //       }
    //     ],
    //     as: "items"
    //   }
    // }

    // { $match: {
    //   date: '2022-09-02T00:00:00.000Z'
    // } },

   // {$match: {_id: ObjectId("6313d0e43890ae5f923e70c6")}},
    //{"$match":{"calendarevents._id":ObjectId("6313d0e43890ae5f923e70c6")}},
    // {$match: {_id: ObjectId("6313d1353890ae5f923e70ca")}},

   
    // {$match:params},



  // {
  //     $match:{
  //       date: "2022-09-02T00:00:00.000+00:00"
       
  //     }
  // },


    { $match: { $expr : { $eq: [ '$user_id' , { $toObjectId: userId } ] } } },
    { $match: { $expr : { $eq: [ '$date' , { $toDate : targetDate} ] } } },

  //  { $match: { $expr : { $eq: [ '$date' ,{ 'date': '2022-09-02T00:00:00.000Z'}] }}},
  // { $match: { "date": "2022-09-02T00:00:00.000Z" } },
  // { "$match": { "date": { "date": "2022-09-02T00:00:00.000Z" }}},
  // {$match : {date : "2022-09-02T00:00:00.000Z"}},
    {
      $lookup: {
        from: 'items',
        localField: 'item_id',
        foreignField: '_id',
        as: 'items',
      },
    },

    {"$unwind":"$items"},



// {
//   $lookup: {
//     from: 'items',
//     localField: 'item_id',
//     foreignField: '_id',
//     as: 'items',
//     pipeline: [{
//         $match: {
//             $expr: {
//                 $and: [
//                     //{ $eq: ['$status', 'filled'] },
//                     { $eq: ['$date', "2022-09-02T00:00:00.000Z"] },
//                 ]
//             }
//         }
//     }]
// }
// },
//  {"$unwind":"$items"},

  

  //   { 
  //     $match: {
  //     "items._id": "6300898521654f833acb359e"
  //   } 
  // },


//   {
//     $match:{
//        item_id:{
//           $eq: "6300898521654f833acb359e",
//        }
//     }
//  },

    

  //   { 
  //     $project: { 
  //       items: 1
  //    } 
  //  }

  //   {
  //     $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$items", 0 ] }, "$$ROOT" ] } }
  //  },
  //  { $project: { items: 0 } }



  // {
  //   $lookup:
  //      {
  //        from: "items",
  //        let: { o_item: "$item_id" },
  //        pipeline: [
  //           { $match:
  //              { $expr:
  //                 { $and:
  //                    [
  //                      { $eq: [ "$_id",  "$$o_item" ] },
  //                    ]
  //                 }
  //              }
  //           },
  //           { $project: { 'date': "2022-09-02T00:00:00.000+00:00" } }
  //        ],
  //        as: "items"
  //      }
  // },
  // {"$unwind":"$items"},



    // {
    //   $project: {

    //     'user_id': "62cc8b0bd69a251b882dcd95"
    // },
    // }
    // {"$unwind":"$calendarevents"},
    // {"$match":{"calendarevents.user_id":objectId(userId)}}
    // {"$unwind":"$items"},
   //  {"$match":{"items._id":"63013ff2772aad9af8807f96"}}

  ],
  function (err, response) {
    console.log(err, response)
 });


// const myEvents = User.aggregate([{
//     $lookup: {
//         from: 'referrallinks',
//         localField: '_id',
//         foreignField: 'companyId',
//         as: 'referrals'
//     }
// }])
  

  // console.log('updated', myEvents);
  // console.log('updated222', JSON.stringify(myEvents?.items));
   return res.status(200).send({message:"success", data: myEvents});

  }catch(err){
    return res.status(422).send(err)
  }
    
    
})


router.get('/user/calendar-day/event-delete', async(req,res)=>{

  const eventID = req?.query?.event_id;

  console.log('delted')

  try{
    var query = { _id: eventID };
    const item = await CalendarEvent.findOneAndRemove(query);
    console.log('items', item)
    return res.status(200).send({message:'success',data:'Event deleted successfully'})

  }catch(err){
    return res.status(422).send(err)
  }
 
})




// --------- packing route ---------
router.post('/user/packing-store',async (req,res)=>{
   
  console.log('req.body', req.body)
    const {name, user_id,item_ids} = req.body;
    try{
      
      const item_ids = JSON.parse(item_ids)
      const userPacking = new Packing({name, user_id,item_ids});
      const storeUserPacking =  await  userPacking.save();
      return res.status(200).send({message:'success',data:storeUserPacking})

    }catch(err){
      return res.status(422).send(err)
    }
    
    
})

router.get('/user/packing', async(req,res)=>{

  const userID = req?.query?.user_id;

  //console.log('param user id', userID)
  try{
    var query = { user_id: userID };
    const packings = await Packing.find(query);
    console.log('packings', packings)
    return res.status(200).send({message:'success',data: packings})

  }catch(err){
    return res.status(422).send(err)
  }
 
})


router.get('/user/packing/delete', async(req,res)=>{

  const packingID = req?.query?.packing_id;

  try{
    var query = { _id: packingID };
    const packing = await Packing.findOneAndRemove(query);
    console.log('packing', packing)
    return res.status(200).send({message:'success',data:'Packing deleted successfully'})

  }catch(err){
    return res.status(422).send(err)
  }
 
})



// --------- color route ---------
router.get('/colors', async(req,res)=>{

  const colors = await Color.aggregate([

    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: 'color',
        as: 'items',
      },
    },

  ]);

  console.log('colorss', colors)

  return res.status(200).send({message:'success',data:colors})

  // try{
  //   var query = {};
  //   const colors = await Color.find(query);
  //   console.log('colors', colors)
  //   return res.status(200).send({message:'success',data:colors})

  // }catch(err){
  //   return res.status(422).send(err)
  // }
 
})



// --------- item type  ---------
router.get('/item-types', async(req,res)=>{


  try{
        const itemTypes = await ItemType.find({});
        console.log('itemTypes', itemTypes)
        return res.status(200).send({message:'success',data:itemTypes})

  }catch(err){
    return res.status(422).send(err)
  }
 
})




module.exports = router