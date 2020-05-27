const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const guideModel = require('../models/tourGuide');
const touristModel = require('../models/tourist');

exports.GetAllMessages = async(req,res,next) => {
	const {sender_Id,receiver_Id} = req.params;
	const conversation = await Conversation.findOne({
		$or:[
		{
			$and : [
			{'participants.senderId' : sender_Id},
			{'participants.receiverId' : receiver_Id},
			]
		},{
			$and : [
			{'participants.senderId' : receiver_Id},
			{'participants.receiverId' : sender_Id},
			]
		}
	]
	}).select('_id');

	if (conversation){
		const msg = await Message.findOne({
			conversationId : conversation._id
		});
	res.status(200).json({message:"messages fetched",msg:msg});

	}
}

exports.SendMessage = (req,res,next) => {
	//console.log(req.body);
	const {sender_Id,receiver_Id} = req.params;

	Conversation.find({
		$or:[
			{participants : {$elemMatch: {senderId : sender_Id, receiverId: receiver_Id}}},
			{participants : {$elemMatch: {senderId : receiver_Id, receiverId: sender_Id }}}
		]
	},async(err,result)=>{
		if(result.length){
			await Message.update(
			{
				conversationId : result[0]._id
			},
			{
			$push :{
				message :{
				senderId : req.user._id,
				receiverId : req.params.receiver_Id,
				sendername : req.user.email,
				receivername : req.body.receiverName,
				body : req.body.message,
				}
			}
		}
			).then(() => {
			res.status(201).json({message:"Message Sent"});
		})
		.catch(error => {
        console.log(error);
    });
		}else{
			const newConversation = new Conversation();
			newConversation.participants.push({
				senderId : req.user._id,
				receiverId : req.params.receiver_Id 
			});
		const saveConversation = await newConversation.save();
		//console.log(saveConversation);
		
		const newMessage = new Message();
		newMessage.conversationId = saveConversation._id;
		newMessage.sendername = req.user.email;
		newMessage.receivername = req.body.receiverName;
		newMessage.message.push(
		{
			senderId : req.user._id,
			receiverId : req.params.receiver_Id,
			sendername : req.user.email,
			receivername : req.body.receiverName,
			body : req.body.message,

		});
		
		if(req.body.senderRole == 'guide')
			userModel = guideModel;
    	else
        userModel = touristModel;
		
		const Profile1 = await userModel.update({
			_id : req.user._id
		},{
			$push: {
				chatList:{
					$each:[
						{
							receiverId : req.params.receiver_Id,
							msgId : newMessage._id
						}
					],
					$position : 0
					
				}
			}
		})
	//	console.log(Profile1);
		const Profile2 = await userModel.update({
			_id : req.params.receiver_Id
		},{
			$push: {
				chatList:{
					$each:[
						{
							receiverId : req.user._id,
							msgId : newMessage._id
						}
					],
					$position : 0
					
				}
			}
		})
		//console.log(Profile2);

		await newMessage.save()
		.then(message => {
			res.status(201).json({message:"Message Sent",message:message});
		})
		.catch(error => {
        console.log(error);
    });
		}
	})
	
exports.MarkReceiverMessages = async(req,res,next) => {
		//console.log(req.params);	
		const {sender,receiver} = req.params,
		const msg = await Message.aggregate([
		{$unwind : '$message'},
		 {
		 	$match: {
		 		$and : [
		 		{'message.sendername' : receiver, 'message.receivername' : sender}
		 		]
		 	}
		 }
		 ]);
		//console.log(msg);
		if(msg.length > 0){
			try {
				msg.forEach(async (value) => {
					await Message.update({
						'message_id' : value.message._id
					},
					{$set: {'message.$.isRead' : true} }
					);
				});
				res.status(200).json({message : 'Messages marked as read'});
			}catch(err){
				res.status(400).json({message : 'error'});
			}
		}

	}

} 



