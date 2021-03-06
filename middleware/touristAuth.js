const jwt = require('jsonwebtoken');
const Tourist = require('../models/tourist');

const auth = async (req,res,next) => {
    try
    {
        const token = req.header('Authorization');//.split(' ')[1];
        const data = jwt.verify(token,'thisismysecretkeyforthishackathon2020');
        const user = await Tourist.findOne({email:data.email,'tokens.token':token})
         
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