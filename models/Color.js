const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: null
    },
    slug: { type: "String", slug: "title", unique: true },
    code: {
        type: String,
        required: false,
        default: null
    },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'items' }]

},
{
    timestamps: true
})

colorSchema.plugin(require('mongoose-slug-updater'));

const Color = mongoose.model('Color',colorSchema);


module.exports = Color;