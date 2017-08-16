var FriendChatBox = React.createClass({
	getInitialState : function () {
		return {
			friendChat : [],
			message : ""
		}
	},

	componentWillReceiveProps(nextProps) {
		
		this.setState({friendChat : nextProps.friendChat});	
	},

	createMessage : function(event){
		this.setState({
			message :event.target.value
		})
	},

	sendMessage : function(){
		this.props.sendMessage(this.state.friend, this.state.message);
	},


	componentDidMount : function(){

	},

	render: function() {
		var _this = this;
		return (
			<div className="chat-box-container ">
				<ul class= "chat-box">
					{ this.state.friendChat.map(function(chat,index){
						return (
							<li>
								<div>
									<p>{chat.from==_this.props.myMobile? "Me": chat.from } {chat.message}</p>
								</div>	
							</li>
						)
					})}
				
				</ul>
				<div>
					<input type ="text" placeholder ="Enter message" onChange={this.createMessage}/>
					<button onClick={this.sendMessage}>send</button>
				</div>
				
			</div>
		);
	}
});


var FriendList = React.createClass({

	getInitialState : function(){
		return { 
			friend : undefined,
			friendChat : []
		}
	},

	getChatHistory : function(friend){
		var _this = this;
		this.setState({
			friend : friend
		}, function(){
			_this.props.getChatHistory(friend, function(chatData){
				_this.setState({
					friendChat : chatData
				})
			});
		});
	},

	render: function() {
		var _this = this;
		var friendList = this.props.friendList;
		return (
			<div className="row-fluid friend-list-container">   
				<div className="span4">
					<ul>
					{
						Object.keys(friendList).map(function(friend, index){
							return (
								<li className="row-fluid friend-detail" key ={friend}  >
									<div className="span8">
										<p>Name : {friendList[friend].name} </p>
										<p>Mobile: {friendList[friend].mobile}</p>
										</div>
									<div className="span4">
										{friendList[friend].online && <span className="online">Online</span>}
										<br/>
										<div className="btn send-message" onClick={_this.getChatHistory.bind(_this, friendList[friend])}>Send Message</div>
									</div>	
								
								</li>
							)
						})
					}
					</ul>
				</div>	
				<div className="span8">
					<FriendChatBox friend ={this.state.friend} friendChat = {this.state.friendChat}
					 myMobile={this.props.mobile} myName={this.props.name} sendMessage={this.props.sendMessage}/>
				</div>
			</div>
		)
	}
});



var JoinChatComp = React.createClass({
	//props - mobile , name
	getInitialState : function(){
	 	return {
			friendList : {},
			friendChat : []
		 }	
	},
	
	getChatHistory : function(friend, cb){
		this.user.getChatHistory(friend, cb,this.props.mobile);
	},

	sendMessage : function(friend, message){
		debugger;
		this.user.sendMessage(friend, message);
	},

	recieveMessage : function(chatObj){
		thi.setState({
			friendChat : this.friendChat.push(chatObj)
		});
	},
	componentDidMount : function(){
		debugger;
		this.user = new User(this.props.name, this.props.mobile);
		this.user.getFriends = this.getFriends;
		this.user.recieveMessage = this.recieveMessage;
		this.user.connect();
	},

	getFriends : function (userData){
		this.setState({friendList:userData});
	},

	render: function() {
		var props = this.props;
		return (
			<div>
				<div>
					<div className="span12" >
						<label>Name : {props.name} </label>
						<label>Mobile : {props.mobile} </label>
					</div>
				
					<FriendList friendList = {this.state.friendList} mobile={props.mobile} name={props.name}
							getChatHistory = {this.getChatHistory} sendMessage = {this.sendMessage}/>
				</div>
				
		
			</div>	
		)
	}
});

var LoginComp = React.createClass({

	getInitialState: function(){
		return {
			name :"",
			mobile : ""
		}
	},

	onSubmit : function(event){
		event.preventDefault();
		event.stopPropagation();
		this.props.loginApp(this.state);

	},

	handleChange : function(event){
		var target = event.target;
		this.state[target.name] = target.value;
		this.setState({
			state : this.state
		});
	},

	render: function() {
		return (
			<div id="login-comp" className="span12">
				<form onSubmit={this.onSubmit}>
					<input type="text" placeholder="Enter Name" value= {this.state.name} onChange={this.handleChange} name="name"/>
					<input type="text" placeholder ="Enter Mobile"  value= {this.state.mobile}  onChange={this.handleChange} name="mobile"/>
					<input type="submit"  value ="join"/>
				</form>
			</div>	
		)
	}
});

var MyChatApp = React.createClass({

	getInitialState : function(){
	 	return {
			login : false,
			name :"",
			mobile : ""
		 }	
	},

	loginApp : function(value){
		this.setState({
			name :value.name,
			mobile : value.mobile,
			login : true
		})	
	},

	render: function() {
		return (
				<div className="container-fluid">
					<div className="row-fluid">
					{this.state.login
						? <JoinChatComp name={this.state.name} mobile={this.state.mobile}/>
						: <LoginComp loginApp = {this.loginApp}/>
					}
					</div>
				</div>	
				
			
		)
	}
});



ReactDOM.render(<MyChatApp/>, document.getElementById('app'));