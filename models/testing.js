const mongoose = require('mongoose');

const schema = mongoose.Schema;

const placeSchema = new schema({
    interest:{type:String}
});

module.exports = mongoose.model('testing',placeSchema);