const dealModel = require('../models/deals');
const bookingModel = require('../models/bookings');

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

exports.dealOffersList = (req,res,next) => {
    bookingModel.find({guideId:req.user._id,status:'pending'})
    .then(offers => {
        res.status(302).json({message:"found these requests",offers:offers});
    })
    .catch(error=>{
        console.log(error)
    });
}

exports.dealAccept = (req,res,next) => {
    bookingModel.findOneAndUpdate({_id:req.params.bookingId},{status:'accepted'})
    .then(updatedBooking => {
        res.status(200).json({message:"booking updated",booking:updatedBooking});
    })
    .catch(error => {
        console.log(error);
    });
}

