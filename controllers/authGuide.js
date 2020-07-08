const Guide = require('../models/tourGuide');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postSignup = (req,res,next) => {
    try{
        const userData = JSON.parse(req.body.data);
        const phoneNumber = userData.phoneNumber;
        // const profilePic = req.file;
        // if(!profilePic)
        // {
        //     return res.json({message:"no file uploaded"});
        // }
        Guide.findOne({phoneNumber:phoneNumber})
        .then(result => {
            if(result)
            {
                res.json({
                    success:false,
                    message:"Guide Already Exist. Please login"
                });
            }
            else{
                //const picUrl = 'localhost:3000/profileImages/'+profilePic.filename;
                const password = userData.password;
                bcrypt.hash(password,8)
                .then(hashed=>{
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
                        //picUrl : picUrl,
                        aadhaarNumber : userData.aadhaarNumber,
                        interests : userData.interests,
                        languages : userData.languages,
                        city : userData.city,
                        state : userData.state
                    });    
                    newGuide.save()
                    .then(result =>{
                        res.status(201).json({
                            success:true,
                            message:"New Guide Registered Successfully",
                            data : result
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                        res.json({
                            success:false,
                            message:"INTERNAL SERVER ERROR"
                        })
                    });
                })
                .catch(err=>{
                    console.log(err)
                    res.json({
                        success:false,
                        message:'INTERNAL SERVER ERROR'
                    });
                });
            }
        })
        .catch(err=>{
            console.log(err);
            res.json({
                success:false,
                message:'INTERNAL SERVER ERROR'
            });
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
                        const token = jwt.sign({email:email,_id:guide._id.toString()},'thisismysecretkeyforthishackathon2020',{expiresIn:'5h'});
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
