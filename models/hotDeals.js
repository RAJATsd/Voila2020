const mongoose = require('mongoose');

const schema = mongoose.Schema;

const hotDealSchema = new schema({
    dealId : {
        type:schema.Types.ObjectId,
        required:true,
        ref:'deal'
    }
});

module.exports = mongoose.model('topdeal',hotDealSchema);


