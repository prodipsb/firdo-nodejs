const mongoose = require('mongoose');
const LookLikeSchema = new mongoose.Schema({
    look_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        default:null,
        ref:"mylooks"
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        default:null,
        ref:"users"
    }
},
{
    timestamps: true
})


const LookLike = mongoose.model('LookLike',LookLikeSchema);

module.exports = LookLike;