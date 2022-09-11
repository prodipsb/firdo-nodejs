const mongoose = require('mongoose');
const packingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: null
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: null,
        ref: 'users'
    },
    photo:{
        type:String,
        required: false,
        default: null
    }   ,
    item_ids:{
        type: Array,
        required:true,
        default:null,
        //ref: 'items'
    }, 

},
{
    timestamps: true
})


mongoose.model('Packing',packingSchema);