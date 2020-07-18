const mongoose = require('mongoose');
const schema = mongoose.Schema;

const adminSchema = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    tokens : [{
        token : {
            type:String
        }
    }]
});

module.exports = mongoose.model('admin',adminSchema);