const guideModel = require('../models/tourGuide');
const dealsModel = require('../models/deals');
const bookingsModel = require('../models/bookings');


exports.getGuidesBySearch = async (req,res,next) => {
    try{
        const city = req.body.city;
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const noOfPeople = req.body.noOfPeople;           
        const guides = await guideModel.find({city:city});
        const deals = await dealsModel.find({endDate:{$gte:startDate},peopleLeft:{$gte:noOfPeople}}).populate('guideId');
        res.json({
            success:true,
            guides:guides,
            deals:deals
        });    
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            error:e
        });
    }
}

exports.getSelectGuide = async (req,res,next) => {
    try{
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
            .catch(error => {
                console.log(error)
                res.json({
                    success:false,
                    error:error
                });
            });
        })
        .catch(error => {
            console.log(error);
            res.json({
                success:false,
                error:error
            });
        });
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            error:e
        });
    }
}

exports.getDealAcceptance = async (req,res,next) => {
    try{
        const existingBooking = await bookingsModel.findOne({dealId:req.params.dealId});
        const deal = await dealsModel.findOne({_id:req.params.dealId});
        if(!existingBooking){
            const newBooking = new bookingsModel({
                guideId : deal.guideId,
                dealId : req.params.dealId,
                touristId : [req.user._id],
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
                res.status(201).json({
                    success:true,
                    message : "Booking created successfully", 
                    booking:booking
                });
            })
            .catch(error => {
                console.log(error);
                res.json({
                    success:false,
                    error:"INTERNAL SERVER ERROR"
                })
            });
        }
        else{
            existingBooking.touristId.push(req.user._id);
            existingBooking.save()
            .then(savedRes=>{
                res.status(201).json({
                    success:true,
                    message : "Booking created successfully", 
                    booking:savedRes
                });
            })
            .catch(err=>{
                console.log(err);
                res.json({
                    success:false,
                    message:"INTERNAL SERVER ERROR"
                });
            })
        }
        deal.peopleLeft = deal.peopleLeft - req.body.noOfPeople;
        deal.save()
        .then(result => console.log('Deal Updated'))
        .catch(err=>console.log(err));
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            error:e
        });
    }
}

exports.getSetAsFavorites = async (req,res,next) => {
    try{
        const addToFav = await dealsModel.findOneAndUpdate({_id:req.params.dealId},{$push:{favorites:req.user._id}});
        res.status(200).json({message:"Added to favorites"});        
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            error:e
        });
    }
}

exports.myBookings = async (req,res,next) => {
    try{
        const status = req.params.status;
        const bookings = await bookingsModel.find({touristId:req.user._id,status:status}).populate('guideId');
        res.status(200).json({message:"These are the bookings found",bookings:bookings});
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            error:e
        });
    }
}

exports.myFavorites = async (req,res,next) => {
    try{
        const deals = await dealsModel.find({favorites:req.user._id}).populate('guideId');
        res.status(200).json({message:"These are your favorite deals",deals:deals});
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            error:e
        });
    }
}

exports.editRequest = async (req,res,next) => {
    try{
        const change = req.params.change;
        const changes = {};
        if(change === 'CANCELLED'){
            changes.cancelDate=new Date().toJSON().slice(0,10);
            changes.cancelReason = req.body.cancelReason;
        }
        if(change === 'COMPLETED'){
            changes.rating = req.body.rating;
            changes.review = req.body.review;
        }
        changes.status = change;
        const bookingId = req.params.bookingId;
        await bookingsModel.findByIdAndUpdate({_id:bookingId},changes);
        res.status(200).json({message:"Booking updated successfully"});
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            error:e
        });
    }
}

exports.specificGuideDeals = async (req,res,next) => {
    try{
        const guideId = req.params.guideId;
        const deals = await dealsModel.find({guideId:guideId}).populate('favorites');
        res.status(200).json({message:"Deals of this tour guide",deals:deals});    
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            error:e
        });
    }
}

exports.postInsertInterestAndLanguage = async(req,res,next)=>{
    try{
        const interests = req.body.interests||false;
        const languages = req.body.languages||false;
        if(interests){
            req.user.interests = interests;
        }
        if(languages){
            req.user.languages = languages;
        }
        req.user.save()
        .then(savedUser=>{
            res.json({
                success:true,
                message:"The Tourist Was Successfull Updated",
                userDetails:savedUser
            })
        })
        .catch(err=>{
            console.log(err);
            res.json({
                success:false,
                message:"INTERNAL SERVER ERROR"
            });
        })
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        });
    }
}