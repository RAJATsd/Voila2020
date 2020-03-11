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
    picUrl: {
        required:true,
        type:String
    },
    nationality : {
        required:true,
        type:String
    },
    password : {
        required : true,
        type : String
    },
    interests : {
        required:true,
        type :Array
    },
    languages : {
        required:true,
        type:Array
    },
    statusCurrent : {
        type : Boolean,
        default:true
    }
});


exports.default = mongoose.model('tourist',touristSchema);