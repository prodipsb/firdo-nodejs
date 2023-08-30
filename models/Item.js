const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: null
    },
    color:{
        type: mongoose.Schema.Types.ObjectId,
        required:false,
        default:null,
        ref:"colors"
    },
    inspiration_id:{
      //  type: mongoose.Schema.Types.ObjectId,
      //  type:String,
        // type: mongoose.Schema.ObjectId,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inspiration',
        required: false,
        default: null
    },
    type:{
        type:String,
        required: false,
        default: null
    },
    price:{
        type:Number,
        required: false,
        default: 0
    },
    details:{
        type:String,
        required: false,
        default: null
    },
    photo:{
        type:String,
        required: true,
        default: null
    }    

},
{
    timestamps: true
})


const Item = mongoose.model('Item',itemSchema);

module.exports = Item;