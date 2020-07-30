const mongoose = require('mongoose');
const schema = mongoose.Schema;

const stateSchema = new schema({
	name : {
		type: String
	},
	info:{
		type: String
	},
	tourismCities: [
	{
		name:{
			type: String
		},
		info:{
			type: String
		}
	}

	]
});

module.exports = mongoose.model('State',stateSchema);