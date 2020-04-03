const dealModel = require('../models/deals');
const bookingModel = require('../models/bookings');
const updationMiddleware = require('../middleware/scheduleFunc');

exports.addDeal = (req,res,next) => {
    const newDeal = new dealModel({
        places : req.body.places,
        price : req.body.price,
        guideId : req.user._id,
        daysOfGuiding : req.body.daysOfGuiding,
        startDate : req.body.startDate,
        endDate : req.body.endDate,
        city : req.body.city
    });
    newDeal.save()
    .then(deal => {
        res.status(201).json({message:"New Deal Created",deal:deal});
    })
    .catch(error => {
        console.log(error);
    });
}

exports.showDeal = async (req,res,next) => {
    const deals = await dealModel.find({guideId:req.user._id});
    res.status(200).json({message:"these are the deals",deals:deals});
}

exports.showOffers = (req,res,next) => {
    const pendingBookings = bookingModel.find({guideId:req.user._id,status:'pending'});
    res.status(200).json({message:"found these offers",offers:pendingBookings});
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

