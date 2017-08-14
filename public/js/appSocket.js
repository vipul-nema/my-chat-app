	var USER_DB ={};
	var domainUrl = 'http://localhost:9000';
	function User(name, mobile){
		this.name = name;
		this.mobile = mobile;
		this.sendMessage = sendMessage;
		this.socket =  io.connect(domainUrl);
		this.connect = connect;
	}

	function connect()  {
		this.socket.on('event-get-users', this.getUser);
		this.socket.on('event-get-msg', this.getMessage);
		
		this.socket.emit('event-add-user',{
				name : this.name,
				mobile : this.mobile
		});
	}  

	
	function sendMessage(to, message){
		this.socket.emit('event-send-msg', {
			to : to,
			message : message,
		});
	} 



