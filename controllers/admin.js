const answerModel = require('../models/answers');
const guideModel = require('../models/tourGuide');

exports.getAllPendingRequests = async (req,res,next) => {
    const guides = await guideModel.find({profileStatus:'pending'});
    for(guide of guides)
    {
        const answer = answerModel.findOne({guideId:guide._id});
        if(answer)
            guide.answers = answer;
    }
    res.status(200).json({message:"found these answers",guides:guides});
}

exports.decideGuide = async (req,res,next) => {
    guideModel.findOneAndUpdate({_id:req.params.guideId},{profileStatus:req.params.finalStatus})
    .then(updatedGuide => {
        res.status(200).json({message:"guide successfully updated",guide:updatedGuide});
    })
    .catch(error => {
        console.log(error);
    });
}

