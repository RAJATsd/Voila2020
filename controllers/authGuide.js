const Guide = require('../models/tourGuide');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postSignup = (req,res,next) => {
    const phoneNumber = req.body.phoneNumber;
    Guide.findOne({phoneNumber:phoneNumber})
    .then(result => {
        if(result)
        {
            res.json({message:"Giude Already Exist"});
        }
        else{
            const password = req.body.password;
            bcrypt.hash(password,12)
            .then(hashed=>{
                const newGuide = new Guide({
                    name : req.body.name,
                    gender : req.body.gender, 
                    password : hashed,
                    dob : req.body.dob,
                    phoneNumber : phoneNumber,
                    email : req.body.email,
                    address : req.body.address,
                    experience : req.body.experience,
                    aadhaarNumber : req.body.aadhaarNumber,
                    interests : req.body.ginterests,
                    languages : req.body.languages,
                    city : req.body.city,
                    state : req.body.state
                });    
                newGuide.save()
                .then(result =>{
                    res.status(201).json({message:"New Guide Registered Successfully",data : result});
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

    Guide.findOne({email:email})
    .then(guide => {
        if(!guide)
        {
            res.status(417).json({message:"No such guide exist,please signup if you are a new guide"});
        }
        else{
            bcrypt.compare(password,guide.password)
            .then(matchingPassword => {
                if(!matchingPassword)
                {
                    res.status(406).json({message:"Password do not match, please try again"});
                }
                else{
                    const token = jwt.sign({email:email,_id:guide._id.toString()},'thisismysecretkeyforthishackathon2020',{expiresIn:'5h'});
                    guide.tokens = guide.tokens.concat({token});
                    await guide.save();
                    res.status(200).json({message:"Person successfully logged in",token:token,guide:guide});
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

exports.getLogout = (req,res,next) => {
    try {
        res.user.tokens = req.user.tokens.filter((token)=>{
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
        await req.user.save();
        res.json({message:"logged out from all devices"});
    }
    catch(error)
    {
        res.status(500).json({message:"some error occured",error:error});
    }
}
