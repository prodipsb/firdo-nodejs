const mongoose = require('mongoose');
const LookFollowSchema = new mongoose.Schema({
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


const LookFollow = mongoose.model('LookFollow',LookFollowSchema);

module.exports = LookFollow;