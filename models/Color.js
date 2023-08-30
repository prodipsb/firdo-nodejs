const mongoose = require('mongoose');
const colorSchema = new mongoose.Schema({
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
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'items' }]

},
{
    timestamps: true
})


const Color = mongoose.model('Color',colorSchema);

module.exports = Color;