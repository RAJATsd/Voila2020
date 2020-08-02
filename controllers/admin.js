const answerModel = require('../models/answers');
const guideModel = require('../models/tourGuide');
const reportModel = require('../models/adminReports');
const touristModel = require('../models/tourist');

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

exports.specificUserOfReport = async (req,res,next) => {
    try{
        const report = await reportModel.findOne({_id:req.params.reportId});
        let user;
        if(report.userType==='GUIDE'){
            user = await guideModel.findOne({_id:report.reporterId});
        }
        else{
            user = await touristModel.findOne({_id:report.reporterId})
        }
        res.json({
            success:true,
            user:user
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

exports.decideReport = async (req,res,next) => {
    try{
        await reportModel.findByIdAndUpdate({_id:req.params.reportId},{status:req.params.status});
        res.json({
            success:true,
            message:`Successfully changed the status of the report to ${req.params.status}`
        });
    }
    catch(e){
        console.log(e)
        res.json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        });
    }
}