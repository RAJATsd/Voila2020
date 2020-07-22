const dealModel = require('../models/deals');
const bookingModel = require('../models/bookings');
const updationMiddleware = require('../middleware/scheduleFunc');
const Guide = require('../models/tourGuide');
const messages = require('../models/messages');
const Tourist = require('../models/tourist');
const answerModel = require('../models/answers');
const roomModel = require('../models/room');

exports.addDeal = (req,res,next) => {
    try{
        const newDeal = new dealModel({
            places : req.body.places,
            price : req.body.price,
            guideId : req.user._id,
            startDate : req.body.startDate,
            endDate : req.body.endDate,
            city : req.body.city,
            state:req.body.state,
            peopleLimit:req.body.peopleLimit,
            groupType:req.body.groupType,
            peopleLeft:req.body.peopleLimit
        });
        newDeal.save()
        .then(deal => {
            res.status(201).json({
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
        res.status(200).json({message:"these are the deals",deals:deals});    
    }
    catch(e){
        console.log(e);
        res.json({
            success: false,
            error:e
        });        
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

exports.bookingResponse = (req,res,next) => {
    try{
        bookingModel.findOneAndUpdate({_id:req.params.bookingId},{status:req.params.response})
        .then(updatedBooking => {
            res.status(200).json({message:"booking updated",booking:updatedBooking});
            updationMiddleware.changeBookingStatus;
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
        console.log(e)
        res.json({
            success:false,
            error:e
        });
    }
}

exports.editProfile = async (req,res,next) => {
  try{
    await Guide.findByIdAndUpdate({_id:req.user._id},req.body);
    const profile = await Guide.findById({_id:req.user._id});
    res.status(200).json({message:"The pofile has been updated",profile:profile});
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
            }
            console.log(list);
            glbl.push(list);
        }
    }
//           movies.sort(function(a, b) {
//     var dateA = new Date(a.release), dateB = new Date(b.release);
//     return dateA - dateB;
// });
        glbl.sort(function(a,b){
            var dateA = new Date(a.created), dateB = new Date(b.created);
            return dateB - dateA ;
        });

          res.status(200).json({message: "list has been retireved",glbl:glbl});
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