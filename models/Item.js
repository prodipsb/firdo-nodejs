const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: null
    },
    color:{
        type:String,
        required:false,
        default:null
    },
    inspiration:{
        type:String,
        required: false,
        default: null
    },
    type:{
        type:String,
        required: false,
        default: null
    },
    details:{
        type:String,
        required: false,
        default: null
    },
    photo:{
        type:String,
        required: true,
        default: null
    }

})


mongoose.model('Item',itemSchema);