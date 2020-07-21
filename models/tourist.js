const mongoose = require('mongoose');
const schema = mongoose.Schema;

const touristSchema = new schema({
    name : {
        required:true,
        type :String
    },
    gender : {
        required:true,
        type:String
    },
    // dob : {
    //     require:true,
    //     type : Date
    // },
    phoneNumber : {
        required:true,
        type: Number
    },
    age : {
        type:Number,
        required:true
    },
    email : {
        required:true,
        type:String
    },
    picUrl: {
        type:String
    },
    nationality : {
        required:true,
        type:String
    },
    occupied:{
        type:Boolean,
        default:false
    },
    password : {
        required : true,
        type : String
    },
    interests : [String],
    languages : [String],
    statusCurrent : {
        type : Boolean,
        default:true
    },
    chatList : [
        {
        receiverId: {
            type : schema.Types.ObjectId, 
            ref:'tourGuide'
        },
        msgId: {
            type : schema.Types.ObjectId, 
            ref:'Message'
        }
        }
    ],
    tokens : [{
        token : {
            type:String
        }
    }]
});


module.exports = mongoose.model('tourist',touristSchema);