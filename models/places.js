const mongoose = require('mongoose');

const schema = mongoose.Schema;

const placeSchema = new schema({
    place : {
        type:String,
        required:true
    },
    cityId : {
        type : schema.Types.ObjectId
    },
    picUrl : {
        type : String
    }
});

module.exports = mongoose.model('place',placeSchema);