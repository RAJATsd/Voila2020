const mongoose = require('mongoose');
const schema = mongoose.Schema;

const answerSchema = new schema({
    guideId : {
        type : schema.Types.ObjectId
    },
    answerOne : {
        type : String,
        required : true 
    },
    answerTwo : {
        type : String,
        required : true
    },
    answerThree : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('answer',answerSchema);