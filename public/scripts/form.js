var Tag = React.createClass({

	handleClick: function() {
		this.props.onClick(this.props.index);
	},

	render: function() {

		var removeIconStyle = {
			marginLeft: 10,
			marginRight: 0
		};

		return (
			<a className="ui label" onClick={this.handleClick}>
			    {this.props.name}
			    <i className="icon remove" style={removeIconStyle}></i>
			</a>
		);
	}
});

var TagGroup = React.createClass({

	handleClick: function(index) {
		this.props.onClick(index);
	},

	render: function() {

		var tags = this.props.data.map(function(tag, index) {
			return (
				<Tag name={tag.name} key={index} index={index} onClick={this.handleClick} />
			);
		}, this);

		return (
			<div className="ui tag labels">
				{tags}
			</div>
		);
	}
});

var Photo = React.createClass({
	render: function() {
		return (
			<img src={this.props.src} />
		);
	}
});

var PhotoPreviewer = React.createClass({

	handleChange: function(e) {

		// pointer to PhotoPreviewer(the React class object)
		// 'this' in reader.onload does not point to PhotoPreviewer, it refers to reader (FileReader object)
		// we need to call PhotoPreviewer's method, so we need to save the pointer to 'self' variable
		var reader = new FileReader();
		var file = e.target.files[0];
	
		reader.onload = function(e) {

             this.props.addPhoto(e.target.result);

        }.bind(this);

	    reader.readAsDataURL(file);
	},

	render: function() {

		var photos = this.props.data.map(function(photo, index) {
			return (
				<Photo index={index} key={index} src={photo.url} />
			);
		});

		return(
			<div className="photo-previewer">
				<div className="ui icon button">
					<i className="photo large icon"></i>
				  	<input type="file" onChange={this.handleChange} />
				</div>
				{photos}
			</div>
		)
	}
});

var PostForm = React.createClass({

	// refresh tag input text 
	handleTagInputChange: function(e) {
		this.setState({tagInput: e.target.value});
	},

	addTag: function() {

		var tagName = this.refs.tag.getDOMNode().value;

		// update tags state, then clear and focus tag input
		if (tagName) {

			this.setState({
				tagInput: '',
				tag: this.state.tags.push({name: tagName})
			});

			React.findDOMNode(this.refs.tag).focus();
		}
	},

	removeTag: function(index) {

		this.setState({
			tag: this.state.tags.splice(index, 1)
		});
	},

	addPhoto: function(src) {
		
		this.setState({
			photo: this.state.photos.push({url: src})
		});

		console.log(this.state.photos);
	},

	handleSubmit: function() {

		var isValid = true;
		var title = this.refs.title.getDOMNode().value;
		var occureTime = this.refs.occureTime.getDOMNode().value;
		var location = this.refs.location.getDOMNode().value;
		var description = this.refs.description.getDOMNode().value;
		var tag = this.state.tags;

		// change input error style
		if (!title) {
			this.setState({titleInputClass: 'required field error'});
			isValid = false;
		} else this.setState({titleInputClass: 'required field'});

		// change input error style
		if (!occureTime) {
			this.setState({occureTimeInputClass: 'required field error'});
			isValid = false;
		} else this.setState({occureTimeInputClass: 'required field'});

		// change input error style
		if (!location) {
			this.setState({locationInputClass: 'required field error'});
			isValid = false;
		} else this.setState({locationInputClass: 'required field'});

		// TODO : add post to database
	},

	getInitialState: function() {
		return {
			titleInputClass: 'required field',
			occureTimeInputClass: 'required field',
			locationInputClass: 'required field',
			tags: [],
			photos: []
		};
	},

	// when Form component is ready, it is initailly hidden
	componentDidMount: function() {
		$('.ui.form.postform').hide();
	},

	render: function() {

		var type = '';

		// when the post button of Header component is triggered
		// it communicates to the form by passing the chosen post 'type' to 
		// this.props of Form component
		if (this.props.type == 'found')
			type = '拾獲';
		else if (this.props.type == 'lost')
			type = '遺失';

		// slide up or down 
		if (!this.props.isVisible) 
			$('.ui.form.postform').slideUp();
		else
			$('.ui.form.postform').slideDown();

		return (
			<div className="ui form postform">
				<div className={this.state.titleInputClass}>
					<label>物品名稱</label>
			      	<input type="text" ref="title" placeholder="輸入物品名稱" />
			    </div>
			    <div className={this.state.occureTimeInputClass}>
			      	<label>{type + '時間'}</label>
			      	<input type="text" ref="occureTime" placeholder={'輸入' + type + '時間'} />
			    </div>
			    <div className={this.state.locationInputClass}>
			      	<label>{type + '地點'}</label>
			      	<input type="text" ref="location" placeholder={'輸入' + type + '地點'} />
			    </div>
			    <div className="field">
			    	<label>新增與此物品相關的標籤，以利搜尋</label>
			    	<div className="ui right action input">
			    		<input type="text" ref="tag" placeholder="輸入標籤" value={this.state.tagInput} onChange={this.handleTagInputChange} />
					  	<button className="ui icon button" onClick={this.addTag} >
					    	<i className="plus icon"></i>
					  	</button>
					</div>
			    </div>
			    <TagGroup data={this.state.tags} onClick={this.removeTag}/>
			    <div className="field">
			    	<label>新增物品照片</label>
			    	<PhotoPreviewer data={this.state.photos} addPhoto={this.addPhoto}/>
			    </div>
			    <div className="field">
				  	<label>描述文字</label>
				    <textarea ref="description" placeholder="輸入描述文字"></textarea>
				</div>
				<div className="ui right aligned gird">
					<div className="button-container">
						<div className="ui positive right labeled icon button right floated" onClick={this.handleSubmit} style={{marginLeft: 10, marginRight: 0}}>
			      			上傳貼文
			      			<i className="checkmark icon"></i>
			    		</div>
			  			<div className="ui button right floated" onClick={this.props.onCancle}>
			      			取消
			    		</div>
		    		</div>
		    	</div>
			</div>
		);
	}
});