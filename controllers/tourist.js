const guideModel = require('../models/tourGuide');
const dealsModel = require('../models/deals');
const bookingsModel = require('../models/bookings');


exports.getGuidesBySearch = async (req,res,next) => {
    const city = req.body.city;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    //noOfPeople            
    const guides = await guideModel.find({city:city});
    const deals = await dealsModel.find({endDate:{$gte:startDate}});

    res.status(302).json({guides:guides,deals:deals});
}

exports.getSelectGuide = async (req,res,next) => {
    const newBooking = new bookingsModel({
        guideId : req.params.guideId,
        touristId : req.user._id,
        price : req.body.price,
        noOfPeople : req.body.noOfPeople,
        startDate : req.body.startDate,
        endDate : req.body.endDate,
        groupType : req.body.groupType,
        status : 'PENDING'
    });
    newBooking.save()
    .then(booking => {
        res.status(201).json({message:"Booking created successfully",booking:booking});
    })
    .catch(error => {
        console.log(error);
    });
}

exports.getDealAcceptance = async (req,res,next) => {

    const dealArray = await dealsModel.find({_id:req.params.dealId});
    const deal = dealArray[0];
    console.log(deal);
    const newBooking = new bookingsModel({
        guideId : deal.guideId,
        touristId : req.user._id,
        price : deal.price,
        startDate : deal.startDate,
        endDate : deal.endDate,
        status : 'APPROVED',
        noOfPeople : req.body.noOfPeople,
        groupType : req.body.groupType
    });
    newBooking.save()
    .then(booking=>{
        res.status(201).json({message : "Booking created successfully", booking:booking});
    })
    .catch(error => {
        console.log(error);
    });
}

exports.getSetAsFavorites = async (req,res,next) => {
    const addToFav = await dealsModel.findOneAndUpdate({_id:req.params.dealId},{$push:{'favorites.favorite':req.user._id}});
    res.status(200).json({message:"Added to favorites"});
}

