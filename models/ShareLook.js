const mongoose = require('mongoose');
const shareLookSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        default:null,
        ref:"users"
    },
    look_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        default:null,
        ref:"mylooks"
    },
    like:{
        type:Number,
        required: false,
        default: 0
    },
    dislike:{
        type:Number,
        required: false,
        default: 0
    },
    comments:{
        type:String,
        required: false,
        default: null
    }

},
{
    timestamps: true
})


const ShareLook = mongoose.model('ShareLook',shareLookSchema);

module.exports = ShareLook;