let Razorpay = require('razorpay');

const RazorpayConfig = {
		key_id: 'rzp_test_RWRevnPSJLk5qv',
		key_secret: 'mZld2vZGXbEUuRlihyCo6fi0'
}

var Instance = new Razorpay(RazorpayConfig);

	module.exports.config = RazorpayConfig;
	module.exports.instance  = Instance;