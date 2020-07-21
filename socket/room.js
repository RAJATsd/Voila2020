const room = require('../models/room');
const tourist = require('../models/tourist');
const guide = require('../models/guide');

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
		 console.log(data.senderId);
		 console.log(msg);
		 const touristDetails = await tourist.findById({
		 	_id : data.senderId
		 })
		 if(touristDetails == null){
		 	const guideDetails = await guide.findById({
		 		_id : data.senderId
		 	})
		 roomDetails.chatList.push(
		{
			senderName : guideDetails.name,
			body: msg
		});
		 }else{
			roomDetails.chatList.push(
		{
			senderName : touristDetails.name,
			body: msg
		}); 	
		 }
		 roomDetails.save();
		 console.log(touristDetails.name);
		 console.log(guideDetails.name);
		
		
		 //io.in(roomDetails.name).emit("message",{msg});
		 //socket.to(roomDetails.name).emit("emitMessage",{msg});
		io.emit('emitMessage',{});
	});
	});
};