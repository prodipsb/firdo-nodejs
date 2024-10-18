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
const { find } = require('../models/Inspiration');


router.get('/itemapi', (req, res) => {
  console.log("this is test itemapi")
  res.send('this is test itemapi')
  res.end()
})


router.get('/items', async (req, res) => {

  try {


    const userId = req?.query?.user_id;
    const typeId = req?.query?.type_id;
    var query = { user_id: userId, type_id: typeId }

    const color = req?.query?.color;

    query = color ? Object.assign(query, { color: color }) : query
    const items = await Item.find(query).sort([['createdAt', 'descending']]);
    return res.status(200).send({ message: 'success', data: items })

  } catch (err) {
    return res.status(422).send(err)
  }

})



router.get('/items/by-type', async (req, res) => {

  try {

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



  return res.status(200).send({ message: "success", data: inspirations });


})



router.post('/sharelooks/save-to-inspiration', async (req, res) => {

  const { user_id, look_id, look_user_id, title, slug, image } = req.body;

  try {

    var query = { user_id, look_id, look_user_id };
    const inspiration = await Inspiration.findOne(query);


    if (inspiration) {
      return res.status(200).send({ message: 'error', data: "You have already Save this Look" })
    }

    const inspirationItem = new Inspiration({ user_id, look_id, look_user_id, title, slug, image });
    const storeInspirationItem = await inspirationItem.save();


    const inspirationPayload = {
      user_id: user_id,
      look_user_id: look_user_id,
      title: storeInspirationItem?.title,
      inspiration_id: storeInspirationItem?._id,
      photo: storeInspirationItem?.image
    }

    const item = new Item(inspirationPayload);
    const storeItem = await item.save();

    return res.status(200).send({ message: 'success', data: storeInspirationItem })

  } catch (err) {
    return res.status(422).send(err)
  }


})



// ------ calendar event -------
router.post('/user/calendar/event-store', async (req, res) => {

  console.log('req.body', req.body)
  const { date, user_id, item_id } = req.body;
  try {

    const calendarEvent = new CalendarEvent({ date, user_id, item_id });
    const storeCalendarEvent = await calendarEvent.save();
    return res.status(200).send({ message: 'success', data: storeCalendarEvent })

  } catch (err) {
    return res.status(422).send(err)
  }


})


router.post('/user/calendar/text-event-store', async (req, res) => {

  console.log('req.body', req.body)
  const { date, name, user_id, type, details } = req.body;
  try {

    const calendarEvent = new CalendarEvent({ date, name, user_id, type, details });
    const storeCalendarEvent = await calendarEvent.save();
    return res.status(200).send({ message: 'success', data: storeCalendarEvent })

  } catch (err) {
    return res.status(422).send(err)
  }


})

// router.get('/user/calendar/events', async (req, res) => {
//   const userId = req?.query?.user_id;

//   try {
//     const query = { user_id: userId };
//     console.log('my calendar query', query);

//     const myEvents = await CalendarEvent.aggregate([
//       { $match: { $expr: { $eq: ['$user_id', { $toObjectId: userId }] } } },
//       {
//         $lookup: {
//           from: 'items',
//           localField: 'item_id',
//           foreignField: '_id',
//           as: 'items'
//         }
//       },
//       {
//         $addFields: {
//           items: {
//             $cond: {
//               if: { $eq: ['$items', []] },
//               then: [],
//               else: '$items'
//             }
//           }
//         }
//       }
//     ]);

//     return res.status(200).send({ message: "success", data: myEvents });
//   } catch (err) {
//     return res.status(422).send(err);
//   }
// });


router.get('/user/calendar/events',async (req,res)=>{

  const userId = req?.query?.user_id;

  try{
    var query = { user_id:userId };
    console.log(' query', query)



  const myEvents = await CalendarEvent.aggregate([

  { $match: { $expr : { $eq: [ '$user_id' , { $toObjectId: userId } ] } } },
    {
      $lookup: {
        from: 'items',
        localField: 'item_id',
        foreignField: '_id',
        as: 'items',
      },
    },

  ]);

  return res.status(200).send({message:"success", data: myEvents});

  }catch(err){
    return res.status(422).send(err)
  }


})


// router.get('/user/calendar/day/events', async (req, res) => {

//   console.log('req.body calendar', req.query)
//   const date = req?.query?.date;
//   const userId = req?.query?.user_id;

//   try {
//     var query = { date: date, user_id: userId };
//     console.log(' query', query)

//     let targetDate = date + 'T00:00:00.000Z';
//     const myEvents = await CalendarEvent.aggregate([

//       { $match: { $expr: { $eq: ['$user_id', { $toObjectId: userId }] } } },
//       { $match: { $expr: { $eq: ['$date', { $toDate: targetDate }] } } },

//       {
//         $lookup: {
//           from: 'items',
//           localField: 'item_id',
//           foreignField: '_id',
//           as: 'items',
//         },
//       },

//       { "$unwind": "$items" },

//     ],
//       function (err, response) {
//         console.log(err, response)
//       });

//       console.log('my own events', myEvents)

//     return res.status(200).send({ message: "success", data: myEvents });

//   } catch (err) {
//     return res.status(422).send(err)
//   }


// })

router.get('/user/calendar/day/events', async (req, res) => {
  console.log('req.body calendar', req.query);
  const date = req?.query?.date;
  const userId = req?.query?.user_id;
  // return false;

  try {
    var query = { date: date, user_id: userId };
    console.log('query', query);

    let targetDate = date + 'T00:00:00.000Z';
    const myEvents = await CalendarEvent.aggregate([
      { $match: { $expr: { $eq: ['$user_id', mongoose.Types.ObjectId(userId)] } } },
      { $match: { $expr: { $eq: ['$date', new Date(targetDate)] } } },
      {
        $lookup: {
          from: 'items',
          localField: 'item_id',
          foreignField: '_id',
          as: 'items'
        }
      },
      {
        $addFields: {
          items: {
            $cond: {
              if: { $eq: ['$items', []] },
              then: [],
              else: '$items'
            }
          }
        }
      },
      { $sort: { createdAt: -1 } } // Sort events by date in descending order
    ]);

    console.log('my own events', myEvents);

    return res.status(200).send({ message: "success", data: myEvents });

  } catch (err) {
    console.error(err);
    return res.status(422).send(err);
  }
});


router.get('/user/calendar-day/event-delete', async (req, res) => {

  const eventID = req?.query?.event_id;

  console.log('delted')

  try {
    var query = { _id: eventID };
    const item = await CalendarEvent.findOneAndRemove(query);
    console.log('items', item)
    return res.status(200).send({ message: 'success', data: 'Event deleted successfully' })

  } catch (err) {
    return res.status(422).send(err)
  }

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

  return res.status(200).send({ message: 'success', data: colors })

})



router.post('/color/store', async (req, res) => {

  const { title, code } = req.body;

  // validator.body('title').custom( (value, {req}) => {
  //   console.log(value)
  //   return Color.findOne({ title:value})
  //     .then( (color) => {
  //     if (color !== null) {
  //       return Promise.reject('Color already in use');
  //     }
  //   })
  // })

  try {

    const color = new Color({ title, code });
    const storeColor = await color.save();
    return res.status(200).send({ message: 'success', data: storeColor })

  } catch (err) {
    return res.status(422).send(err)
  }


})

router.post('/color/update', async (req, res) => {

  const { id, title, code } = req.body;

  try {

    const filter = { _id: id };
    /* Set the upsert option to insert a document if no documents match
    the filter */
    const options = { upsert: true };
    // Specify the update to set a value for the plot field
    const updateDoc = {
      $set: {
        title: title,
        code: code
      },
    };

    const result = await Color.updateOne(filter, updateDoc, options);

    return res.status(200).send({ message: 'success', data: result })

  } catch (err) {
    return res.status(422).send(err)
  }


})

router.get('/color/delete', async (req, res) => {

  const colorId = req?.query?._id;

  try {
    var query = { _id: colorId };
    const color = await Color.findOneAndRemove(query);
    return res.status(200).send({ message: 'success', data: 'Color deleted successfully' })

  } catch (err) {
    return res.status(422).send(err)
  }

})



// --------- item type  ---------
router.get('/item-types', async (req, res) => {


  try {
    const itemTypes = await ItemType.find({});
    // console.log('itemTypes', itemTypes)
    return res.status(200).send({ message: 'success', data: itemTypes })

  } catch (err) {
    return res.status(422).send(err)
  }

})




module.exports = router