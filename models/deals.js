const mongoose = require('mongoose');

const schema = mongoose.Schema;

const dealSchema = new schema({
    places : [{type : String}],
    price : {
        type : Number,
        required:true
    },
    duration :{type:Number},
    guideId : {
        type : schema.Types.ObjectId,
        required:true,
        ref:'tourGuide'
    },
    favorites : [
        {
            favorite: {
            type : schema.Types.ObjectId,
            ref:'tourist'}
        }
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