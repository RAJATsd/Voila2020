const dealModel = require('../models/deals');
const bookingModel = require('../models/bookings');
const updationMiddleware = require('../middleware/scheduleFunc');
const Guide = require('../models/tourGuide');
const messages = require('../models/messages');
const Tourist = require('../models/tourist');
const answerModel = require('../models/answers');
const roomModel = require('../models/room');
const s3Instance = require('../helpers/aws').s3;
const ioTouristConnections = require('../socket/notifications').connectedTourists;
const notificationModel = require('../models/notifications');
const reporterSchema = require('../models/adminReports');
const blogSchema = require('../models/blog');

const axios = require('axios');
geoLocationKey = process.env.GEO_REVERESE_GEO_KEY;

let urlForPic=null;
if(process.env.PORT){
    urlForPic='https://voila2020.herokuapp.com/profileImages/';
}
else{
    urlForPic='localhost:3000/profileImages/';
}

exports.addDeal = async (req,res,next) => {
    try{
        console.log('adding deal');
        const busyBookings = await bookingModel.find({
            guideId:req.user._id,
            startDate:{$lte:req.body.endDate},
            endDate:{$gte:req.body.startDate},
            status:'APPROVED'
        });
        if(busyBookings.length){
            res.json({
                success:false,
                message:"guide is already busy between these days"
            });
        }
        else{
            const placeForVisit = req.body.places;
            let placeCoordinates = [];
            for(onePlace of placeForVisit){
                let url = 'https://api.opencagedata.com/geocode/v1/json?q='+onePlace.place+','+req.body.state+'&key='+geoLocationKey;
                console.log(url);
                const fetchCoordinates = await axios.get(url);
                placeCoordinates.push(fetchCoordinates.data.results[0].geometry);
            }
            const newDeal = new dealModel({
                places : req.body.places,
                price : req.body.price,
                guideId : req.user._id,
                startDate : req.body.startDate,
                endDate : req.body.endDate,
                city : req.body.city,
                state:req.body.state,
                placeCoordinates:placeCoordinates,
                peopleLimit:req.body.peopleLimit,
                groupType:req.body.groupType,
                peopleLeft:req.body.peopleLimit
            });
            
            newDeal.save()
            .then(deal => {
                res.status(201).json({
                    success:true,
                    message:"New Deal Created",
                    deal:deal
                });
            })
            .catch(error => {
                console.log(error);
                res.json({
                    success : false,
                    error : error
                });
            });
        }
    }
    catch(err){
        console.log(err)
        res.json({
            success : false,
            error : err
        });
    }
}

exports.showDeal = async (req,res,next) => {
    try{
        const deals = await dealModel.find({guideId:req.user._id});
        res.status(200).json({
            success:true,
            message:"these are the deals",
            deals:deals
        });    
    }
    catch(e){
        console.log(e);
        res.json({
            success: false,
            error:e
        });        
    }
}

exports.specificBookingDetails = async(req,res,next) => {
    try{
        const bookingId = req.params.bookingId;
        const booking = await bookingModel.findOne({_id:bookingId});
        res.json({
            success:true,
            booking:booking
        });
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        })
    }
}

