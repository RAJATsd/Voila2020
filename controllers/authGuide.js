const Guide = require('../models/tourGuide');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const s3Instance = require('../helpers/aws').s3;

let urlForPic=null;
if(process.env.PORT){
    urlForPic='https://voila2020.herokuapp.com/profileImages/';
}
else{
    urlForPic='localhost:3000/profileImages/';
}

const uploadToS3 = (bucketParams) => {
    return new Promise((resolve,reject)=>{
        s3Instance.upload(bucketParams,(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data);        
            }
        });
    });
}

exports.postSignup = async(req,res,next) => {
    try{
        const userData = JSON.parse(req.body.data);
        const phoneNumber = userData.phoneNumber;
        const profilePic = req.file;
        const singleGuide = await Guide.findOne({phoneNumber:phoneNumber});
        if(singleGuide)
        {
            res.json({
                success:false,
                message:"Guide Already Exist. Please login"
            });
            return;
        }
        let picUrl = null;
        const password = userData.password;
        const hashed = await bcrypt.hash(password,8);
        if(profilePic){
            const paramsForS3 = {
                Bucket:process.env.AWS_BUCKET_NAME,
                Key : Date.now()+req.file.originalname,
                Body:req.file.buffer
            }
            picUrl = await uploadToS3(paramsForS3).Location;
        }
        const newGuide = new Guide({
            name : userData.name,
            gender : userData.gender, 
            password : hashed,
            dob : userData.dob,
            phoneNumber : phoneNumber,
            email : userData.email,
            address : userData.address,
            experience : userData.experience,
            peopleLimit : userData.peopleLimit,
            perHeadCharge : userData.perHeadCharge,
            perDayCharge : userData.perDayCharge,
            picUrl : picUrl,
            aadhaarNumber : userData.aadhaarNumber,
            interests : userData.interests,
            languages : userData.languages,
            city : userData.city,
            state : userData.state
        });    
        const savedGuide = await newGuide.save();
        res.status(201).json({
            success:true,
            message:"New Guide Registered Successfully",
            data : savedGuide
        });
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message : "INTERNAL SERVER ERROR"
        })
    }
}

exports.postLogin = async(req,res,next) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
    
        Guide.findOne({email:email})
        .populate('chatList.receiverId')
        .populate('chatList.msgId')
        .then(guide => {
            if(!guide)
            {
                res.json({
                    success:false,
                    message:"Email or Password incorrect ,please signup if you are a new guide"
                });
            }
            else{
                bcrypt.compare(password,guide.password)
                .then(matchingPassword => {
                    if(!matchingPassword)
                    {
                        res.json({
                            success:false,
                            message:"Email or Password incorrect ,please signup if you are a new guide"
                        });
                    }
                    else{
                        if(guide.profileStatus==='PENDING'||guide.profileStatus==='REJECTED'){
                            res.json({
                                success:false,
                                status:guide.profileStatus,
                                message:'Your profile has not been approved'
                            })
                        }
                        else{
                            const token = jwt.sign({email:email,_id:guide._id.toString()},'thisismysecretkeyforthishackathon2020');
                            guide.tokens = guide.tokens.concat({token});
                            guide.save()
                            .then(saved => {
                                res.status(200).json({
                                    success:true,
                                    message:"Person successfully logged in",
                                    token:token,
                                    guide:guide
                                });
                            })
                            .catch(errorWhileSave => {
                                console.log(errorWhileSave);
                                res.json({
                                    success:false,
                                    message:"INTERNAL SERVER ERROR"
                                });
                            });
                        }    
                    }
                })
                .catch(err=>{
                    console.log(err);
                    res.json({
                        success:false,
                        message:"INTERNAL SERVER ERROR"
                    });
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                success:false,
                message:"INTERNAL SERVER ERROR"
            });        
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

exports.getLogout = async (req,res,next) => {
    try 
    {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token;
        });
        await req.user.save();
        res.json({
            success:true,
            message:"Successfully logged out"
        });
    }
    catch(error){
        console.log(error);
        res.json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        });
    }
}

exports.getLogoutAll = (req,res,next) => {
    try
    {
        req.user.tokens.splice(0,req.user.tokens.length);
        req.user.save()
        .then(saved => {
            res.json({
                success:true,
                message:"logged out from all devices"
            });
        })
        .catch(errorWhileSave => {
            console.log(errorWhileSave);
            res.json({
                success:false,
                message:'INTERNAL SERVER ERROR'
            })
        });
    }
    catch(error)
    {
        res.json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        });
    }
}
