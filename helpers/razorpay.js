let Razorpay = require('razorpay');

//require('dotenv').config();

const RazorpayConfig = {
		key_id: process.env.RAZOR_KEY_ID,
		key_secret: process.env.RAZOR_KEY_SECRET
}

var Instance = new Razorpay(RazorpayConfig);

	module.exports.config = RazorpayConfig;
	module.exports.instance  = Instance;