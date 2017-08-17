	// var domainUrl = 'http://localhost:9000';
	var User = (function(){
			function User(name, mobile){
				this.name = name;
				this.mobile = mobile;
				this.sendMessage = sendMessage;
				this.getChatHistory = getChatHistory;
				this.socket =  io.connect();
				this.addUser = addUser;
				this.bindEvent = bindEvent;
				this.searchFriend = searchFriend;
			}

			function bindEvent(eventName, eventHandler){

				switch(eventName){

					case 'event-get-users' : 
						this.socket.on('event-get-users', eventHandler);
						break;
					case 'event-get-msg' : 
						this.socket.on('event-get-msg', eventHandler);
						break;	
					case 'event-update-chat-history': 
						this.socket.on('event-update-chat-history', eventHandler);
						break;	
					default:
						break	

				}

			}

			function addUser()  {
				
				this.socket.emit('event-add-user',{
						name : this.name,
						mobile : this.mobile
				});
			}
			function searchFriend (mobile, callback){
				this.socket.emit('event-search-friend',{mobile:mobile}, callback);
			}

			function getChatHistory(friend){
				
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
			
		return User;
	})()
	



