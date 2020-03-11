const mongoose = require('mongoose');

const schema = mongoose.schema;

const dealSchema = new schema({
    places : {
        type : Array
    },
    price : {
        type : Number
    },
    guideId : {
        type : Object
    },
    favourites : {
        type : Array
    }
});

module.exports = mongoose.model('deal',dealSchema);