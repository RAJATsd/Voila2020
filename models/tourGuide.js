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
        required:true,
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
        required:true,
        type:String
    },
    experience :[{
        work : {
            type: String
        },
        startYear :{
            type: Number
        },
        duration : {
            type : String
        },
        profile : {
            type : String
        }
    }],
    peopleLimit : {
        type: Number,
        required: true
    },
    perHeadCharge : {
        type: Number,
        required: true 
    },
    perDayCharge : {
        type : Number,
        required: true
    },
    picUrl: {
        type:String
    },
    aadhaarNumber : {
        required:true,
        type:Number
    },
    interests :[{
        type:String    
    }],
    languages :[{    
      type : String
    }],
    // rating : {
    //     type:Number
    // },
    city : {
        required : true,
        type : String
    },
    state : {
        required : true,
        type : String
    },
    tokens :[{
        token : {
            type:String
        }
    }],
    // noOfRating : {
    //     type : Number
    // },
    // noOfGuiding : {
    //     type:Number
    // },
    occupied : {
        type : Boolean,
        default : false
    },
    profileStatus : {
        type : String,
        default:'pending'
    }
});


module.exports = mongoose.model('tourGuide',tourGuideSchema);