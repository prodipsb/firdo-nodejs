const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
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
    },
    username:{
        type:String,
        required: false,
        default: null
    },
    avatar:{
        type:String,
        required: false,
        default: 0
    },
    comment:{
        type:String,
        required: true,
        default: null
    },

},
{
    timestamps: true
})


const Comment = mongoose.model('Comment',CommentSchema);

module.exports = Comment;