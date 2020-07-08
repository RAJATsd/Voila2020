const mongoose = require('mongoose');

const schema = mongoose.Schema;

const placeSchema = new schema({
    datings : {
        type : Date
    },
    interest:{type:Number}
});

module.exports = mongoose.model('testing',placeSchema);