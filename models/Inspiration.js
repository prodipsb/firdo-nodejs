const mongoose = require('mongoose');
const inspirationSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null,
        ref: 'users'
    },
    look_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:false,
        default:null,
        ref:"mylooks"
    },
    look_user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null,
        ref: 'users'
    },
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
    image:{
        type:String,
        required: false,
        default: null
    }


},
{
    timestamps: true
})


const Inspiration = mongoose.model('Inspiration',inspirationSchema);

module.exports = Inspiration;