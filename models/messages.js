const mongoose = require('mongoose');
const schema = mongoose.Schema;

const MessageSchema = new schema({
    conversationId : {
        type : schema.Types.ObjectId ,  
        ref: 'conversation'
    },
    sender : {
        type : String
    },
    receiver : {
          type : String 
    },
    message: [
    {
       
        senderId: {
            schema.Types.ObjectId, 
            ref:'tourGuide'
        },
        receiverId: {
            schema.Types.ObjectId, 
            ref:'tourist'
        },
        sendername: {
            type : String
        }
        receivername: {
            type : String
        },
        body: {
            type : String, 
            default: ''
        }
        isRead : {
            type : Boolean,
            default: false
        }
        createdAt: {
            type : Date,
            default:Date.now()
        }
    }
    ]
});

module.exports = mongoose.model('Messages',MessageSchema);