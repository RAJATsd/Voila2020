const mongoose = require('mongoose');

const schema = mongoose.Schema;

const dealSchema = new schema({
    places : [
        {
            place:{type:String},
            date:{type:Date}
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
    placeCoordinates:[{
        lat:{type:schema.Types.Decimal128},
        lng:{type:schema.Types.Decimal128}
    }],
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