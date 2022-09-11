const mongoose = require('mongoose');
const userItemSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        default: null
    },
    item_id:{
        type:String,
        required:false,
        default:null
    },
    shoe_id:{
        type:String,
        required: false,
        default: null
    },
    pant_id:{
        type:String,
        required: false,
        default: null
    }

},
{
    timestamps: true
})


mongoose.model('UserItem',userItemSchema);