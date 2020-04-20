const mongoose = require('mongoose');
const schema = mongoose.Schema;

const participantSchema = new schema({
    conversationId : {
        type : schema.Types.ObjectId
    },
    tourist_Id : [{
        type : schema.Types.ObjectId,
    }],
    tourGuide_Id : [{
        type : schema.Types.ObjectId,
     }],
    created_at : {
          type : Date, 
          default: Date.now 
    },
    updated_at : {
        type : Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('participants',participantSchema);


