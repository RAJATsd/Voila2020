const mongoose = require('mongoose');
const schema = mongoose.Schema;

const conversationSchema = new schema({
    creatorId : {
        type : schema.Types.ObjectId
    },
    title : {
        type : String,
    },
    created_at : {
          type : Date, 
          default: Date.now 
    },
    updated_at : {
        type : Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('conversation',conversationSchema);