const mongoose = require('mongoose');

const itemTypeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: null
    },
    slug:{
        type:String,
        required:false,
        default:null
    },
    plural:{
        type:String,
        required: false,
        default: null
    }

},
{
    timestamps: true
})


const Item = mongoose.model('ItemType',itemTypeSchema);

module.exports = Item;