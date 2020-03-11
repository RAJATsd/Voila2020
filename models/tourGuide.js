const mongoose = require('mongoose');

const schema = mongoose.Schema;

const tourGuideSchema = new schema({
    name : {
        required:true,
        type :String
    },
    gender : {
        required:true,
        type:String
    },
    password : {
        required : true,
        type : String
    },
    dob : {
        require:true,
        type : Date
    },
    phoneNumber : {
        required:true,
        type: Number
    },
    email : {
        required:true,
        type:String
    },
    address : {
        require:true,
        type:String
    },
    picUrl: {
        required:true,
        type:String
    },
    aadhaarNumber : {
        required:true,
        type:Number
    },
    interests : {
        required:true,
        type :Array
    },
    languages : {
        required:true,
        type:Array
    },
    rating : {
        type:Number
    },
    city : {
        required : true,
        type : String
    },
    state : {
        required : true,
        type : String
    }
    ,
    noOfRating : {
        type : Number
    },
    noOfGuiding : {
        type:Number
    },
    statusCurrent : {
        type : Boolean,
        default:false
    }
});


exports.default = mongoose.model('tourGuide',tourGuideSchema);