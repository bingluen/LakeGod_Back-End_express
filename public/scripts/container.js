var ListContainer = React.createClass({

	// TODO: send filter ajax request to server and reload the filtered data from server and set data
	handleFilter: function(filter) {

		if (filter.type === '')
			filter.type = 'all';

		console.log(filter);

		var url = '/post/search';

		$.post(url, filter, function(json, state) {

			var data = json.data;

			// process data
			for (var i = 0 ; i < data.length ; i++) {
				data[i].type = data[i].type.toLowerCase();
				data[i].tag = this.stringToTagArray(data[i].tag);
				data[i].photos = this.stringToPhotoArray(data[i].photos);
			}

			console.log(data);

			this.setState({data: data});
		}.bind(this));
	},

	showPostModal: function(type) {
		this.setState({
			PostformType: type,
			formIsVisible: true
		});
	},

	hidePostModal: function() {
		this.setState({
			formIsVisible: false
		});
	},

	// get posts data from server and set data
	loadPostsFromServer: function(url) {

		this.setState({data: []});

		$.get(url, function(json, state) {

			var data = json.data;

			// process data
			for (var i = 0 ; i < data.length ; i++) {
				data[i].type = data[i].type.toLowerCase();
				data[i].tag = this.stringToTagArray(data[i].tag);
				data[i].photos = this.stringToPhotoArray(data[i].photos);
			}

			console.log(data);

			this.setState({data: data});

		}.bind(this));
	},

	handleMyPost: function() {

		var timer = setInterval(function() {

			if(this.state.fb_token) {

				var url = '/user/myPost/' + this.state.fb_token;
				this.loadPostsFromServer(url);
				clearInterval(timer);
			}
		}.bind(this), 100);
	},

	handleReloadPage: function() {

		var url = '/post/getPost/list/' + this.state.type + '/' + this.state.page; 

		this.loadPostsFromServer(url);
	},

	stringToTagArray: function(_tag) {

		var tag = _tag.split(',');
		var result = [];

		for (var i = 0 ; i < tag.length ; i++) {

			var item = { name: '' };
			item.name = tag[i];
			result.push(item);
		}

		return result;
	},

	stringToPhotoArray: function(_photos) {

		var photos = _photos.split(',');
		var result = [];

		for (var i = 0 ; i < photos.length ; i++) {

			var item = { url: '' };
			item.url = photos[i];
			result.push(item);
		}

		return result;
	},

	saveFbToken: function(fb_token) {

		this.setState({fb_token: fb_token});
	},

	getInitialState: function() {
		return {
			data: [],
			PostformType: '',
			formIsVisible: false,
			type: 'all',
			page: 0,
			fb_token: ''
		};
	},

	// when the component is ready, loadPostsFromServer() is fired
	componentDidMount: function() {

		var url = '/post/getPost/list/' + this.state.type + '/' + this.state.page; 

		this.loadPostsFromServer(url);
	},

	render: function() {
		return (
			<div>
				<Navbar onReloadPage={this.handleReloadPage} onMyPost={this.handleMyPost} saveFbToken={this.saveFbToken} />
				<Header onPost={this.showPostForm} onPost={this.showPostModal} />
				<PostForm fbToken={this.state.fb_token} type={this.state.PostformType} isVisible={this.state.formIsVisible} onCancle={this.hidePostModal} />
				<Filters onFilter={this.handleFilter} />
				<PostBox data={this.state.data} />
			</div>
		);
	}
});

React.render(
  <ListContainer />,
  document.getElementById('container')
);