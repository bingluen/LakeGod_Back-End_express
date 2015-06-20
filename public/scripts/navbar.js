var LoginButton = React.createClass({
	render: function() {
		return (
			<div className="ui teal button" onClick={this.props.onLogin}>
				<i className="facebook icon"></i>
				Sign In
			</div>
		);
	}
});

var MyButton = React.createClass({

	componentDidMount: function() {
		$('.dropdown').dropdown({
			action: 'hide'
		});
	},

	render: function() {
		return (
			<div className="ui floating labeled icon dropdown teal button">
			    <i className="dropdown icon"></i>
			    <span className="text">我</span>
			    <div className="right menu">
			    	<div className="item">
			        	我的貼文
			    	</div>
			    	<div className="item" onClick={this.props.onLogout}>
			        	登出
			    	</div>
			    </div>
			</div>
		);
	}
});

var Navbar = React.createClass({

	// when the component is ready, loadPostsFromServer() is fired
	componentDidMount: function() {
		this.fbInit();
	},

	fbInit: function() {

		window.fbAsyncInit = function() {
			FB.init({
				appId      : '769053909857578',
				cookie     : true,  // enable cookies to allow the server to access the session
				xfbml      : true,  // parse social plugins on this page
				version    : 'v2.3' // use version 2.3
			});

			// Now that we've initialized the JavaScript SDK, we call
			// FB.getLoginStatus().  This function gets the state of the
			// person visiting this page and can return one of three states to
			// the callback you provide.  They can be:
			//
			// 1. Logged into your app ('connected')
			// 2. Logged into Facebook, but not your app ('not_authorized')
			// 3. Not logged into Facebook and can't tell if they are logged into
			//    your app or not.
			//
			// These three cases are handled in the callback function.
			FB.getLoginStatus(this.statusChangeCallback);
		}.bind(this);

		// Load the SDK asynchronously
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	},

	// Here we run a very simple test of the Graph API after login is
	// successful.  See statusChangeCallback() for when this call is made.
	getFacebookUserData: function() {

		console.log('Welcome!  Fetching your information.... ');

		FB.api('/me', function(response) {
			console.log('Successful login for: ' + response.name);
		});
	},

	userLogin: function(res) {

		console.log(res);

		var url = '54.169.158.27:3348/user/login/' + res.authResponse.accessToken;

		$.get(url, function(data, status) {
			console.log(status);
			this.setState({signedIn: true}); // Set the button state
		});
	},

	// This is called with the results from from FB.getLoginStatus(), FB.login(), FB.logout().
	statusChangeCallback: function(response) {
	  	console.log('statusChangeCallback');
	 	console.log(response);
		// The response object is returned with a status field that lets the
		// app know the current login status of the person.
		// Full docs on the response object can be found in the documentation
		// for FB.getLoginStatus().
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
			this.getFacebookUserData();
			this.userLogin(response);

		} else if (response.status === 'not_authorized') {
			// The person is logged into Facebook, but not your app.
			console.log('Please log into this app.');

		} else {
			// The person is not logged into Facebook, so we're not sure if
			// they are logged into this app or not.
			console.log('Please log into Facebook.');
			this.setState({signedIn: false}); // Set the button state
		}
	},

	handleLogin: function() {
		FB.login(this.statusChangeCallback);
	},

	handleLogout: function() {
		FB.logout(this.statusChangeCallback);
	},

	getInitialState: function() {
		return {
			signedIn: false
		};
	},

	render: function() {

		var title = '湖水女神';
		var button = (!this.state.signedIn) ? <LoginButton onLogin={this.handleLogin}/> 
					: <MyButton onLogout={this.handleLogout}/>;

		return (
			<div>
				<div className="ui large inverted menu navbar">
					<a className="item">{title}</a>
					<div className="item right aligned">
						{button}
					</div>
				</div>
			</div>
		);
	}
});