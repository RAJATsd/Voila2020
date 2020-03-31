const jwt = require('jsonwebtoken');
const Tourist = require('../models/tourist');

const auth = async (req,res,next) => {
    const token = req.header('Authorization');
    const data = jwt.verify(token,'thisismysecretkeyforthishackathon2020');
    try
    {
        const user = await Tourist.findOne({email:data.email,'tokens.token':token});
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