const mongoose = require('mongoose');

const schema = mongoose.Schema;

const placeSchema = new schema({
    datings : {
        type : Date
    }
});

module.exports = mongoose.model('testing',placeSchema);