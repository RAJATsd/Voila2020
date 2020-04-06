const mongoose = require('mongoose');

const schema = mongoose.Schema;

const dealSchema = new schema({
    places : {
        type : Array
    },
    price : {
        type : Number,
        required:true
    },
    guideId : {
        type : schema.Types.ObjectId,
        required:true
    },
    daysOfGuiding : {
        type: Number,
        required:true
    },
    favorites : [
        {type : schema.Types.ObjectId}
    ] ,
    startDate : {
        type : Date,
        required:true
    },
    endDate : {
        type: Date,
        required:true
    },
    city : {
        type : String,
        required: true
    }
});

module.exports = mongoose.model('deal',dealSchema);