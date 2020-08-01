const mongoose = require('mongoose');
const schema = mongoose.Schema;

const blogSchema = new schema({
	title : {
		required : true,
		type : String
	},
	content : {
		required : true,
		type : String
	},
	picUrl: {
        type:String
    },
    author : {
    	type : schema.Types.ObjectId,
    	ref : 'tourGuide'
    }
});

module.exports = mongoose.model('tourGuide',tourGuideSchema);