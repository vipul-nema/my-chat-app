var FriendChatBox = React.createClass({
	getInitialState : function () {
		return {
			to : this.props.to,
			newMessage : "",
			pastMessage : []
		}
	},

	createMessage : function(event){
		this.setState({
			newMessage : event.target.value
		})
	},

	componentDidMount : function(){

	},

	render: function() {
		return (
			<div className="span6 chat-box-container ">
				<p> To :{this.state.to}</p>
				<ul class= "chat-box">
					{ this.state.pastMessage.map(function(messageObj,index){
						return (
							<li>
								<div>
									<span>{messageObj.from}</span>
									<p>{messageObj.message}</p>
								</div>	
							</li>
						)
					})}
				</ul>
				
				<div>
					<input type ="text" placeholder ="Enter message" onChange={this.createMessage}/>
					<label>send</label>
				</div>
				
			</div>
		);
	}
});


var FriendList = React.createClass({

	getInitialState : function(){
		return {
			
		}
	},

	render: function() {
		var _this = this;
		var friendList = this.props.friendList;
		return (
			<div className="span4 friend-list-container">
				<ul>
					{
						Object.keys(friendList).map(function(friend, index){
							return (
								<li className="row-fluid friend-detail" key ={friend}>
									<div className="span8">
										<p>Name : {friendList[friend].name} </p>
										<p>Mobile: {friendList[friend].mobile}</p>
										</div>
									<div className="span4">
										{friendList[friend].online && <span className="online">Online</span>}
										<br/>
										<div className="btn send-message" onClick={sendMessage.bind(this, friendList[friend])}>Send Message</div>
									</div>	
								
								</li>
							)
						})
					}
				</ul>	
				
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

var JoinChatComp = React.createClass({
	getInitialState : function(){
	 	return {
			friendList : {}
		 }	
	},
	componentDidMount : function(){
		debugger;
		this.user = new User(this.props.name, this.props.mobile);
		this.user.getUser = this.getUser;
		this.user.getMessage = this.getMessage;
		this.user.connect();
	},

	getUser : function (userData){
		this.setState({friendList:userData});
	},

	getMessage:function (from, message){
		debugger;
	},
	
	render: function() {
		var props = this.props;
		return (
			<div>
				<div className="span12" >
					<label>Name : {props.name} </label>
					<label>Mobile : {props.mobile} </label>
				</div>
				
				<FriendList friendList = {this.state.friendList} />
				<FriendChatBox name= {props.name} mobile = {props.mobile}s />
		
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