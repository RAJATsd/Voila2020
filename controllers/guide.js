const dealModel = require('../models/deals');
const bookingModel = require('../models/bookings');
const updationMiddleware = require('../middleware/scheduleFunc');
const Guide = require('../models/tourGuide');

exports.addDeal = async (req,res,next) => {
    const newDeal = new dealModel({
        places : req.body.places,
        price : req.body.price,
        guideId : req.user._id,
        
        startDate : req.body.startDate,
        endDate : req.body.endDate,
        city : req.body.city,
        state:req.body.state,
        peopleLimit:req.body.peopleLimit
    });
    newDeal.save()
    .then(deal => {
        deal.duration = (deal.endDate.getTime()-deal.startDate.getTime())/86400000;
        deal.save()
        .then(savedDeal =>{
            req.user.deals.push(savedDeal._id);
            req.user.save()
            .then(changedUser => {
                res.status(201).json({message:"New Deal Created",deal:savedDeal});
            })
            .catch(errors=>console.log(errors));            
        })
        .catch(error=>console.log(error));
    })
    .catch(error => {
        console.log(error);
    });
}

exports.showDeal = async (req,res,next) => {
    const deals = await dealModel.find({guideId:req.user._id}).populate('guideId');
    res.status(200).json({message:"these are the deals",deals:deals});
}

exports.showOffers = async (req,res,next) => {
    const status = req.params.status;
    const Bookings = await bookingModel.find({guideId:req.user._id,status:status}).populate('touristId');
    res.status(200).json({message:"found these offers",bookings:Bookings});
}

exports.bookingResponse = (req,res,next) => {
    bookingModel.findOneAndUpdate({_id:req.params.bookingId},{status:req.params.response})
    .then(updatedBooking => {
        res.status(200).json({message:"booking updated",booking:updatedBooking});
        updationMiddleware.changeBookingStatus;
    })
    .catch(error => {
        console.log(error);
    });
}

exports.editProfile = async (req,res,next) => {
  await Guide.findByIdAndUpdate({_id:req.user._id},req.body);
  const profile = await Guide.findById({_id:req.user._id});
  res.status(200).json({message:"The pofile has been updated",profile:profile});
}

exports.dealInfo = async (req,res,next) => {
    const deal = await dealModel.findById({_id:req.params.dealId}).populate('guideId');
    res.status(200).json({message:"This is the info of the deal",deal:deal});
}