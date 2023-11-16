const mongoose = require('mongoose');
const CommentReplySchema = new mongoose.Schema({
    comment_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        default:null,
        ref:"comments"
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
    reply:{
        type:String,
        required: true,
        default: null
    },

},
{
    timestamps: true
})


const CommentReply = mongoose.model('CommentReply',CommentReplySchema);

module.exports = CommentReply;