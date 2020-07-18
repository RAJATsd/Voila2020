const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postSignup = (req,res,next) => {
    try{
        const phoneNumber = req.body.phoneNumber;
        Admin.findOne({$or:
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
                    message:"Admin Already Exist. Please login"
                });
            }
            else{
                const password = req.body.password;
                bcrypt.hash(password,12)
                .then(hashed=>{
                    const newAdmin = new Admin({
                        name : req.body.name, 
                        password : hashed,
                        phoneNumber : phoneNumber,
                        email : req.body.email
                    });    
                    newAdmin.save()
                    .then(result =>{
                        res.status(201).json({
                            success:true,
                            message:"New Admin Registered Successfully",
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
    
        Admin.findOne({email:email})
        .then(result => {
            if(!result)
            {
                res.json({
                    success:false,
                    message:"No such Admin exist"
                });
            }
            else{
                bcrypt.compare(password,result.password)
                .then(matchingPassword => {
                    if(!matchingPassword)
                    {
                        res.json({
                            success:false,
                            message:"Something is wrong, please try again"
                        });
                    }
                    else{
                        const token = jwt.sign({
                            email:email,
                            _id:result._id.toString()},
                            'thisismysecretkeyforthishackathon2020');
                        result.tokens = result.tokens.concat({token});
                        result.save()
                        .then(saved => {
                            res.status(200).json({
                                success:true,
                                message:"Admin successfully logged in",
                                token:token
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
