var SignInPrompt = React.createClass({
	render: function() {
		return (
			<div className="ui modal">
			  <i className="close icon"></i>
			  <div className="header">
			    Profile Picture
			  </div>
			  <div className="content">
			    <div className="ui medium image">
			      <img src="/images/goddess.png"/>
			    </div>
			    <div className="description">
			      <div className="ui header">We have auto-chosen a profile image for you.</div>
			      <p>We have grabbed the following image from the <a href="https://www.gravatar.com" target="_blank">gravatar</a> image associated with your registered e-mail address.</p>
			      <p>Is it okay to use this photo?</p>
			    </div>
			  </div>
			  <div className="actions">
			    <div className="ui black button">
			      Nope
			    </div>
			    <div className="ui positive right labeled icon button">
			      Yep, that is me
			      <i className="checkmark icon"></i>
			    </div>
			  </div>
			</div>
		);
	}
});

var Dimmer = React.createClass({

	// show different type of PostModal
	handleClick: function() {

		if (this.props.type == 'found')
			this.props.onPost('found');

		else if (this.props.type == 'lost')
			this.props.onPost('lost');
	},

	componentDidMount: function() {
		$('.ui.dimmer').dimmer({
		  on: 'hover'
		});
	},

	render: function() {
		return	(
			<div className="ui dimmer">
				<div className="content">
				    <div className="center">
				      	<div className={'ui inverted button ' + this.props.buttonColor} onClick={this.handleClick}>
				      		{this.props.buttonText}
				      	</div>
				    </div>
				</div>
			</div>
		);
	}
});

var FoundBlock = React.createClass({
	render: function() {

		var inlineStyle = {
			backgroundImage: 'url(images/goddess-bg.png)',
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center center',
			backgroundColor: '#27BD8C',
		};

		return (
			<div className="column center aligned block" style={inlineStyle}>
				<Dimmer type="found" buttonText="張貼拾獲貼文" buttonColor="teal" onPost={this.props.onPost} />
				<h2 className="ui inverted header">你是湖水女神</h2>
			   	<img className="ui small centered image" src="images/goddess.png" />
			</div>
		);
	}
});

var LostBlock = React.createClass({
	render: function() {

		var inlineStyle = {
			backgroundImage: 'url(images/woodman-bg.png)',
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center center',
			backgroundColor: '#f5ff4f',
		};

		return (
			<div className="column center aligned block" style={inlineStyle}>
				<Dimmer type="lost" buttonText="張貼協尋貼文" buttonColor="yellow" onPost={this.props.onPost} />
			    <h2 className="ui header">你是樵夫</h2>
			    <img className="ui small circular centered image" src="images/woodman.png" />
			</div>
		);
	}
});

var Header = React.createClass({
	render: function() {
		return (
			<div>
				<div className="ui stackable two column grid header">
					<FoundBlock onPost={this.props.onPost} />
					<LostBlock onPost={this.props.onPost} />
				</div>
			</div>
		);
	}
});