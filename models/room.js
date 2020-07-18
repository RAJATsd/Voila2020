const mongoose = require('mongoose');

const schema = mongoose.Schema;

const roomSchema = new schema({
	guideId : {
        type : schema.Types.ObjectId,
        required: true,
        ref:'tourGuide'
    },
    people : {
    	type: Number,
    	required: true,
    },
    touristId : [{
        type:schema.Types.ObjectId,
        required:true,
        ref:'tourist'
    }],
    dealId : {
    	type: schema.Types.ObjectId,
    	ref: 'deal'
    },
    created : {
    	type: Date,
    	default: Date.now
    },
    name : {
    	type: String,
    	required: true,
    	default : ''
    }
});

module.exports = mongoose.model('room',roomSchema); 