const mongoose = require('mongoose');
const calendarEventSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: null
    },
    name:{
        type: String,
        required:false,
        default:null,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: null,
        ref: 'users'
    },
    type:{
        type: String,
        required:false,
        default:null,
    },
    item_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:false,
        default:null,
        ref: 'items'
    },
    details:{
        type: String,
        required:false,
        default:null,
    }

},
{
    timestamps: true
})


mongoose.model('CalendarEvent',calendarEventSchema);