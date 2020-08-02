let connectedTourists = [];
let connectedGuides = [];

const notificationIO = function(io){
	io.on('connection', socket =>{
		socket.on('initial_connect',data => {
			if(data.userType === 'GUIDE'){
				socket.join('GUIDES');
				connectedGuides[data._id]=socket.id;
				console.log('Guide joining in room')
			}
			else{
				console.log('Tourist joining in room');
				socket.join('TOURISTS');
				connectedTourists[data._id]=socket.id;
			}
		});
	});
};

module.exports = {
	notificationIO,
	connectedGuides,
	connectedTourists
}