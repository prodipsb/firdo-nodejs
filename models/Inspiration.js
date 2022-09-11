const mongoose = require('mongoose');
const inspirationSchema = new mongoose.Schema({
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