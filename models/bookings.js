const mongoose = require('mongoose');

const schema = mongoose.Schema;

const bookingSchema = new schema({
    guideId : {
        required:true,
        type:schema.Types.ObjectId
    },
    touristId : {
        required:true,
        type:schema.Types.ObjectId
    },
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
    }
});

module.exports = mongoose.model('booking',bookingSchema);

