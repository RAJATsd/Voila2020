const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Guide = require('../models/tourGuide');

exports.SendMessage = (req,res,next) => {
	//console.log(req.body);
	const {sender_Id,receiver_Id} = req.params;

	Conversation.find({
		$or:[
			{participants : {elemMatch: {senderId = sender_Id, receiverId: receiver_Id}}},
			{participants : {elemMatch: {senderId = receiver_Id, receiverId: sender_Id }}}
		]
	},async(err,result)=>{
		if(result.length){

		}else{
			const newConversation = new Conversation();
			newConversation.participants.push({
				senderId : req.user._id,
				receiverId : req.params.receiver_Id 
			});
		const saveConversation : await newConversation.save();
		//console.log(saveConversation);
		
		const newMessage = new Message();
		newMessage.conversationId : saveConversation._id;
		newMessage.sender : req.user.email;
		newMessage.receiver : req.body.receiverName;
		newMessage.message.push(
		{
			senderId : req.user._id,
			receiverId : req.params.receiver_Id,
			sender : req.user.email,
			receiver : req.body.receiverName,
			body : req.body.message,

		});
		await newMessage.save()
		.then(message => {
			res.status(201).json({message:"New Conversation Created",message:message});
		})
		.catch(error => {
        console.log(error);
    });
		}
	})
}