const mongoose = require('mongoose');

const schema = mongoose.Schema;

const dealSchema = new schema({
    places : [
        {
            place:String,
            date:Date
        }
    ],
    price : {
        type : Number,
        required:true
    },
    guideId : {
        type : schema.Types.ObjectId,
        required:true,
        ref:'tourGuide'
    },
    favorites : [{
        type:schema.Types.ObjectId,
        ref:'tourist'
    }],
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
    },
    groupType:{
        type:String,
        required:true
    },
    peopleLeft :{
        type : Number,
        required:true
    }
});

module.exports = mongoose.model('deal',dealSchema);