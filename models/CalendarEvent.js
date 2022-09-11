const mongoose = require('mongoose');
const calendarEventSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: null
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: null,
        ref: 'users'
    },
    item_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:false,
        default:null,
        ref: 'items'
    }

},
{
    timestamps: true
})


mongoose.model('CalendarEvent',calendarEventSchema);