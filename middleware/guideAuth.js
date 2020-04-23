const jwt = require('jsonwebtoken');
const Guide = require('../models/tourGuide');

const auth = async (req,res,next) => {
    const token = req.header('Authorization').split(' ')[1];
    
    const data = jwt.verify(token,'thisismysecretkeyforthishackathon2020');
    console.log(data);
    try
    {
        console.log("I am in");
        const user = await Guide.findOne({email:data.email,'tokens.token':token});
        if(!user)
        {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    }
    catch (error)
    {
        res.status(401).json({message : 'Not authorized to access. Please login'});
    }
}

module.exports = auth;