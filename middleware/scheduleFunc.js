const bookingModel = require('../models/bookings');
const guideModel = require('../models/tourGuide');

exports.changeBookingStatus = async () => 
{
    const a = new Date().toJSON().slice(0,10); 
    

    bookingModel.updateMany({$or:[{status:'APPROVED'},{status:'PENDING'}],endDate:{$lt:a}},{status:'NO ACTION'})
    .then(updatedBookings => {
        console.log(updatedBookings);
    })
    .catch(error=>{
        console.log(error);
    });
}