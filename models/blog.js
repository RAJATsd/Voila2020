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
    },
    created : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('blog',blogSchema);