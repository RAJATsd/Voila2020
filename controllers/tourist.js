const guideModel = require('../models/tourGuide');
const dealsModel = require('../models/deals');
const bookingsModel = require('../models/bookings');


exports.getGuidesBySearch = async (req,res,next) => {
    const city = req.body.city;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    //noOfPeople            
    const guides = await guideModel.find({city:city});
    const deals = await dealsModel.find({endDate:{$gte:startDate}}).populate('guideId');

    res.status(302).json({guides:guides,deals:deals});
}

exports.getSelectGuide = async (req,res,next) => {
    const newBooking = new bookingsModel({
        guideId : req.params.guideId,
        touristId : req.user._id,
        price : req.body.price,
        noOfPeople : req.body.noOfPeople,
        places : req.body.places,
        startDate : req.body.startDate,
        endDate : req.body.endDate,
        duration : (req.body.endDate.getTime()-req.body.startDate.getTime())/86400000,
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
        places : deal.places,
        startDate : deal.startDate,
        endDate : deal.endDate,
        status : 'APPROVED',
        noOfPeople : req.body.noOfPeople,
        groupType : req.body.groupType,
        duration : (deal.endDate.getTime()-deal.startDate.getTime())/86400000,
        tourType : 'deal'
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

exports.myBookings = async (req,res,next) => {
    const status = req.params.status;
    const bookings = await bookingsModel.find({touristId:req.user._id,status:status}).populate('guideId');
    res.status(200).json({message:"These are the bookings found",bookings:bookings});
}

exports.myFavorites = async (req,res,next) => {
    const deals = await dealsModel.find({'favorites.favorite':req.user._id}).populate('guideId');
    res.status(200).json({message:"These are your favorite deals",deals:deals});
}

exports.editRequest = async (req,res,next) => {
    const change = req.params.change;
    const request = req.params.bookingId;
    await bookingsModel.findByIdAndUpdate({_id:request},{status:change});
    res.status(200).json({message:"Booking updated successfully"});
}

exports.specificGuideDeals = async (req,res,next) => {
    const guideId = req.params.guideId;
    const deals = await dealsModel.find({guideId:guideId}).populate('favorites');
    res.status(200).json({message:"Deals of this tour guide",deals:deals});
}