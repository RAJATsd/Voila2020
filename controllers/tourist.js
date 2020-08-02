const guideModel = require('../models/tourGuide');
const dealsModel = require('../models/deals');
const bookingsModel = require('../models/bookings');
const Guide = require('../models/tourGuide');
const messages = require('../models/messages');
const Tourist = require('../models/tourist');
const roomModel = require('../models/room');
const ioGuideConnections = require('../socket/notifications').connectedGuides;
const notificationModel = require('../models/notifications');
const reporterSchema = require('../models/adminReports');


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
        console.log('oho bete ye to ho rha');
    }
    catch(e){
        console.log(e)
    }
}

exports.getRandomDeals = async(req,res,next) => {
    try{
        const randomGuides = await dealsModel.find().distinct('guideId');
        const randomDeals = [];
        for(oneGuide of randomGuides){
            const dealFound = await dealsModel.findOne({guideId:oneGuide}).populate('guideId');
            randomDeals.push(dealFound);
        }
        res.json({
            success:true,
            deals:randomDeals
        });
    }
    catch(err){
        console.log(err);
        res.json({
            success:false,
            error:err
        });
    }
}

exports.getGuidesBySearch = async (req,res,next) => {
    try{
        console.log(req.body);
        const state = req.body.state;
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const noOfPeople = req.body.noOfPeople;
        let guides = [];
        let {minPrice,maxPrice} = req.body.extra_filter;
        if(req.body.filters===false){
            guides = await guideModel.find({
                state:state,
                perHeadCharge:{$gte:minPrice,$lte:maxPrice},
                profileStatus:'APPROVED'
            }).lean();
        }
        else{
            const filters = req.body.extra_filter;
            const {rating,interests,languages,city} = filters;
            const objFilter = {};
            if(rating!=null){
                objFilter.rating={$gte:rating};
            }
            if(interests.length !=0){
                objFilter.interests={$in:interests};
            }
            if(languages.length!=0){
                objFilter.languages={$in:languages}
            }
            if(city.length!=0){
                objFilter.city={$in:city}
            }      
            guides = await guideModel.find({
                state:state,
                perHeadCharge:{$gte:minPrice,$lte:maxPrice},
                profileStatus:'APPROVED',
                ...objFilter
            }).lean();
        }
        const deals = await dealsModel.find({
            state:state,
            startDate:{$gte:new Date().toJSON().slice(0,10)},
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
        const busyBookings = await bookingsModel.find({
            guideId:req.params.guideId,
            startDate:{$lte:req.body.endDate},
            endDate:{$gte:req.body.startDate},
            status:'APPROVED'
        });
        if(busyBookings.length){
            res.json({
                success:false,
                message:"The guide is already busy in these days"
            });
        }
        else{
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
                .then(savedBooking => {
                    res.status(200).json({
                        success:true,
                        message:"Booking created successfully",
                        booking:savedBooking
                    });
                    const newNotification = new notificationModel({
                        name : req.user.name,
                        doerId:req.user._id,
                        actionId:savedBooking._id,
                        receiverId:req.params.guideId,
                        notificationText : `${req.user.name} has requested for a booking`
                    });
                    newNotification.save()
                    .then(savedNotification => {
                        req.app.locals.ioInstance.to(ioGuideConnections[req.params.guideId]).emit('new_notification_guide',savedNotification);
                    })
                    .catch(e=>{
                        console.log(e)
                    });
                })
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
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            error:"INTERNAL SERVER ERROR"
        });
    }
}

exports.getDealAcceptance = async (req,res,next) => {
    try{
        let actionId = null;
        const deal = await dealsModel.findOne({_id:req.params.dealId});
        if(req.body.noOfPeople>deal.peopleLeft){
            res.json({
                success:false,
                message:"Not enough slots available for booking"
            });
        }
        else{
            const existingBooking = await bookingsModel.findOne({dealId:req.params.dealId});
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
                .then(async booking=>{
                    actionId = booking._id;
                    const touristId = req.user._id;
                    const room = await roomModel.findOne({dealId:req.params.dealId});
                    room.tourists = room.tourists.concat({touristId});
                    room.save()
                    .then(savedRoom => {
                        res.status(201).json({
                            success:true,
                            message : "Booking created successfully", 
                            booking:booking
                        });
    
                    })
                    .catch(e=>{
                        return res.json({
                            success:false,
                            error:e
                        });
                    });
                })
                .catch(error => {
                    console.log(error);
                    return res.json({
                        success:false,
                        error:error
                    })
                });
            }
            else{
                actionId = existingBooking._id;
                existingBooking.touristId.push(req.user._id);
                existingBooking.save()
                .then(savedRes=>{
                    res.status(201).json({
                        success:true,
                        message : "You were added to the existing booking", 
                        booking:savedRes
                    });
                })
                .catch(err=>{
                    console.log(err);
                    return res.json({
                        success:false,
                        message:err
                    });
                })
            }
            const newNotification = new notificationModel({
                name : req.user.name,
                doerId:req.user._id,
                actionId,
                receiverId:deal.guideId,
                notificationText : `${req.user.name} has booked a deal with you`
            });
            newNotification.save()
            .then(savedNotification => {
                req.app.locals.ioInstance.to(ioGuideConnections[deal.guideId]).emit('new_notification_guide',savedNotification);
            })
            .catch(e=>{
                console.log(e)
            });
            deal.peopleLeft = deal.peopleLeft - req.body.noOfPeople;
            deal.save()
            .then(result => console.log('Deal Updated'))
            .catch(err=>console.log(err));
        }
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
        const bookings = await bookingsModel.find({touristId:req.user._id,status:status}).populate('guideId').lean();
        if(status==='APPROVED'){
            for(singleBooking of bookings)
            {
                if(singleBooking.dealId){
                    const fetchedRoom = await roomModel.findOne({dealId:singleBooking.dealId});
                    singleBooking.roomDetails = fetchedRoom;
                }
            }
        }
        res.status(200).json({
            success:true,
            message:"These are the bookings found",
            bookings:bookings
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

exports.myFavorites = async (req,res,next) => {
    try{
        const deals = await dealsModel.find({favorites:req.user._id}).populate('guideId');
        res.status(200).json({
            success:true,
            message:"These are your favorite deals",
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

exports.editRequest = async (req,res,next) => {
    try{
        const change = req.params.change;
        const changes = {};
        if(change === 'CANCELLED'){
            changes.cancelDate=new Date().toJSON().slice(0,10);
            changes.cancelReason = req.body.cancelReason;
        }
        else if(change === 'COMPLETED'){
            changes.rating = req.body.rating||null;
            changes.review = req.body.review||null;
        }
        changes.status = change;
        const bookingId = req.params.bookingId;
        const bookingChange = await bookingsModel.findByIdAndUpdate({_id:bookingId},changes);
        if(change==='ONGOING')
        {
            Tourist.updateMany({_id:{$in:bookingChange.touristId}},{occupied:true});
            guideModel.findByIdAndUpdate({_id:bookingChange.guideId},{occupied:true});
        }
        else if(change === 'COMPLETED'){
            Tourist.updateMany({_id:{$in:bookingChange.touristId}},{occupied:false});
            guideModel.findByIdAndUpdate({_id:bookingChange.guideId},{occupied:false});    
        }        
        res.status(200).json({
            success:true,
            message:"Booking updated successfully"
        });
        const newNotification = new notificationModel({
            name : req.user.name,
            doerId:req.user._id,
            actionId:bookingId,
            receiverId:bookingChange.guideId,
            notificationText : `${req.user.name} has ${change} a booking`
        });
        newNotification.save()
        .then(savedNotification => {
            req.app.locals.ioInstance.to(ioGuideConnections[bookingChange.guideId]).emit('new_notification_guide',savedNotification);
        })
        .catch(e=>{
            console.log(e)
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

exports.specificGuideDeals = async (req,res,next) => {
    try{
        const guideId = req.params.guideId;
        const deals = await dealsModel.find({guideId:guideId}).populate('favorites').populate('guideId');
        const guide = await guideModel.findById({_id:guideId});
        const ratings = await bookingsModel.find({guideId:guideId,status:'COMPLETED'})
        res.status(200).json({
            success:true,
            message:"Deals of this tour guide",
            guide,
            deals:deals,
            ratings:ratings
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
            
           

            glbl.push(list);
            
        }          
        const roomDetails = await roomModel.find({
            "tourists.touristId" : req.params.id
        }).lean();
        for(chat of roomDetails){
            //console.log(chat.chatList);
            if(roomDetails !== undefined){
            const len = chat.chatList.length;
            //console.log(len);
            const list = chat.chatList[len-1];
            
            if(list !== undefined){
            list["roomName"] = chat.name;
            list["roomId"] = chat._id;
            
            glbl.push(list);
        }
        }
    }
glbl.sort(function(a,b){
            var dateA = new Date(a.created), dateB = new Date(b.created);
            return dateB - dateA ;
        });
        
          res.status(200).json({
              success:true,
              message: "list has been retireved",
              glbl:glbl
            });
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            error: e
        });
    }
}

exports.reportProblemTourist = async(req,res,next) => {
    try{
        const newReport = new reporterSchema({
            name : req.user.name,
            reporterId:req.user._id,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            userType:'TOURIST'
        });
        newReport.save()
        .then(savedReport=>{
            res.json({
                success:true,
                message:"reported successfully"
            });
        })
        .catch(err=>{
            res.json({
                success:false,
                message:"INTERNAL SERVER ERROR"
            })
        }) 
    }
    catch(e){
        res.json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        })
    }
}