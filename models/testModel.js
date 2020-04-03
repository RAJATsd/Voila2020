const mongoose = require('mongoose');

const schema = mongoose.Schema;

const dateSchema = new schema({
    interests : [{
      type: String
    }]
});

module.exports = mongoose.model('stringArr',dateSchema);