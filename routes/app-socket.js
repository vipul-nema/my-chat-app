	var usersDB = {
		888 :{name:"888", online: false,mobile: 888, socket:null},
		999 :{name:"999", online: false,mobile: 999, socket:null},
		777 :{name:"777", online: false,mobile: 777, socket:null},
		555 :{name:"555", online: false,mobile: 555, socket:null}
	};

	var friendDb = {
		999 : [888,555,777],
		888 : [999,555],
		555 : [888,999],
		777 : [999]
	};

	function getChatID (){

	}
	// var chatDB = {
	// chat_id ;	{from:  , to: message : }
	// };
	// var ioRef;

	var addConnection =  function(socket){
		console.log("user connected");
		socket.userResponse = {};
		socket.on('event-add-user', addUser);
		socket.on("event-send-msg", sendMessage);

		socket.on("disconnect", disconnectUser);

		function disconnectUser(){
			// usersDB[userInstance.mobile].online = false;
			console.log("user disconnected" );
			if(usersDB[socket.mobile]){
				console.log("user disconnected- user details removed")
				usersDB[socket.mobile].online = false;
				usersDB[socket.mobile].socket = null;

				friendDb[socket.mobile].forEach(function(element){
					//TODO: do caching
					if(usersDB[element].online){
						usersDB[element].socket.userResponse[socket.mobile].online = false;
						usersDB[element].socket.emit("event-get-users", usersDB[element].socket.userResponse);
					}
				})
			}	
		}
		

		function addUser (user) {
				this.mobile = user.mobile;
				this.name = user.mobile;
				if(usersDB[this.mobile]){
					usersDB[this.mobile].name = this.mobile;
					usersDB[this.mobile].online = true;
					usersDB[this.mobile].socket = socket;
				}else {
					usersDB[this.mobile] = {};
					usersDB[this.mobile].name = this.name;
					usersDB[this.mobile].online = true;
					usersDB[this.mobile].socket = socket;
					usersDB[this.mobile].mobile = this.mobile;
				}

				if(!friendDb[this.mobile]){
					friendDb[this.mobile] = [];
				}
				
				friendDb[this.mobile].forEach(function(element) {
					var friend = usersDB[element];
					this.userResponse[element] = {};
					this.userResponse[element].mobile = friend.mobile;
					this.userResponse[element].online = friend.online;
					if(friend.online){
						friend.socket.userResponse[user.mobile].online = true;
						friend.socket.emit("event-get-users",friend.socket.userResponse);
					}
				}, this);
				socket.emit("event-get-users",this.userResponse);
		}
		
		function sendMessage(obj){
				console.log("sendMessage",obj);
				if(usersDB[obj.to].socket){
					usersDB[obj.to].socket.emit("event-get-msg", {from :this.mobile, message :obj.message})
				}
				
		}	
		function updateChatDB (chatData){
			var chatId = chatData.to + chatData.from;
			chatDB[chatId].push(chatData);
			socket.emit("chatData", chatDB)
		}
	}

	var connect  = function(io){
		ioRef = io;
		io.sockets.on('connection', addConnection);
		
	}


module.exports = connect;