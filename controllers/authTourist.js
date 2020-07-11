const Tourist = require('../models/tourist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postSignup = (req,res,next) => {
    try{
        const phoneNumber = req.body.phoneNumber;
        Tourist.findOne({$or:
            [
                {phoneNumber:phoneNumber},
                {email:req.body.email}
            ]
        })
        .then(result => {
            if(result)
            {
                res.json({
                    success:false,
                    message:"Tourist Already Exist. Please login"
                });
            }
            else{
                const password = req.body.password;
                bcrypt.hash(password,12)
                .then(hashed=>{
                    const newTourist = new Tourist({
                        name : req.body.name,
                        gender : req.body.gender, 
                        password : hashed,
                        //dob : req.body.dob,
                        phoneNumber : phoneNumber,
                        email : req.body.email,
                        //interests : req.body.interests,
                        //languages : req.body.languages,
                        nationality:req.body.nationality,
                        age:req.body.age
                    });    
                    newTourist.save()
                    .then(result =>{
                        res.status(201).json({
                            success:true,
                            message:"New Tourist Registered Successfully",
                            data : result
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                        res.json({
                            success:false,
                            message:"INTERNAL SERVER ERROR"
                        });
                    });
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
        .catch(err=>{
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
        });
    }
}

exports.postLogin = async(req,res,next) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
    
        Tourist.findOne({email:email})
        .populate('chatList.receiverId')
        .populate('chatList.msgId')
        .then(result => {
            if(!result)
            {
                res.json({
                    success:false,
                    message:"No such Tourist exist,please signup if you are a new Tourist"
                });
            }
            else{
                bcrypt.compare(password,result.password)
                .then(matchingPassword => {
                    if(!matchingPassword)
                    {
                        res.json({
                            success:false,
                            message:"Email or Password do not match, please try again"
                        });
                    }
                    else{
                        let interests=true,languages=true;
                        if(!result.interests.length)
                        {
                            interests=false;
                        }
                        if(!result.languages.length)
                        {
                            languages=false;
                        }
                        const token = jwt.sign({
                            email:email,
                            _id:result._id.toString()},
                            'thisismysecretkeyforthishackathon2020');
                        result.tokens = result.tokens.concat({token});
                        result.save()
                        .then(saved => {
                            res.status(200).json({
                                success:true,
                                message:"Person successfully logged in",
                                token:token,
                                Tourist:result,
                                interests,
                                languages
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
        });
    }
}

exports.getLogout = async (req,res,next) => {
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token;
        });
        await req.user.save();
        res.json({
            success:true,
            message:"Successfully logged out"
        });
    }
    catch(error) {
        console.log(error)
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
                message:"Successfully logged out from all devices"
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
    catch(error)
    {
        res.json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        });
    }
}       
