const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
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

},
{
    timestamps: true
})

CategorySchema.plugin(require('mongoose-slug-updater'));

const Category = mongoose.model('Category',CategorySchema);

module.exports = Category;