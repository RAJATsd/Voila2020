const bcrypt = require('bcryptjs')
const guideModel = require('../models/tourGuide');
const touristModel = require('../models/tourist');

exports.myProfile = async(req,res,next) => {
    res.status(200).json({message:"Info of the profile",user:req.user});
}

exports.changePassword = async (req,res,next) => {
    const newPassword = req.body.newPassword;
    const hashedPassword = await bcrypt.hash(newPassword,8);
    req.user.password = hashedPassword;
    const updatedUser = await req.user.save();
    res.status(200).json({message:"Password Changed Successfully",user:updatedUser});
}

exports.editProfile = async (req,res,next) => {
    let userModel;
    if(req.params.USER == 'GUIDE')
        userModel = guideModel;
    else
        userModel = touristModel;

    await userModel.findByIdAndUpdate({_id:req.user._id},req.body);
    const profile = await userModel.findById({_id:req.user._id});
    res.status(200).json({message:"The profile has been updated",profile:profile});
}

exports.getUserByEmail = async (req,res,next) => {
    let userModel;
    if(req.params.role == 'guide')
        userModel = guideModel;
    else
        userModel = touristModel;
    const profile = await userModel.findOne({email:req.params.email});
    res.status(200).json({message:"The is the desired profile",profile:profile});
}