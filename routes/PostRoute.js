const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const User = mongoose.model('User');
const Item = mongoose.model('Item');
const Chat = require('../models/Chat');
const LookLike = require('../models/LookLike');
const ShareLook = require('../models/ShareLook');
const Comment = require('../models/Comment');
const CommentReply = require('../models/CommentReply');


//  Update like for a look by its ID
router.post('/sharelooks/:lookId/like', async (req, res) => {
  try {

    const lookId = req.params.lookId;
    const authId = req.body.authId; 

     // Find and delete the LookLike entry associated with the user and look
     const deletedLookLike = await LookLike.findOneAndDelete({ look_id:lookId, user_id:authId });

     if (deletedLookLike) {
       // Decrement the like count in the Post model only if the like was found and removed
       const updatedShareLook = await ShareLook.findByIdAndUpdate(
        lookId,
         { $inc: { like: -1 } }, // Decrement likes by 1
         { new: true }
       );
       res.json(updatedShareLook);
     }else{

       // Create a new lookLike document to store the like information
        const newLookLike = new LookLike({ look_id:lookId, user_id:authId });
        await newLookLike.save();

        // Increment the like count in the ShareLook model
        const updatedShareLook = await ShareLook.findOneAndUpdate(
          { look_id:lookId},
          { $inc: { like: 1 } }, // Increment like by 1
          { new: true }
        );

        return res.json(updatedShareLook);

     }
    
  } catch (error) {
    // console.log('like update err', error)
    return res.status(500).json({ error: error.message });
  }
});


// endpoint to send a request to a user
// router.post("/friend-request", async (req, res) => {
//   const { AuthId, SelectedUserId } = req.body;

//   try {
//     //update the recepient's friendRequests Array
//     await User.findOneAndUpdate({ _id: SelectedUserId }, {
//       $push: { friendRequests: AuthId },
//     })

//     //update the sender's SentRequests Array
//     await User.findOneAndUpdate({ _id: AuthId }, {
//       $push: { sentFriendRequests: SelectedUserId },
//     })

//     res.sendStatus(200);

//   } catch (error) {

//   }
// });


// endpoint to send a request to a user
router.get("/sharelook/:lookId/comments", async (req, res) => {
  
  
  const lookId = req.params.lookId;

  console.log('comment lookid', lookId)

  try {

    // const comments = await Comment.find({'look_id': lookId}).sort([['createdAt', 'descending']]).aggregate([
    //   const comments = await Comment.aggregate([
    //   {
    //     $lookup: {
    //       from: 'commentreplies', // Assuming your collection is named 'comments'
    //       localField: '_id',
    //       foreignField: 'comment_id',
    //       as: 'replies',
    //     },
    //   },
    // ]);

    const comments = await Comment.aggregate([
      {
        $match: {
          look_id: mongoose.Types.ObjectId(lookId),
        },
      },
      {
        $sort: {
          'createdAt': -1,
        },
      },
      {
        $lookup: {
          from: 'commentreplies',
          localField: '_id',
          foreignField: 'comment_id',
          as: 'replies',
        },
      },
    ]);
    
    console.log('comments:', comments);
    
    return res.status(200).send({message:"success", data: comments});

  } catch (error) {
    res.status(400).json({ message: " Error: " + error })
  }
});



// endpoint to send a request to a user
router.post("/sharelook/:lookId/comment", async (req, res) => {
  
  
  const lookId = req.params.lookId;
  const { user_id, avatar, username, comment } = req.body;

  try {

    const commentObj = new Comment({
      look_id: lookId,
      user_id: user_id,
      username: username,
      avatar: avatar,
      comment: comment
    });
    await  commentObj.save();

    return res.sendStatus(200);

  } catch (error) {
    res.status(400).json({ message: " Error: " + error })
  }
});


router.post("/sharelook/:commentId/reply", async (req, res) => {
  
  
  const commentId = req.params.commentId;
  const { user_id, avatar, username, reply } = req.body;

  try {

    const commentReplyObj = new CommentReply({
      comment_id: commentId,
      user_id: user_id,
      username: username,
      avatar: avatar,
      reply: reply
    });
    await  commentReplyObj.save();

    return res.sendStatus(200);

  } catch (error) {
    res.status(400).json({ message: " Error: " + error })
  }
});




// router.get("/get-messages", async (req, res) => {

//   const { userId, recepientId } = req.query;
//   const chat_room = userId > recepientId ? userId + '_' + recepientId : recepientId + '_' + userId;
//   // console.log('all messge chat room', chat_room);

//   try {

//     // const messages = await Chat.find({'chat_room_id': chat_room}).sort('-posted').lean();
//     const messages = await Chat.find({ 'chat_room_id': chat_room }).sort({ createdAt: "desc" }).lean();

//     //   const messages = await Chat.find().sort({postedon: -1}).find(function (err, sortedposts){
//     //     if (err) 
//     //         return res.json(sortedposts);
//     //  });

//     //  console.log('all mess', messages)

//     //  const messages = await Chat.find({'chat_room_id': chat_room}).sort({date: 1});

//     //   const messages = await Chat.find( { $query: { chat_room_id: chat_room }, $orderby: { dateAdded: -1 } }, function ( results ) {
//     //     return results;
//     // })


//     // console.log('all messge chat room messages', messages);
//     //return res.status(200).send({message:"success", data: messages});
//     return res.json(messages);

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error!" })
//   }

// })




// router.get("/get-room-messages", async (req, res) => {

//   const { room } = req.query;
//   // console.log('all messge chat room', chat_room);

//   try {

//    // const messages = await Chat.find({ 'chat_room_id': room }).sort({ createdAt: "desc" }).lean();
//     const messages = await Chat.find({ 'chat_room_id': room }).sort({ createdAt: "desc" }).lean();

//     return res.json(messages);

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error!" })
//   }

// })










// // endpoint to send a request to a user
// router.post("/friend-request", async (req, res) => {
//   const { AuthId, SelectedUserId } = req.body;

//   try {
//     //update the recepient's friendRequests Array
//     await User.findOneAndUpdate({ _id: SelectedUserId }, {
//       $push: { friendRequests: AuthId },
//     })

//     //update the sender's SentRequests Array
//     await User.findOneAndUpdate({ _id: AuthId }, {
//       $push: { sentFriendRequests: SelectedUserId },
//     })

//     res.sendStatus(200);

//   } catch (error) {

//   }
// });













// router.get('/items', async (req, res) => {

//   try {

//     const type = req?.query?.type;
//     var query = type ? { type: type } : {}

//     const color = req?.query?.color;
//     console.log(color)

//     query = color ? Object.assign(query, { color: color }) : query
//     console.log('query', query)
//     // var query = { type: type };
//     const items = await Item.find({});
//     // console.log('items', items)
//     return res.status(200).send({ message: 'success', data: items })

//   } catch (err) {
//     return res.status(422).send(err)
//   }

// })





module.exports = router