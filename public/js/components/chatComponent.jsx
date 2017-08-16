(function(){
	var FriendChatBox = React.createClass({
		getInitialState : function () {
			return {
				message : "",
				friendChat : this.props.friendChat
			}
		},

		componentWillMount : function() {
			this.props.user.bindEvent('event-get-msg', this.recieveMessage);
		},

		componentWillReceiveProps : function(nextProps) {
			this.setState({friendChat : nextProps.friendChat});	
		},

		createMessage : function(event){
			this.setState({
				message : event.target.value
			});
		},

		sendMessage : function(friend, message){
			this.props.user.sendMessage(this.props.friend, this.state.message);
			this.setState({message : ""});
		},

		recieveMessage : function(messageObj){
			this.state.friendChat.push(messageObj);
			this.setState({
				friendChat : this.state.friendChat
			});
		},

		

		render: function() {
			var _this = this;
			return (
				<div className="col-sm-12 col-lg-12 chat-box-container ">
					<ul>
						{ this.state.friendChat.map(function(chat,index){
							
							return (
								<li>
									<div>
										{chat.from ==_this.props.myMobile &&<p className="text-right"> {chat.message} - ME </p>}
										{chat.from !=_this.props.myMobile &&<p className="text-left"> {_this.props.friend.name} - {chat.message }</p>}
									</div>	
								</li>
							)
						})}
						{this.state.friendChat && this.state.friendChat.length <=0 &&<li>No chat history yet </li>}
					
					</ul>
					<div className="chat-box">
						<input className="form-control" type ="text" placeholder ="Enter message" value= {this.state.message} onChange={this.createMessage}/>
						<button className = "btn btn-primary" onClick={this.sendMessage}>send</button>
					</div>
					
				</div>
			);
		}
	});	

	var FriendList = React.createClass({

		getInitialState : function(){
			return { 
				friend : undefined,
				friendList : {},
				friendChat : []
			}
		},

		componentWillMount : function() {
			this.props.user.bindEvent('event-get-users' , this.getFriends);
			this.props.user.bindEvent('event-update-chat-history', this.updateChatHistory)
			
		},
		componentDidMount : function() {
			this.props.user.addUser();
		},

		updateChatHistory : function(friendChat){
			this.setState({
				friendChat : friendChat||[]
			})
		},	

		getFriends : function (friendList){
			this.setState({friendList:friendList});
		},

		filterFiend : function(event){

		},

		getChatHistory : function(friend){
			
			var _this = this;
			this.setState({
				friend : friend,
				friendChat :[]
			}, function(){
				_this.props.user.getChatHistory(friend);
			});
		},

		render: function() {
			var _this = this;
			var friendList = _this.state.friendList;

			return (
				<div className="row friend-list-container">
					
					<div className="row col-sm-12 col-lg-5">

						<div className=" col-sm-12 col-lg-12 text-center ">
							<label><strong>Your Name : {this.props.name}</strong> </label><br/>
							<label><strong>Your Mobile : {this.props.mobile}</strong> </label>
							<hr/>
						</div>

						<div className=" row col-sm-12 col-lg-12">
							<div className="text-center col-sm-12  col-lg-12">
								Friend List
								<input className="form-control" type="text" placeholder="search for friend"/>
							</div>

							<ul className="row col-sm-12 col-lg-12 border border-primary">
							{
								Object.keys(friendList).map(function(friend, index){
									var btnClass = friendList[friend].online? " online ": " ";
									btnClass+= "btn rounded-circle ";
									return (
										<li className="row col-sm-12 col-lg-12 friend-detail rounded" key ={friend}  >
											<div className="col-sm-8 col-lg-8">
												<p>Name : {friendList[friend].name} </p>
												<p>Mobile: {friendList[friend].mobile}</p>
											</div>
											<div className="col-sm-2 col-lg-2">
												{/* {friendList[friend].online && <span className="online">Online</span>*/}
												<button  className={btnClass} onClick={_this.getChatHistory.bind(_this, friendList[friend])}>Chat</button>
											</div>	
										
										</li>
									)
								})
							}
							</ul>
						</div>
					</div>	

					<div className="row col-sm-12 col-lg-7">
						
						<FriendChatBox user={this.props.user} friend ={this.state.friend} friendChat = {this.state.friendChat}
							myMobile={this.props.mobile} myName={this.props.name} />
						
					</div>
					
					
				</div>
			)
		}
	});

	var JoinChatComp = React.createClass({
		//props - mobile , name
		getInitialState : function(){
			return {
				
			}	
		},
		
		getChatHistory : function(friend, cb){
			this.user.getChatHistory(friend, cb,this.props.mobile);
		},

		
		componentWillMount : function(){
			
			this.user = new User(this.props.name, this.props.mobile);
			// this.user.recieveMessage = this.recieveMessage;
		},

		
		render: function() {
			
			return (
				<div>
					
					<FriendList user = {this.user} mobile={this.props.mobile} name={this.props.name}/>
					
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
				<div id="login-comp" className="row col-sm-12 col-lg-8" >
					<div className=" col-sm-12 col-lg-12"> Welcome to My chat app</div>
					<div className="row col-sm-12 col-lg-12">
						<form onSubmit={this.onSubmit}>
						<input className="form-control" type="text" placeholder="Enter Name" value= {this.state.name} onChange={this.handleChange} name="name"/>
						<input className="form-control"  type="text" placeholder ="Enter Mobile"  value= {this.state.mobile}  onChange={this.handleChange} name="mobile"/>
						<br/>
						<input className="btn btn-primary" type="submit" value="Login"/>
					</form>
					</div>
					<div className=" col-sm-12 col-lg-12"> 
						you can use any name and some harcoded user mobile number like- 999,888,777,555 for seeing frined list
					</div>
				</div>	
			)
		}
	});

	var MyChatApp = React.createClass({

		getInitialState : function(){
			return {
				login : false,
				name :'' ,//''
				mobile : ''//""
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
						<div className="row text-center">
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
})()
