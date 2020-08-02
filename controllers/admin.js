const answerModel = require('../models/answers');
const guideModel = require('../models/tourGuide');
const reportModel = require('../models/adminReports');

exports.getAllPendingRequests = async (req,res,next) => {
    try{
        const status = req.params.status;
        const guides = await guideModel.find({profileStatus:status});
        res.json({
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
            res.json({
                success:true,
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

exports.getAllReports = async (req,res,next) => {
    try{
        const allReports = await reportModel.find({status:'UNRESOLVED'});
        res.json({
            success:true,
            message:"Here are all the reports",
            reports:allReports
        });
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        })
    }
}

