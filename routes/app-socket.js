	// var usersDB = {
	// 	888 :{name:"888", online: false,mobile: 888, socket:null},
	// 	999 :{name:"999", online: false,mobile: 999, socket:null},
	// 	777 :{name:"777", online: false,mobile: 777, socket:null},
	// 	555 :{name:"555", online: false,mobile: 555, socket:null}
	// };
	
	var userDB  = require('./routes/DB/userDB');

	var friendDb = {
		999 : [888,555,777],
		888 : [999,555],
		555 : [888,999],
		777 : [999]
	};

	var chatDB = {
		887112 :[{from: 999 , to:888, message :"Hi how are you" },{from: 999 , to:888, message :"Hi 888" }],
		492840 :[{from: 555 , to:888, message :"Hi how are you" },{from: 888 , to:555, message :"Hi 888" }]
	};

	function getChatID (mob1, mob2){
		return (Number(mob1) *  Number(mob2));

	}

	var ioRef;

	var addConnection =  function(socket){
		console.log("user connected");
		socket.userResponse = {};
		socket.on('event-add-user', addUser);
		socket.on("event-send-msg", sendMessage);

		socket.on("disconnect", disconnectUser);
		socket.on('event-get-chat-history', getChatHistory);

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
				console.log("event send Message")
				var chatId =  getChatID(obj.to, obj.from);
				if(chatDB[chatId]){
					chatDB[chatId].push(obj);
				}else{
					chatDB[chatId] = [];
					chatDB[chatId].push(obj);
				}
				if(usersDB[obj.to].online && usersDB[obj.to].socket ){
					usersDB[obj.to].socket.emit("event-get-msg", obj);
				}
				usersDB[obj.from].socket.emit("event-get-msg", obj);

		}

		function getChatHistory(obj){
			
			var chatId = getChatID(obj.to, obj.from);
			var chatData =  chatDB[chatId]||[];
			socket.emit('event-update-chat-history',chatData )

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