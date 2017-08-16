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
	



;(function () {
	var FriendChatBox = React.createClass({
		displayName: "FriendChatBox",

		getInitialState: function () {
			return {
				message: "",
				friendChat: this.props.friendChat
			};
		},

		componentWillMount: function () {
			this.props.user.bindEvent('event-get-msg', this.recieveMessage);
		},

		componentWillReceiveProps: function (nextProps) {
			this.setState({ friendChat: nextProps.friendChat });
		},

		createMessage: function (event) {
			this.setState({
				message: event.target.value
			});
		},

		sendMessage: function (friend, message) {
			this.props.user.sendMessage(this.props.friend, this.state.message);
			this.setState({ message: "" });
		},

		recieveMessage: function (messageObj) {
			this.state.friendChat.push(messageObj);
			this.setState({
				friendChat: this.state.friendChat
			});
		},

		render: function () {
			var _this = this;
			return React.createElement(
				"div",
				{ className: "col-sm-12 col-lg-12 chat-box-container " },
				React.createElement(
					"ul",
					null,
					this.state.friendChat.map(function (chat, index) {

						return React.createElement(
							"li",
							null,
							React.createElement(
								"div",
								null,
								chat.from == _this.props.myMobile && React.createElement(
									"p",
									{ className: "text-right" },
									" ",
									chat.message,
									" - ME "
								),
								chat.from != _this.props.myMobile && React.createElement(
									"p",
									{ className: "text-left" },
									" ",
									_this.props.friend.name,
									" - ",
									chat.message
								)
							)
						);
					}),
					this.state.friendChat && this.state.friendChat.length <= 0 && React.createElement(
						"li",
						null,
						"No chat history yet "
					)
				),
				React.createElement(
					"div",
					{ className: "chat-box" },
					React.createElement("input", { className: "form-control", type: "text", placeholder: "Enter message", value: this.state.message, onChange: this.createMessage }),
					React.createElement(
						"button",
						{ className: "btn btn-primary", onClick: this.sendMessage },
						"send"
					)
				)
			);
		}
	});

	var FriendList = React.createClass({
		displayName: "FriendList",


		getInitialState: function () {
			return {
				friend: undefined,
				friendList: {},
				friendChat: []
			};
		},

		componentWillMount: function () {
			this.props.user.bindEvent('event-get-users', this.getFriends);
			this.props.user.bindEvent('event-update-chat-history', this.updateChatHistory);
		},
		componentDidMount: function () {
			this.props.user.addUser();
		},

		updateChatHistory: function (friendChat) {
			this.setState({
				friendChat: friendChat || []
			});
		},

		getFriends: function (friendList) {
			this.setState({ friendList: friendList });
		},

		filterFiend: function (event) {},

		getChatHistory: function (friend) {

			var _this = this;
			this.setState({
				friend: friend,
				friendChat: []
			}, function () {
				_this.props.user.getChatHistory(friend);
			});
		},

		render: function () {
			var _this = this;
			var friendList = _this.state.friendList;

			return React.createElement(
				"div",
				{ className: "row friend-list-container" },
				React.createElement(
					"div",
					{ className: "row col-sm-12 col-lg-5" },
					React.createElement(
						"div",
						{ className: " col-sm-12 col-lg-12 text-center " },
						React.createElement(
							"label",
							null,
							React.createElement(
								"strong",
								null,
								"Your Name : ",
								this.props.name
							),
							" "
						),
						React.createElement("br", null),
						React.createElement(
							"label",
							null,
							React.createElement(
								"strong",
								null,
								"Your Mobile : ",
								this.props.mobile
							),
							" "
						),
						React.createElement("hr", null)
					),
					React.createElement(
						"div",
						{ className: " row col-sm-12 col-lg-12" },
						React.createElement(
							"div",
							{ className: "text-center col-sm-12  col-lg-12" },
							"Friend List",
							React.createElement("input", { className: "form-control", type: "text", placeholder: "search for friend" })
						),
						React.createElement(
							"ul",
							{ className: "row col-sm-12 col-lg-12 border border-primary" },
							Object.keys(friendList).map(function (friend, index) {
								var btnClass = friendList[friend].online ? " online " : " ";
								btnClass += "btn rounded-circle ";
								return React.createElement(
									"li",
									{ className: "row col-sm-12 col-lg-12 friend-detail rounded", key: friend },
									React.createElement(
										"div",
										{ className: "col-sm-8 col-lg-8" },
										React.createElement(
											"p",
											null,
											"Name : ",
											friendList[friend].name,
											" "
										),
										React.createElement(
											"p",
											null,
											"Mobile: ",
											friendList[friend].mobile
										)
									),
									React.createElement(
										"div",
										{ className: "col-sm-2 col-lg-2" },
										React.createElement(
											"button",
											{ className: btnClass, onClick: _this.getChatHistory.bind(_this, friendList[friend]) },
											"Chat"
										)
									)
								);
							})
						)
					)
				),
				React.createElement(
					"div",
					{ className: "row col-sm-12 col-lg-7" },
					React.createElement(FriendChatBox, { user: this.props.user, friend: this.state.friend, friendChat: this.state.friendChat,
						myMobile: this.props.mobile, myName: this.props.name })
				)
			);
		}
	});

	var JoinChatComp = React.createClass({
		displayName: "JoinChatComp",

		//props - mobile , name
		getInitialState: function () {
			return {};
		},

		getChatHistory: function (friend, cb) {
			this.user.getChatHistory(friend, cb, this.props.mobile);
		},

		componentWillMount: function () {

			this.user = new User(this.props.name, this.props.mobile);
			// this.user.recieveMessage = this.recieveMessage;
		},

		render: function () {

			return React.createElement(
				"div",
				null,
				React.createElement(FriendList, { user: this.user, mobile: this.props.mobile, name: this.props.name })
			);
		}
	});

	var LoginComp = React.createClass({
		displayName: "LoginComp",


		getInitialState: function () {
			return {
				name: "",
				mobile: ""
			};
		},

		onSubmit: function (event) {
			event.preventDefault();
			event.stopPropagation();
			this.props.loginApp(this.state);
		},

		handleChange: function (event) {
			var target = event.target;
			this.state[target.name] = target.value;
			this.setState({
				state: this.state
			});
		},

		render: function () {
			return React.createElement(
				"div",
				{ id: "login-comp", className: "row col-sm-12 col-lg-8" },
				React.createElement(
					"div",
					{ className: " col-sm-12 col-lg-12" },
					" Welcome to My chat app"
				),
				React.createElement(
					"div",
					{ className: "row col-sm-12 col-lg-12" },
					React.createElement(
						"form",
						{ onSubmit: this.onSubmit },
						React.createElement("input", { className: "form-control", type: "text", placeholder: "Enter Name", value: this.state.name, onChange: this.handleChange, name: "name" }),
						React.createElement("input", { className: "form-control", type: "text", placeholder: "Enter Mobile", value: this.state.mobile, onChange: this.handleChange, name: "mobile" }),
						React.createElement("br", null),
						React.createElement("input", { className: "btn btn-primary", type: "submit", value: "Login" })
					)
				),
				React.createElement(
					"div",
					{ className: " col-sm-12 col-lg-12" },
					"you can use any name and some harcoded user mobile number like- 999,888,777,555 for seeing frined list"
				)
			);
		}
	});

	var MyChatApp = React.createClass({
		displayName: "MyChatApp",


		getInitialState: function () {
			return {
				login: false,
				name: '', //''
				mobile: '' //""
			};
		},

		loginApp: function (value) {
			this.setState({
				name: value.name,
				mobile: value.mobile,
				login: true
			});
		},

		render: function () {
			return React.createElement(
				"div",
				{ className: "container-fluid" },
				React.createElement(
					"div",
					{ className: "row text-center" },
					this.state.login ? React.createElement(JoinChatComp, { name: this.state.name, mobile: this.state.mobile }) : React.createElement(LoginComp, { loginApp: this.loginApp })
				)
			);
		}
	});

	ReactDOM.render(React.createElement(MyChatApp, null), document.getElementById('app'));
})();
