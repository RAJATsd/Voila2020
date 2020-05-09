const guideModel = require('../models/tourGuide');
const dealsModel = require('../models/deals');
const bookingsModel = require('../models/bookings');

exports.searchResult = async (req,res,next) => {
    const guides = await guideModel.find({city:req.body.city}).populate('deals');
    const deals = await dealsModel.find({city:req.body.city}).where('startDate').gte(req.body.startDate).populate('guideId');
    res.status(200).json({message:"These are the guides and the deals",guides:guides,deals:deals});
}

exports.specificGuideDetails = async (req,res,next) => {
    const guide = await guideModel.findOne({_id:req.params.guideId}).populate('deals');
    res.status(200).json({message:"The details of the guide",guide:guide});
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
        groupType : req.body.groupType,
        status : 'PENDING'
    });
    newBooking.save()
    .then(booking => {
        booking.duration = (booking.endDate.getTime()-booking.startDate.getTime())/86400000,
        booking.save()
        .then(savedBooking => res.status(200).json({message:"Booking created successfully",booking:savedBooking}))
        .catch(error => console.log(error));
    })
    .catch(error => {
        console.log(error);
    });
}

exports.getDealAcceptance = async (req,res,next) => {

    const dealArray = await dealsModel.find({_id:req.params.dealId});
    const deal = dealArray[0];
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
        duration : deal.duration,
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
    const deal = await dealsModel.findById({_id:req.params.dealId});
    const favorite =  req.user._id;
    deal.favorites = deal.favorites.concat({favorite});
    deal.save()
    .then(savedDeal => {
        res.status(200).json({message:"Deal added as favorite",deal:savedDeal});
    })
    .catch(error => console.log(error));
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