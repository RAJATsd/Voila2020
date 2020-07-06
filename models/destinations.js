const mongoose = require('mongoose');

const schema = mongoose.Schema;

const destinationSchema = new schema({
    state : {
        type:String,
        required:true
    },
    cities : {
        type:Number,
        required:true
    },
    guides :{
        type:Number,
        required:true
    },
    tourists :{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model('destination',destinationSchema);