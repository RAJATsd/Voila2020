const mongoose = require('mongoose');
const schema = mongoose.Schema;


const paymentSchema = new schema({
	dealId : {
		type : schema.Types.ObjectId
	},
	touristId : {
		type : schema.Types.ObjectId
	},
	amount: {
        type:Number
    },
    email : {
    	type : String
    	
    },
    currency:{
    	type: String
    },
    created : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('payment',paymentSchema);