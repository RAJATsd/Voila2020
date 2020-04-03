const bookingModel = require('../models/bookings');
const guideModel = require('../models/tourGuide');

exports.changeBookingStatus = async () => 
{
    const a = new Date().toJSON().slice(0,10); 
    

    bookingModel.updateMany({status:'finalised',startDate:a},{status:'started'})
    .then(updatedBookings => {
        console.log(updatedBookings);
        for(booking of updatedBookings)
        {
            const updatedGuide = await guideModel.findOneAndUpdate({_id:booking.guideId},{occupied : true});
            console.log(updatedGuide); 
        }
    })
    .catch(error=>{
        console.log(error);
    });
}