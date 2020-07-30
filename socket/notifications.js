let connectedTourists = [];
let connectedGuides = [];

const notificationIO = function(io){
	io.on('connection', socket =>{
		socket.on('initial_connect',data => {
			if(data.userType === 'GUIDE'){
				socket.join('GUIDES');
				connectedGuides[data._id]=socket.id;
			}
			else{
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