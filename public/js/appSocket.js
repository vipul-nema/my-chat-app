	var USER_DB ={};
	var domainUrl = 'http://localhost:9000';
	function User(name, mobile){
		this.name = name;
		this.mobile = mobile;
		this.sendMessage = sendMessage;
		this.getChatHistory = getChatHistory;
		this.socket =  io.connect();
		this.connect = connect;
	}

	function connect()  {
		this.socket.on('event-get-users', this.getFriends);
		this.socket.on('event-get-msg', this.getMessage);
		
		this.socket.emit('event-add-user',{
				name : this.name,
				mobile : this.mobile
		});
	}  

	function getChatHistory(friend, callback){
		this.socket.on('event-update-chat-history', function(data){
			debugger;
			callback(data);
		});
		this.socket.emit('event-get-chat-history',{
			to : friend.mobile,
			from : this.mobile	
		})
	}
	
	function sendMessage(friend, message){
		this.socket.emit('event-send-msg', {
			to : friend.mobile,
			message : message,
			from : this.mobile
		});
	} 



