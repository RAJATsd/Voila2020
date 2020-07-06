const desitnationModel = require('../models/destinations');
const hotDealModel = require('../models/hotDeals');

exports.getAllDestInfo = (req,res,next) => {
    try{
        desitnationModel.find()
        .then(result => {
            res.json({
                success:true,
                data: result
            });
        })
        .catch(err=>{
            console.log(err);
            res.json({
                success:false,
                error: 'ERROR WHILE FETCHING DETAILS'
            });
        });
    }
    catch(e){
        console.log(e);
        res.json({
            success : false,
            error : 'INTERNAL SERVER ERROR'
        })
    }
}

exports.getAllHotDeals = (req,res,next) => {
    try{
        hotDealModel.find().populate('dealId')
        .then(result => {
            res.json({
                success:true,
                data:result
            });
        })
        .catch(err=>{
            console.log(err);
            res.json({
                success:false,
                error:'ERROR WHILE FETCHING FROM DB'
            });
        })
    }
    catch(e){
        console.log(e);
        res.json({
            success : false,
            error : 'INTERNAL SERVER ERROR'
        })
    }
}