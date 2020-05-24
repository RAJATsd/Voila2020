const Tourist = require('../models/tourist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postSignup = (req,res,next) => {
    const phoneNumber = req.body.phoneNumber;
    Tourist.findOne({phoneNumber:phoneNumber})
    .then(result => {
        if(result)
        {
            res.json({message:"Guide Already Exist"});
        }
        else{
            const password = req.body.password;
            bcrypt.hash(password,12)
            .then(hashed=>{
                const newTourist = new Tourist({
                    name : req.body.name,
                    gender : req.body.gender, 
                    password : hashed,
                    dob : req.body.dob,
                    phoneNumber : phoneNumber,
                    email : req.body.email,
                    interests : req.body.interests,
                    languages : req.body.languages,
                    nationality:req.body.nationality,
                });    
                newTourist.save()
                .then(result =>{
                    res.status(201).json({message:"New Tourist Registered Successfully",data : result});
                })
                .catch(err=>{
                    console.log(err);
                });
            })
            .catch(err=>{
                console.log(err);
            });
        }
    })
    .catch(err=>{
        console.log(err);
    });
}

exports.postLogin = async(req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;

    Tourist.findOne({email:email})
    .populate('chatList.receiverId');
    .populate('chatList.msgId');
    .then(result => {
        if(!result)
        {
            res.status(417).json({message:"No such Tourist exist,please signup if you are a new Tourist"});
        }
        else{
            bcrypt.compare(password,result.password)
            .then(matchingPassword => {
                if(!matchingPassword)
                {
                    res.status(406).json({message:"Password do not match, please try again"});
                }
                else{
                    const token = jwt.sign({email:email,_id:result._id.toString()},'thisismysecretkeyforthishackathon2020',{expiresIn:'5h'});
                    result.tokens = result.tokens.concat({token});
                    result.save()
                    .then(saved => {
                        res.status(200).json({message:"Person successfully logged in",token:token,Tourist:result});
                    })
                    .catch(errorWhileSave => {
                        console.log(errorWhileSave);
                    });
                }
            })
            .catch(err=>{
                console.log(err);
            });
        }
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getLogout = async (req,res,next) => {
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token;
        });
        await req.user.save();
        res.json({message:"Successfully logged out"});
    }
    catch(error) {
        res.status(500).json({message:"some error occured",error:error});
    }
}

exports.getLogoutAll = (req,res,next) => {
    try
    {
        req.user.tokens.splice(0,req.user.tokens.length);
        req.user.save()
        .then(saved => {
            res.json({message:"Successfully logged out from all devices"});
        })
        .catch(errorWhileSave => {
            console.log(errorWhileSave);
        });
    }
    catch(error)
    {
        res.status(500).json({message:"some error occured",error:error});
    }
}       
