const guideModel = require('../models/tourGuide');
const dealsModel = require('../models/deals');
const bookingsModel = require('../models/bookings');
const Guide = require('../models/tourGuide');
const messages = require('../models/messages');
const Tourist = require('../models/tourist');

exports.getCheck = async(req,res,next) => {
    try{
        const guides = await guideModel.find({city:'Panipat'}).lean();
        if(guides.length > 0){
            for(singleGuide of guides){
                const reviews = await bookingsModel.find({guideId:singleGuide._id});
                console.log(singleGuide)
                singleGuide['reviewAndRating'] = reviews;
            }
        }
        res.json({
            success:true,
            guides:guides
        })
    }
    catch(e){
        console.log(e)
    }
}


exports.getGuidesBySearch = async (req,res,next) => {
    try{
        const city = req.body.city;
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const noOfPeople = req.body.noOfPeople;
        let guides = [];
        let {minPrice,maxPrice} = req.body.extra_filter;
        if(req.body.filters===false){
            guides = await guideModel.find({
                city:city,
                perHeadCharge:{$gte:minPrice,$lte:maxPrice}
            }).lean();
        }
        else{
            const filters = req.body.extra_filter;
            const {rating,interests,languages} = filters;
            const objFilter = {};
            if(rating!=null){
                objFilter.rating={$gte:rating};
            }
            if(interests.length !=0){
                objFilter.interests={$in:interests};
            }
            if(languages.length!=0){
                objFilter.languages={$in:languages}
            };      
            guides = await guideModel.find({
                city:city,
                perHeadCharge:{$gte:minPrice,$lte:maxPrice},
                ...objFilter
            }).lean();
        }
        const deals = await dealsModel.find({
            city:city,
            endDate:{$gte:startDate},
            peopleLeft:{$gte:noOfPeople}
        })
        .populate('guideId');

        if(guides.length > 0){
            for(singleGuide of guides){
                const reviews = await bookingsModel.find({guideId:singleGuide._id,status:'COMPLETED'});
                singleGuide.reviewAndRating = reviews;
            }
        }

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
            //places : req.body.places,
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
                groupType : deal.groupType,
                endDate : deal.endDate,
                status : 'APPROVED',
                noOfPeople : req.body.noOfPeople,
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
                    error:error
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
                    message:err
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
        res.status(200).json({
            success:true,
            message:"Added to favorites"
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

exports.removeFromFavorites = async (req,res,next) => {
    try{
        await dealsModel.findOneAndUpdate({_id:req.params.dealId},{$pull:{favorites:req.user._id}});
        res.json({
            success:true,
            message:'REMOVED FROM FAVORITES'
        });
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message:"INTERNAL SERVER ERROR"
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
        const guide = await guideModel.findById({_id:guideId});
        res.status(200).json({message:"Deals of this tour guide",guide,deals:deals});    
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

exports.showList = async(req, res, next) => {
    try {
        let glbl = [];
        const tourist = await Tourist.findById({
            _id: req.params.id
        });

        for(chat of tourist.chatList)
        {
            
            const msg = await messages.findById(chat.msgId).lean();
            const user = await Guide.findById(chat.receiverId);
            const len = msg.message.length;
            const list = msg.message[len - 1];
            list["userName"] =  user.name;
            list["userEmail"] =  user.email;
            
            console.log(list);

            glbl.push(list);
            
        }          
        
          res.status(200).json({message: "list has been retireved",glbl:glbl});
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            error: e
        });
    }
}