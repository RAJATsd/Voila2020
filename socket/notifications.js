let connectUsers = [];

const notificationIO = function(io){
	io.on('connection', socket =>{
		socket.on('refresh',data => {
			
			io.emit('refreshPage',{});
		});
	});
};

module.exports = {
    connectUsers,
    notificationIO
}