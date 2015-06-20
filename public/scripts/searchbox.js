var Search = React.createClass({
	render: function() {
		return (
			<div className="ui left icon input">
			  <input type="text" placeholder="Search title or tag..."/>
			  <i className="search  icon"></i>
			</div>
		);
	}
});


var DropDown = React.createClass({

	componentDidMount: function() {
		$('.ui.dropdown').dropdown();
	},

	render: function() {

		var nodes = this.props.data.map(function(node, index) {
			return (
				<div className="item" key={index}>
			        {node}
			    </div>
			);
		});

		return (
			<div className="ui floating labeled icon dropdown button">
			    <i className={'icon ' + this.props.icon}></i>
			    <span className="text">Filter by {this.props.filter}</span>
			    <div className="menu">
			      {nodes}
			    </div>
			</div>
		);
	}
});

var SearchBox = React.createClass({
	render: function() {

		var types = ['遺失', '拾獲'];
		var locations = ['一館', '二館', '三館', '五館', '六館', '七館', '圖書館'];
		var tags = ['錢包', '鑰匙', '手機', '書'] // TODO: fetch from server

		return (
			<div className="ui padded grid searchbox">
				<div className="sixteen wide column">
					<DropDown filter="type" icon="flag" data={types} />
					<DropDown filter="location" icon="map" data={locations} />
					<DropDown filter="tag" icon="tag" data={tags} />
					<Search />
				</div>
			</div>
		);
	}
});


React.render(
  <SearchBox />,
  document.getElementById('searchbox')
);