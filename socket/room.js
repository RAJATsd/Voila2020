const room = require('../models/room');

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
		 // console.log(roomDetails.name);
		var msg = data.message;
		roomDetails.chatList.push({
			senderId : data.senderId,
			body: msg
		});
		 socket.to(roomDetails.name).emit("message",{msg});
	});
	});
};