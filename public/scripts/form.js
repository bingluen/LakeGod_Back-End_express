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

	componentDidMount: function() {

		var timer = setInterval(function() {

			if(this.props.fbToken) {
				this.initUploadFile();
				clearInterval(timer);
			}
		}.bind(this), 100);
	},

	initUploadFile: function() {

		console.log(this.props.fbToken);

		$('#uploadPhoto').fileupload({

	        type: 'POST',
	        url: '/photo/uploadPhoto',
	        formData: {fb_token: this.props.fbToken},

	        progress: function(e, data) {
	        	console.log('progress');
	        	var progress = parseInt(data.loaded / data.total * 100, 10);
		        $('#progress .bar').css(
		            'width',
		            progress + '%'
		        );
	        },

	        add: function(e, data) {
	        	console.log('add');
	        	data.submit();
	        },

	        done: function(e, data) {
	        	console.log('done');
	        	console.log(data.result);
	        	this.props.addPhotoID(data.result.photo_id);
	        	$('#progress .bar').css(
		            'width',
		            0 + '%'
		        );
	        }.bind(this)
	    });
	},

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
				  	<input id="uploadPhoto" type="file" onChange={this.handleChange} />
				</div>
				{photos}
			</div>
		)
	}
});

var PostForm = React.createClass({

	componentDidMount: function() {
		$('.ui.form.postform').hide();
	},

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

	// for preview photo data url
	addPhoto: function(src) {
		
		this.setState({
			photo: this.state.photos.push({url: src})
		});
	},

	// for uploaded photo id
	addPhotoID: function(id) {

		this.setState({
			photoID: this.state.photoIDs.push(id)
		});

		console.log(this.state.photoIDs);
	},

	tagsToString: function(tags) {

		var str = '';

		for (var i = 0 ; i < tags.length ; i++) {

			if (i == tags.length - 1)
				str += (tags[i].name);
			else
				str += (tags[i].name + ',');
		}

		return str;
	},

	photoIDsToString: function(photoIDs) {

		var str = '';

		for (var i = 0 ; i < photoIDs.length ; i++) {

			if (i == photoIDs.length - 1)
				str += (photoIDs[i]);
			else
				str += (photoIDs[i] + ',');
		}

		return str;

	},

	handleSubmit: function() {

		var isValid = true;
		var title = this.refs.title.getDOMNode().value;
		var occureTime = this.refs.occureTime.getDOMNode().value;
		var location = this.refs.location.getDOMNode().value;
		var description = this.refs.description.getDOMNode().value;
		var tag = this.tagsToString(this.state.tags);
		var photoIDs = this.photoIDsToString(this.state.photoIDs);
		var type = this.props.type;
		var fb_token = this.props.fbToken;

		if (!fb_token) {
			console.log('Please login to facebook first.');
			return;
		}

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

		// add post to database
		if (isValid) {

			var url = '/post/addPost';

			var data = {
				title: title,
				tag: tag,
				description: description,
				photos : photoIDs,
				type: type,
				location: location,
				map_lat: 0,
				map_log: 0,
				occure_time: occureTime,
				fb_token: fb_token
			};

			console.log('data to upload:');
			console.log(data);

			$.post(url, data, function(data) {
				console.log('upload success, returned data:');
				console.log(data);
				$('.ui.form.postform').slideUp();
			});
		}
	},

	getInitialState: function() {
		return {
			titleInputClass: 'required field',
			occureTimeInputClass: 'required field',
			locationInputClass: 'required field',
			tags: [],
			photos: [],
			photoIDs: []
		};
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
			    	<div id="progress">
    					<div className="bar"></div>
					</div>
			    	<label>新增物品照片</label>
			    	<PhotoPreviewer fbToken={this.props.fbToken} data={this.state.photos} addPhoto={this.addPhoto} addPhotoID={this.addPhotoID} />
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