exports.showOffers = async (req,res,next) => {
    try{
        const status = req.params.status;
        const Bookings = await bookingModel.find({guideId:req.user._id,status:status}).sort({startDate:1}).populate('touristId').lean();
        if(status==='APPROVED'){
            for(singleBooking of Bookings)
            {
                if(singleBooking.dealId){
                    const fetchedRoom = await roomModel.findOne({dealId:singleBooking.dealId});
                    singleBooking.roomDetails = fetchedRoom;
                }
            }
        }
        res.status(200).json({
            success:true,
            message:"found these offers",
            bookings:Bookings
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

exports.bookingResponse = async (req,res,next) => {
    try{
        const selectedBooking = await bookingModel.findOne({_id:req.params.bookingId});
        if(req.params.response==='APPROVED'){
            const bookingStartDate = selectedBooking.startDate;
            const bookingEndDate = selectedBooking.endDate;
            const busyBookings = await bookingModel.find({
                guideId:req.user._id,
                startDate:{$lte:bookingEndDate},
                endDate:{$gte:bookingStartDate},
                status:'APPROVED'
            });
            if(busyBookings.length){
                return res.json({
                    success:false,
                    message:"guide is already busy between these days"
                });
            }
        }
        bookingModel.findOneAndUpdate({_id:req.params.bookingId},{status:req.params.response})
        .then(updatedBooking => {
            res.status(200).json({
                success:true,
                message:"booking updated",
                booking:updatedBooking
            });
            updationMiddleware.changeBookingStatus;
        })
        .catch(error => {
            console.log(error);
            return res.json({
                success:false,
                error:error
            });
        });
        const newNotification = new notificationModel({
            name : req.user.name,
            doerId:req.user._id,
            actionId:selectedBooking._id,
            receiverId:selectedBooking.touristId[0],
            notificationText : `${req.user.name} has ${req.params.response} for your booking`
        });
        newNotification.save()
        .then(savedNotification => {
            req.app.locals.ioInstance.to(ioTouristConnections[selectedBooking.touristId[0]]).emit('new_notification_tourist',savedNotification);
        })
        .catch(e=>{
            console.log(e)
        });
    }
    catch(e){
        console.log(e)
        res.json({
            success:false,
            error:e
        });
    }
}

exports.editProfile = async (req,res,next) => {
  try{
    const changes = JSON.parse(req.body.data);
    const profilePic = req.file;  
    if(profilePic){
        const paramsForS3 = {
            Bucket:process.env.AWS_BUCKET_NAME,
            Key : Date.now()+req.file.originalname,
            Body:req.file.buffer
        }
        s3Instance.upload(paramsForS3,async(err,data)=>{
            if(err){
                console.log(e)
                res.json({
                    success:false,
                    message:"SOMETHING WRONG WITH BUCKET"
                });
            }
            else{
                changes.picUrl = data.Location;
                await Guide.findOneAndUpdate({email:changes.email},changes);
                const profile = await Guide.findOne({email:changes.email});
                res.status(200).json({
                    success:true,
                    message:"The pofile has been updated",
                    profile:profile
                });
            }
        });
    }
    else{
        await Guide.findOneAndUpdate({email:changes.email},changes);
        const profile = await Guide.findOne({email:changes.email});
        res.status(200).json({
            success:true,
            message:"The pofile has been updated",
            profile:profile
        });
    }
    console.log(changes);
  }
  catch(e){
      console.log(e);
      res.json({
          success:false,
          error:e
      });
  }
}

exports.showList = async(req, res, next) => {
    try {
        let glbl = [];
        const guide = await Guide.findById({
            _id: req.params.id
        });

        for(chat of guide.chatList)
        {
            
            const msg = await messages.findById(chat.msgId).lean();
            const user = await Tourist.findById(chat.receiverId);
            const len = msg.message.length;
            const list = msg.message[len - 1];
            list["userName"] =  user.name;
            list["userEmail"] =  user.email;
            
            //console.log(list);

            glbl.push(list);
            
        }          
        const roomDetails = await roomModel.find({
            guideId: req.params.id
        }).lean();
         //console.log(roomDetails);
        
        for(chat of roomDetails){
            //console.log(chat.chatList);
            if(roomDetails !== undefined){
            const len = chat.chatList.length;
            //console.log(len);
            const list = chat.chatList[len-1];
            
            if(list !== undefined){
            list["roomName"] = chat.name;
            list["roomId"] = chat._id;
            console.log(list);

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
        }
     catch (e) {
        console.log(e);
        res.json({
            success: false,
            error: e
        });
    }
}


exports.fillAnswers = async(req,res,next) => {
    try{
        const newAnswer = new answerModel({
            guideId:req.user._id,
            answerOne:req.body.answerOne,
            answerTwo:req.body.answerTwo,
            answerThree:req.body.answerThree
        });
        newAnswer.save()
        .then(savedAnswer=>{
            res.json({
                success:true,
                answers:savedAnswer
            });
        })
        .catch(err=>{
            console.log(err);
            res.json({
                success:false,
                message:"ERROR WHILE ADDING ANSWERS"
            })
        });
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        })
    }
}

exports.deleteDeal = async (req,res,next) => {
    try{
        dealModel.findByIdAndDelete({_id:req.params.dealId})
        .then(response=>{
            res.json({
                success:true,
                message:"Deleted the deal"
            });
        })
        .catch(err=>{
            console.log(err);
            res.json({
                success:false,
                message:"ERROR WHILE DELETING IN DB"
            })
        });
    }
    catch(e){
        console.log(e);
        res.json({
            success:false,
            message: " INTERNAL SERVER ERROR "
        })
    }
}

exports.reportProblemGuide = async(req,res,next) => {
    try{
        const newReport = new reporterSchema({
            name : req.user.name,
            reporterId:req.user._id,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            userType:'GUIDE'
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
        }); 
    }
    catch(e){
        res.json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        });
    }
}

exports.addBlog = async(req,res,next) => {
    try{
       // const profilePic = req.file;
    
        const paramsForS3 = {
            Bucket:process.env.AWS_BUCKET_NAME,
            Key : Date.now()+req.file.originalname,
            Body:req.file.buffer
        }
        s3Instance.upload(paramsForS3,async(err,data)=>{
         if(err){
                console.log(e)
                res.json({
                    success:false,
                    message:"SOMETHING WRONG WITH BUCKET"
                });
            }
        else{
                    
        const newBlog = new blogSchema({
            title : req.body.title,
            content : req.body.content,
            author : req.user._id,
            picUrl : data.Location
        });
        newBlog.save()
        .then(blog => {
            res.json({
                success : true,
                message : "added successfully",
                blog : blog
            });
        })
    .catch(err => {
        res.json({
            success : false,
            message : "INTERNAL SERVER ERROR"
        })
    })
}
 })  
}
catch(e){
        res.json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        });
    }
}

