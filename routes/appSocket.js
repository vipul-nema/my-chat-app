
	var usersDB  = require('../DB/userDB');
	var friendDB = require('../DB/friendDB');
	var chatDB = require('../DB/chatDB');

	function getChatID (mob1, mob2){
		return (Number(mob1) *  Number(mob2));
	}

	
	function addConnection(socket){
		console.log("User connection added");

		socket.on('event-add-user', addUser);
		socket.on("event-send-msg", sendMessage);
		socket.on("disconnect", disconnectUser);
		socket.on('event-get-chat-history', getChatHistory);
		socket.on('event-search-friend', searchFriend);
		

	}

	function addUser (user) {
		//this == socket
		this.getFriendDetails = getFriendDetails
		this.mobile = user.mobile;
		this.name = user.mobile;
		this.online = true;
		this.userResponse = {};
		// this.name = user.mobile;

		if(usersDB[this.mobile]){// for existing user
			usersDB[this.mobile].name = user.name;
		}else {// for new user
			usersDB[this.mobile] = {};
			usersDB[this.mobile].mobile = this.mobile;
		}
		//update userDB online status add referece of socket
		usersDB[this.mobile].name = user.name;
		usersDB[this.mobile].online = true;
		usersDB[this.mobile].socket = this;

		if(!friendDB[this.mobile]){
			//add entry in friendDB if new user
			friendDB[this.mobile] = [];
		}

		// update online status to all user friends
		friendDB[this.mobile].forEach(function(friend) {
			//get friend's current details from userDB
			var friendDetails = usersDB[friend];
			this.userResponse[friend] = {
				name : friendDetails.name,
				mobile : friendDetails.mobile,
				online : friendDetails.online
			};
			
			if(friendDetails.online){
				//update status to each friend
				friendDetails.socket.userResponse[this.mobile].online = true;
				friendDetails.socket.userResponse[this.mobile].name = user.name;
				//TODO - send indevidual user response instead all
				friendDetails.socket.emit("event-get-users",friendDetails.socket.userResponse);
			}
		}, this);

		// send  status to user about friends
		console.log("event-get-users" );
		this.emit("event-get-users",this.userResponse);
	}




	function getChatHistory(obj){
		var chatId = getChatID(obj.to, obj.from);
		this.emit('event-update-chat-history',chatDB[chatId] || [] )

	}

	function sendMessage(chatData){
		console.log("event send Message")
		var chatId =  getChatID(chatData.to, chatData.from);
		var obj = {
			from : chatData.from,
			to: chatData.to,
			message : chatData.message,
			date: new Date()
		};
		if(chatDB[chatId]){
			chatDB[chatId].push(obj);
		}else{
			chatDB[chatId] = [];
			chatDB[chatId].push(obj);
		}
		if(usersDB[obj.to].online && usersDB[obj.to].socket ){
			usersDB[obj.to].socket.emit("event-get-msg", obj);
		}
		this.emit("event-get-msg", obj);

	}



	function disconnectUser(){
		// usersDB[userInstance.mobile].online = false;
		console.log("event user disconnected" );
		// this.userResponse = null;
		if(usersDB[this.mobile]){
			usersDB[this.mobile].online = false;
			usersDB[this.mobile].socket = null;


			friendDB[this.mobile].forEach(function(friend){
				if(usersDB[friend].online){
					//TODO - send indevidual user response instead all
					usersDB[friend].socket.userResponse[this.mobile].online = false;
					usersDB[friend].socket.emit("event-get-users", usersDB[friend].socket.userResponse);
				}
			},this)
		}	
	}

	function searchFriend(friend, callback){
		console.log("add friend");
		var mobile = friend.mobile || "";
		if(mobile &&  usersDB[mobile] ){
			var friendDetails = usersDB[mobile];
			if(friendDB[this.mobile].indexOf(mobile)==-1){
				friendDB[this.mobile].push(mobile);
				friendDB[mobile].push(mobile);
				console.log(friendDB[this.mobile]);
				this.getFriendDetails();
				// update new friend
				if(friendDetails.online){
					friendDetails.socket.userResponse[this.mobile] = {
						name : this.name,
						mobile : this.mobile,
						online : this.online
					}
					usersDB[mobile].socket.emit("event-get-users",friendDetails.socket.userResponse);
				}
				// send  status to user about friends
				console.log("event-get-users" );
				this.emit("event-get-users",this.userResponse);	
			}
		
			}else{
					callback("No friend found of this mobile number");
			}
	}

	function getFriendDetails(){
		friendDB[this.mobile].forEach(function(friend) {
			//get friend's current details from userDB
			var friendDetails = usersDB[friend];
			this.userResponse[friend] = {
				name : friendDetails.name,
				mobile : friendDetails.mobile,
				online : friendDetails.online
			}
		}, this);
		return this.userResponse;
	}
		

	function connect(io){
		
		io.sockets.on('connection', addConnection);
		
	}




module.exports = connect;