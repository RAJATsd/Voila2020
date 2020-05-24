const Guide = require('../models/tourGuide');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postSignup = (req,res,next) => {
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
            res.json({message:"Guide Already Exist"});
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
    .populate('chatList.receiverId');
    .populate('chatList.msgId');
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
                    guide.save()
                    .then(saved => {
                        res.status(200).json({message:"Person successfully logged in",token:token,guide:guide});
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
    try 
    {
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
            res.json({message:"logged out from all devices"});
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
