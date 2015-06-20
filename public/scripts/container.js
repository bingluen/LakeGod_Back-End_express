var ListContainer = React.createClass({

	// TODO: send filter ajax request to server and reload the filtered data from server and set data
	handleFilter: function(filter) {
		console.log(filter);
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
	loadPostsFromServer: function() {
		$.ajax({
		    url: this.props.url,
		    dataType: 'json',
		    success: function(data) {
		    	this.setState({data: data});
		    }.bind(this),
		    error: function(xhr, status, err) {
		    	console.error(this.props.url, status, err.toString());
		    }.bind(this)
		});
	},

	getInitialState: function() {
		return {
			data: [],
			PostformType: '',
			formIsVisible: false
		};
	},

	// when the component is ready, loadPostsFromServer() is fired
	componentDidMount: function() {
		this.loadPostsFromServer();
	},

	render: function() {
		return (
			<div>
				<Navbar />
				<Header onPost={this.showPostForm} onPost={this.showPostModal} />
				<PostForm type={this.state.PostformType} isVisible={this.state.formIsVisible} onCancle={this.hidePostModal} />
				<Filters onFilter={this.handleFilter} />
				<PostBox data={this.state.data} />
			</div>
		);
	}
});

React.render(
  <ListContainer url="posts.json" />,
  document.getElementById('container')
);