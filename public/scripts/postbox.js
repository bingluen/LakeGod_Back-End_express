var Carousel = React.createClass({

	setUpCarousel: function() {

		var id = this.props.id;
		var post = $('#' + id);
		var arrows = post.find('div.carouselNext, div.carouselPrev');

		// Set up hover 
		post.hover(function() {
	        arrows.addClass('visible');
	    }, function() {
	        arrows.removeClass('visible');
	    });

	    // Set up image gallery carousel
	    var carousel = post.find('.carousel ul');
	    var carouselSlideWidth = post.width();
	    var carouselWidth = 0;
	    var isAnimating = false;

	    // Building the width of the carousel
	    post.find('.carousel li').each(function() {
	        carouselWidth += carouselSlideWidth;
	    });

	    carousel.css('width', carouselWidth);

	    // Load next image
	    post.find('div.carouselNext').on('click', function() {
	        var currentLeft = Math.abs(parseInt(carousel.css("left")));
	        var newLeft = currentLeft + carouselSlideWidth;
	        if (newLeft >= carouselWidth || isAnimating === true) {
	            return;
	        }
	        carousel.css({
	            'left': "-" + newLeft + "px",
	            "transition": "300ms ease-out"
	        });
	        isAnimating = true;
	        setTimeout(function() {
	            isAnimating = false;
	        }, 300);
	    });

	    // Load previous image
	    post.find('div.carouselPrev').on('click', function() {
	        var currentLeft = Math.abs(parseInt(carousel.css("left")));
	        var newLeft = currentLeft - carouselSlideWidth;
	        if (newLeft < 0 || isAnimating === true) {
	            return;
	        }
	        carousel.css({
	            'left': "-" + newLeft + "px",
	            "transition": "300ms ease-out"
	        });
	        isAnimating = true;
	        setTimeout(function() {
	            isAnimating = false;
	        }, 300);
	    });
	},

	componentDidMount: function() {
		this.setUpCarousel();
	},

	render: function() {

		var photos = this.props.data.map(function(photo, index) {
			return (
				<li key={index}><img src={photo.url} /></li>
			);
		});

		return (
			<div className="carousel">
				<ul>
					{photos}
	            </ul>
	            <div className="arrows-perspective">
	              	<div className="carouselPrev">
	                	<div className="y"></div>
	                	<div className="x"></div>
	              	</div>
	              	<div className="carouselNext">
	                  	<div className="y"></div>
	                  	<div className="x"></div>
	              	</div>
	            </div>
			</div>
		);
	}
});

var Tag = React.createClass({

	render: function() {

		return (
			<a className="ui green label">
			    {this.props.name}
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
				<Tag name={tag.name} key={index} index={index} />
			);
		}, this);

		return (
			<div className="ui tag labels" style={{marginTop:5}}>
				{tags}
			</div>
		);
	}
});

var Content = React.createClass({
	render: function() {
		return (

				<div className="ui move reveal content">
					<div className="visible content">
				        <div><span className="title">{this.props.title}</span></div>
					    <div><span className="date">{this.props.uploadTime}</span></div>
					    <div><span className="description"> {this.props.location}</span></div>
					    <TagGroup data={this.props.tag}/>
					</div>
					<div className="hidden content">
						<p className="description">{this.props.description}</p>
					</div>
				</div>
        );
	}
});

var Post = React.createClass({

	render: function() {

		var id = 'post' + this.props.index;
		var	type = this.props.data.type;
		var	title = this.props.data.title;
		var	description = this.props.data.description;
		var	author_id = this.props.data.author_id;
		var	author_name = this.props.data.author_name;
		var	profile_img_url = 'http://graph.facebook.com/' + this.props.data.author_id + '/picture?type=normal';
		var	location = this.props.data.location;
		var	google_map_lat = this.props.data.map_lat;
		var	google_map_lng = this.props.data.map_lng;
		var	occure_time = this.props.data.occure_time;
		var	upload_time = this.props.data.upload_time;
		var	is_closed = this.props.data.is_closed;
		var	photo = this.props.data.photos;
		var tag = this.props.data.tag.slice(0,2);

		if (tag[0].name === '')
			tag = [];

		// moment format
		occure_time = moment(new Date(occure_time)).fromNow();
		upload_time = moment(new Date(upload_time)).fromNow();

		var themeColor = '#27BD8C'; 
		if (type == 'found')
			themeColor = '#27BD8C';
		else if (type == 'lost')
			themeColor = '#F5FF4F';

		var inlineStyle = {
			backgroundColor: themeColor
		};

		return (
			<div className="column">
				<div id={id} className='post' style={inlineStyle}>
	            	<img className='avatar' src={profile_img_url} />
	            	<Carousel id={id} data={photo}/>
	            	<Content type={type} title={title} location={location} uploadTime={upload_time} tag={tag} description={description}/>
	         	</div> 
         	</div>
		);
	}
});

var PostBox = React.createClass({
	render: function() {

		var posts = this.props.data.map(function(post, index) {
			return (
				<Post data={post} key={index} index={index} />
			);
		});

		return (
			<div className="ui stackable four column grid postbox">
				{posts}
			</div>
		);
	}
});
