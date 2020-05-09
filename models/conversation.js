const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ConversationSchema = new schema({
    participants : [
    {
        senderId: {
            schema.Types.ObjectId, 
            ref:'tourGuide'
        },
        receiverId: {
            schema.Types.ObjectId, 
            ref:'tourist'
        }
    }
    ]
});

module.exports = mongoose.model('Conversation',ConversationSchema);