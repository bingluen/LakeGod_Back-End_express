var Dropdown = React.createClass({

	componentDidMount: function() {
		$('.ui.dropdown.' + this.props.filter).dropdown({
			onChange: this.props.onFilterChange,
		});
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
			<div className={'ui dropdown floating labeled icon button ' + this.props.filter}>
			    <i className={'icon ' + this.props.icon}></i>
			    <span className="text">Filter by {this.props.filter}</span>
			    <div className="menu">
			      {nodes}
			    </div>
			</div>
		);
	}
});

var SearchInput = React.createClass({

	handleFilterChange: function() {
		var val =  this.refs.searchfilter.getDOMNode().value;
		this.props.onFilterChange(val);
	},

	render: function() {
		return (
			<div className="ui left icon input">
			  <input type="text" ref="searchfilter" onChange={this.handleFilterChange} placeholder={'Search ' + this.props.filter}/>
			  <i className={'icon ' + this.props.icon}></i>
			</div>
		);
	}
});

var SearchButton = React.createClass({
	render: function() {
		return (
			<div className="ui animated teal button" onClick={this.props.onClick} >
			  <div className="visible content">Search</div>
			  <div className="hidden content">
			    <i className="search icon"></i>
			  </div>
			</div>
		);
	}
});

var Filters = React.createClass({

	// when type dropdown on change, we set type value
	handleTypeFilterChange: function(val) {

		console.log(val);

		this.setState({type: val});
	},

	// when location input on change, we set location value
	handleLocationFilterChange: function(val) {
		this.setState({location: val});
	},

	// when tag input on change, we set tag value
	handleTagFilterChange: function(val) {
		this.setState({tag: val});
	},

	// when title input on change, we set title value
	handleTitleFilterChange: function(val) {
		this.setState({title: val});
	},

	// when the search button is triggered, we merge all the filter values to a object,
	// then send the filter object to the parent component, and let the component handle it
	handleFilterRequest: function() {
		var filter = {
			type: this.state.type,
			location: this.state.location,
			tag: this.state.tag,
			title: this.state.title 
		}

		this.props.onFilter(filter);
	},

	getInitialState: function() {
		return {
			type: '', 
			location: '', 
			tag: '', 
			title: ''
		};
	},

	render: function() {

		var types = ['不分類', '遺失', '拾獲'];

		return (
			<div className="ui padded grid searchbox">
				<div className="sixteen wide column">
					<Dropdown filter="type" icon="flag" data={types} onFilterChange={this.handleTypeFilterChange} />
					<SearchInput filter="location" icon="map" onFilterChange={this.handleLocationFilterChange} />
					<SearchInput filter="tag" icon="tag" onFilterChange={this.handleTagFilterChange} />
					<SearchInput filter="title" icon="align left" onFilterChange={this.handleTitleFilterChange} />
					<SearchButton onClick={this.handleFilterRequest}/>
				</div>
			</div>
		);
	}
});
