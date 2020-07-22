const room = require('../models/room');
const tourist = require('../models/tourist');
const guide = require('../models/tourGuide');

module.exports = function(io){
	io.on('connection', socket =>{
		
		//joinRoom event
		socket.on('joinRoom',async(data) => {
		console.log(data);
		const roomDetails = await room.findById({
		_id: data.roomId
	});
		console.log(roomDetails);
		socket.join(roomDetails.name);
		console.log(roomDetails);
		});
	
	//sendMessage event
	socket.on('message',async(data) => {
		const roomDetails = await room.findById({
		_id: data.roomId
	});
		  
		var msg = data.message;
		 
		 const touristDetails = await tourist.findById({
		 	_id : data.senderId
		 });
		 console.log(touristDetails);
		 const guideDetails = await guide.findById({
		 		_id : data.senderId
		 	})
		 	console.log(guideDetails);
		 if(touristDetails == null){
		 	const guideDetails = await guide.findById({
		 		_id : data.senderId
		 	})
		 	console.log(guideDetails);
		 roomDetails.chatList.push(
		{
			senderId: data.senderId,
			senderName : guideDetails.name,
			body: msg
		});
		 }else{
			roomDetails.chatList.push(
		{
			senderId: data.senderId,
			senderName : touristDetails.name,
			body: msg
		}); 	
		 }
		 roomDetails.save();
		 
		
		 //io.in(roomDetails.name).emit("message",{msg});
		 //socket.to(roomDetails.name).emit("emitMessage",{msg});
		io.emit('emitMessage',{});
	});
	});
};