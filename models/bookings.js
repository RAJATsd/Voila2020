const mongoose = require('mongoose');

const schema = mongoose.Schema;

const bookingSchema = new schema({
    guideId : {
        required:true,
        type:schema.Types.ObjectId,
        ref:'tourGuide'
    },
    dealId : {
        type:schema.Types.ObjectId,
        ref:'deal'
    },
    touristId : [{
        required:true,
        type:schema.Types.ObjectId,
        ref:'tourist'
    }],
    bookingDate : {
        default: new Date().toJSON().slice(0,10),
        type:Date
    },
    price : {
        required:true,
        type:Number
    },
    noOfPeople: {
        required : true,
        type : Number 
    },
    startDate : {
        required : true,
        type : Date
    },
    endDate : { 
        required : true,
        type : Date
    },
    groupType : {
        required : true,
        type : String
    },
    rating : {
        type : Number
    },
    review : {
        type : String
    },
    reviewDate : {
        type : Date
    },
    status : {
        type : String,
        default:'PENDING'
    },
    places : [
        {
            type:String,
            required:true
        }
    ],
    tourType : {
        type:String,
        default:'personalized'
    },
    duration : {type:Number}
});

module.exports = mongoose.model('booking',bookingSchema);

