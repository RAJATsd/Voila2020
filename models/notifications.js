const mongoose = require('mongoose');

const schema = mongoose.Schema;

const notificationSchema = new schema({
    name : {
        type : String,
        required:true
    },
    doerId : {
        type:schema.Types.ObjectId
    },
    actionId : {
        type:schema.Types.ObjectId
    },
    recieverId:{
        type:schema.Types.ObjectId
    },
    notificationText:{
        type:String
    },
    isRead:{
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model('notification',notificationSchema);