const mongoose = require('mongoose');
const myLookSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        default:null,
        ref:"users"
    },
    title: {
        type: String,
        required: false,
        default: null
    },
    details:{
        type:String,
        required:false,
        default:null
    },
    photos:{
        type:Array,
        required: false,
        default: null
    }    

},
{
    timestamps: true
})


const MyLook = mongoose.model('MyLook',myLookSchema);

module.exports = MyLook;