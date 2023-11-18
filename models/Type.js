const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    category_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: null,
        ref: 'categories'
    },
    title: {
        type: String,
        required: true,
        unique: true 
    },
    slug: { type: "String", slug: "title", unique: true },
    plural:{
        type:String,
        required: false,
        default: null
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

typeSchema.plugin(require('mongoose-slug-updater'));

const Type = mongoose.model('Type',typeSchema);

module.exports = Type;