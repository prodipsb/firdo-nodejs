const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { jwtkey } = require('../keys')
const router = express.Router();
const User = mongoose.model('User');
const Item = mongoose.model('Item');
const UserItem = mongoose.model('UserItem');
const Inspiration = mongoose.model('Inspiration')
const CalendarEvent = mongoose.model('CalendarEvent')
const ItemType = mongoose.model('ItemType')
const Packing = mongoose.model('Packing')
const Color = mongoose.model('Color')
const { mogoUrl } = require('../keys');
const { route } = require('./authRoutes');
const Chat = require('../models/Chat');

router.get("/get-messages", async (req, res) => {

  const { userId, recepientId } = req.query;
  const chat_room = userId > recepientId ? userId + '_' + recepientId : recepientId + '_' + userId;
  // console.log('all messge chat room', chat_room);

  try {

    // const messages = await Chat.find({'chat_room_id': chat_room}).sort('-posted').lean();
    const messages = await Chat.find({ 'chat_room_id': chat_room }).sort({ createdAt: "desc" }).lean();

    //   const messages = await Chat.find().sort({postedon: -1}).find(function (err, sortedposts){
    //     if (err) 
    //         return res.json(sortedposts);
    //  });

    //  console.log('all mess', messages)

    //  const messages = await Chat.find({'chat_room_id': chat_room}).sort({date: 1});

    //   const messages = await Chat.find( { $query: { chat_room_id: chat_room }, $orderby: { dateAdded: -1 } }, function ( results ) {
    //     return results;
    // })


    // console.log('all messge chat room messages', messages);
    //return res.status(200).send({message:"success", data: messages});
    return res.json(messages);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" })
  }

})




router.get("/get-room-messages", async (req, res) => {

  const { room } = req.query;
  // console.log('all messge chat room', chat_room);

  try {

   // const messages = await Chat.find({ 'chat_room_id': room }).sort({ createdAt: "desc" }).lean();
    const messages = await Chat.find({ 'chat_room_id': room }).sort({ createdAt: "desc" }).lean();

    return res.json(messages);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" })
  }

})










// endpoint to send a request to a user
router.post("/friend-request", async (req, res) => {
  const { AuthId, SelectedUserId } = req.body;

  try {
    //update the recepient's friendRequests Array
    await User.findOneAndUpdate({ _id: SelectedUserId }, {
      $push: { friendRequests: AuthId },
    })

    //update the sender's SentRequests Array
    await User.findOneAndUpdate({ _id: AuthId }, {
      $push: { sentFriendRequests: SelectedUserId },
    })

    res.sendStatus(200);

  } catch (error) {

  }
});


// endpoint to show all friend request of a particular user
router.get("/friend-requests", async (req, res) => {
  try {

    const { userId } = req.query;

    const user = await User.findById(userId).populate("friendRequests", "name email avatar").lean();
    const friendRequests = user.friendRequests;
    res.json(friendRequests);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" })
  }
})

// endpoint to show all sent friend request of a particular user
router.get("/sentfriend-requests", async (req, res) => {
  try {

    const { userId } = req.query;
    // console.log('userId', req.query)

    //fetch the user document based on the user id
    // const user = await User.findById(userId).populate("friendRequests", "name email avatar").lean();
    // const friendRequests = user.friendRequests;

    const user = await User.findById(userId).populate("sentFriendRequests", "name email avatar device_token isActive updatedAt");
    // console.log('all users', user)
    const sentFriendRequests = user.sentFriendRequests;

    // console.log('sentFriendRequests', sentFriendRequests)

    res.json(sentFriendRequests);


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" })
  }
})




// Endpoint to get all users except friends
router.get('/users-except-friends/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user's friend list
    const user = await User.findById(userId).populate("sentFriendRequests", "_id");

    // console.log('my frid', user)

    // Extract the friend IDs
    const friendIds = user.sentFriendRequests.map(friend => friend._id);

    friendIds.push(userId);

    // console.log('my friendIds', friendIds)

    // Find all users who are not friends
    const usersExceptFriends = await User.find({ _id: { $nin: friendIds } })  .select('_id name');

    // console.log('my usersExceptFriends', usersExceptFriends)

    res.json(usersExceptFriends);
  } catch (error) {
    console.error('Error fetching users except friends:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});















router.get('/items', async (req, res) => {

  try {

    const type = req?.query?.type;
    var query = type ? { type: type } : {}

    const color = req?.query?.color;
    console.log(color)

    query = color ? Object.assign(query, { color: color }) : query
    console.log('query', query)
    // var query = { type: type };
    const items = await Item.find({});
    // console.log('items', items)
    return res.status(200).send({ message: 'success', data: items })

  } catch (err) {
    return res.status(422).send(err)
  }

})



router.get('/items/by-type', async (req, res) => {

  try {
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
    return res.status(200).send({ message: "success", data: typeItems });



  } catch (err) {
    return res.status(422).send(err)
  }

})


router.get('/item', async (req, res) => {

  const id = req?.query?.id;

  try {
    var query = id ? { _id: id } : {};
    const item = await Item.findOne(query);
    // console.log('items', items)
    return res.status(200).send({ message: 'success', data: item })

  } catch (err) {
    return res.status(422).send(err)
  }

})



router.get('/items/shoe', async (req, res) => {

  try {
    var query = { type: "shoe" };
    const shoes = await Item.find(query);
    return res.status(200).send({ message: 'success', data: shoes })

  } catch (err) {
    return res.status(422).send(err)
  }

})



router.post('/user/item-store', async (req, res) => {

  console.log('req.body', req.body)
  const { user_id, item_id, shoe_id, pant_id } = req.body;
  try {

    const userItems = new UserItem({ user_id, item_id, shoe_id, pant_id });
    const storeUserItems = await userItems.save();
    return res.status(200).send({ message: 'success', data: storeUserItems })

  } catch (err) {
    return res.status(422).send(err)
  }


})


//inpiration route
router.get('/inspirations', async (req, res) => {

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
  return res.status(200).send({ message: "success", data: inspirations });


})





// --------- packing route ---------
router.post('/user/packing-store', async (req, res) => {

  console.log('req.body', req.body)
  const { name, user_id, item_ids } = req.body;
  try {

    const item_ids = JSON.parse(item_ids)
    const userPacking = new Packing({ name, user_id, item_ids });
    const storeUserPacking = await userPacking.save();
    return res.status(200).send({ message: 'success', data: storeUserPacking })

  } catch (err) {
    return res.status(422).send(err)
  }


})

router.get('/user/packing', async (req, res) => {

  const userID = req?.query?.user_id;

  //console.log('param user id', userID)
  try {
    var query = { user_id: userID };
    const packings = await Packing.find(query);
    console.log('packings', packings)
    return res.status(200).send({ message: 'success', data: packings })

  } catch (err) {
    return res.status(422).send(err)
  }

})


router.get('/user/packing/delete', async (req, res) => {

  const packingID = req?.query?.packing_id;

  try {
    var query = { _id: packingID };
    const packing = await Packing.findOneAndRemove(query);
    console.log('packing', packing)
    return res.status(200).send({ message: 'success', data: 'Packing deleted successfully' })

  } catch (err) {
    return res.status(422).send(err)
  }

})



// --------- color route ---------
router.get('/colors', async (req, res) => {

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

  return res.status(200).send({ message: 'success', data: colors })

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
router.get('/item-types', async (req, res) => {


  try {
    const itemTypes = await ItemType.find({});
    console.log('itemTypes', itemTypes)
    return res.status(200).send({ message: 'success', data: itemTypes })

  } catch (err) {
    return res.status(422).send(err)
  }

})




module.exports = router