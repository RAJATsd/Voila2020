const stateModel = require('../models/state');

exports.findState = async (req,res,next) => {
	try{
	const state = await stateModel.findOne({
		name : req.params.name
	});
	console.log(state);
	res.status(200).json({
            success:true,
            message:"this is the desired state",
            state:state
        });    
    }
    catch(e){
        console.log(e);
        res.json({
            success: false,
            error:e
        });        
    }
}

// exports.addState = async (req,res,next) => {
// 	const newState = new stateModel({
// 		name : req.body.name,
// 		info : req.body.info
// 	});
// 	newState.save()	
// 	.then(state => {
//                 res.status(201).json({
//                     success:true,
//                     message:"New State Created",
//                     state:state
//                 });
//             })
//             .catch(error => {
//                 console.log(error);
//                 res.json({
//                     success : false,
//                     error : error
//                 });
//             });
// }

// exports.addCity = async (req,res,next) => {
	
// 		const state = await stateModel.findById({
// 			_id:req.params.id
// 		});
// 		console.log(state);
// 		state.tourismCities.push(
// 		{
// 			name : req.body.name,
// 			info : req.body.info
// 		});
// 		state.save()
// 		.then(state => {
//                 res.status(201).json({
//                     success:true,
//                     message:"State Updated",
//                     state:state
//                 });
//             })
//             .catch(error => {
//                 console.log(error);
//                 res.json({
//                     success : false,
//                     error : error
//                 });
//             });
	
// }	
