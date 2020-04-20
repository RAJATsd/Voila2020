const mongoose = require('mongoose');

const schema = mongoose.Schema;

const dealSchema = new schema({
    places : [{type : String}],
    price : {
        type : Number,
        required:true
    },
    guideId : {
        type : schema.Types.ObjectId,
        required:true
    },
    favorites : [
        {type : schema.Types.ObjectId}
    ],
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
    },
    state : {
        type : String,
        required: true
    },
    peopleLimit: {
        type : Number,
        required : true
    }
});

module.exports = mongoose.model('deal',dealSchema);