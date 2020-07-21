const answerModel = require('../models/answers');
const guideModel = require('../models/tourGuide');

exports.getAllPendingRequests = async (req,res,next) => {
    try{
        const guides = await guideModel.find({profileStatus:'PENDING'});
        res.status(200).json({
            success:true,
            message:"found these guides and answers",
            guides:guides
        });
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        });
    }
}

exports.decideGuide = async (req,res,next) => {
    try{
        guideModel.findOneAndUpdate({_id:req.params.guideId},{profileStatus:req.params.finalStatus})
        .then(updatedGuide => {
            res.status(200).json({
                success:false,
                message:"guide successfully updated",
                guide:updatedGuide
            });
        })
        .catch(error => {
            console.log(error);
            res.json({
                success:false,
                message:"ERROR WHILE UPDATING"
            })
        });
    
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        });
    }
}

