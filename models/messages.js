const mongoose = require('mongoose');
const schema = mongoose.Schema;

const messagesSchema = new schema({
    conversationId : {
        type : schema.Types.ObjectId
    },
    sender_Id : {
        type : schema.Types.ObjectId,
    },
    created_at : {
          type : Date, 
          default: Date.now 
    },
    message: [{
        text: String,
        receivedBy: {
            type: schema.Types.ObjectId,
        }
    }]
});

module.exports = mongoose.model('messages',messagesSchema);