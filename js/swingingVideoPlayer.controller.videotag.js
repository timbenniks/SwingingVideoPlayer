swingingVideoPlayer.controller.videotag = function(options)
{		
	this.options 		= options;
	this.video 	 		= $('video', this.options.element);
		
	this.init();
};

swingingVideoPlayer.controller.videotag.prototype = 
{
	init: function()
	{
		$.subscribe('swingingVideoPlayer.playPause', $.proxy(this.onAfterPlayPause, this));
		$.subscribe('swingingVideoPlayer.fullscreen', $.proxy(this.onAfterFullscreen, this));
		
		this.video.bind('canplay', $.proxy(this.canPlayUpdater, this));
		
		if('localStorage' in window)
		{
			this.startVol = localStorage.getItem('swingingVideoPlayer.volume');
		}
		else
		{
			this.startVol = .65;
		}
	},
	
	canPlayUpdater: function() 
	{
		this.seeker  		= $('.video-seeker-bg', this.options.element);
		this.volSeeker  	= $('.volume-bg', this.options.element);
		this.videoTime 		= $('.video-time', this.options.element);
		this.videoTotalTime = $('.video-time-total', this.options.element);
		this.loadedAmount	= $('.movie-loaded-amount', this.options.element);

		this.video.bind('timeupdate', 	$.proxy(this.timeUpdater, this));
		this.video.bind('progress', 	$.proxy(this.progressUpdater, this));
		this.video.bind('volumechange', $.proxy(this.volumeUpdater, this));

		this.assignListenersToVideo();
		this.timeUpdater();
	},
	
	assignListenersToVideo: function()
	{
		var instance = this;

		this.seeker.slider(
		{ 
			range: "min",
			min: 	0, 
			max: 	instance.getDuration(), 
			step: 	.1, 
			slide: 	function(event, ui) 
			{ 
				instance.setCurrentTime(ui.value); 
			} 
		});
	
		this.volSeeker.slider(
		{
			range: "min",
			min: 0,
			max: 1,
			step: .1,
			value: this.startVol,
			slide: function(event, ui) 
			{
				instance.setVolume(ui.value);
			}
		});
	},
	
	timeUpdater: function() 
	{
		this.seeker.slider('option', 'value', this.getCurrentTime());
		this.videoTime.text(this.formatTime(this.getCurrentTime()));
		this.videoTotalTime.text(this.formatTime(this.getDuration()));
	},

	progressUpdater: function(e)
	{
		// webkit
		if(this.video[0].buffered)
		{
			this.loadedAmount.animate({width: (100 * this.video[0].buffered.end() / this.getDuration()) + '%'}, 200);
		}
		// firefox 3.x
		else
		{
			this.loadedAmount.animate({width: ((e.originalEvent.loaded / e.originalEvent.total) * 100) + '%'}, 200);
		}
	},

	volumeUpdater: function(e) 
	{
		this.volSeeker.slider('option', 'value', e.currentTarget.volume);
	},

	onAfterPlayPause: function(obj)
	{
		$('.video-poster, .video-play', this.options.element).remove();
		
		if(this.video[0].paused)
    	{
    		this.video[0].play();
			$(obj).addClass('playing').removeClass('paused');
        }
  		else
		{
			this.video[0].pause();
			$(obj).addClass('paused').removeClass('playing');
		}
	},
	
	onAfterFullscreen: function()
	{
		$('.video-poster, .video-play', this.options.element).remove();

    	if(typeof this.video[0].webkitEnterFullScreen == 'function' && !navigator.userAgent.match("Chrome")) 
    	{
    		this.video[0].webkitEnterFullScreen();
    	}
    	else
    	{
			if(this.inFullWindow)
			{
				this.resizeVideoBackToNormal();
				this.inFullWindow = false;
				$(window).unbind('resize');
			}
			else
			{
				this.fullWindowInstance = new swingingVideoPlayer.controller.fullWindow(this.options.width, this.options.height);
				this.inFullWindow 		= true;

				this.resizeVideoForFullWindow();
				$(window).bind('resize', $.proxy(this.resizeVideoForFullWindow, this));
			}
    	}
  	},
  	
  	resizeVideoForFullWindow: function()
  	{
		this.fullWindowSizes = this.fullWindowInstance.calculateSizes();
		this.positionFullWindowPlayer = this.fullWindowInstance.positionFullWindowPlayer();
		
		$(this.options.element)
			.css({
				width: this.fullWindowSizes[0], 
				height: this.fullWindowSizes[1], 
				left: this.positionFullWindowPlayer[0], 
				top: this.positionFullWindowPlayer[1]}
			)
			.addClass('in-full-window');
		
		this.video
			.css({width: this.fullWindowSizes[0], height: this.fullWindowSizes[1]});
  	},
  	
  	resizeVideoBackToNormal: function()
  	{
		$(this.options.element)
			.css({width: this.options.width, height: this.options.height, left: 0, top: 1})
			.removeClass('in-full-window');

		this.video
			.css({width: this.options.width, height: this.options.height});
  	},
	
	getDuration: 		function() 	   { return this.video[0].duration; },
	getBufferedTime: 	function() 	   { return this.video[0].buffered.end(); },
	getCurrentTime: 	function() 	   { return this.video[0].currentTime; },
	getVolume: 			function() 	   { return thiss.video[0].volume; },
	setCurrentTime: 	function(time) { this.video[0].currentTime = time; },
	
	setVolume: function(volume) 
	{ 
		this.video[0].volume = volume; 
		
		if('localStorage' in window)
		{
			localStorage.setItem('swingingVideoPlayer.volume', volume);
		}
	},
	
	formatTime: function(seconds) 
	{
		var pad = function(s,l) { return( l.substr(0, (l.length-s.length) ) +s ); }
			
		var result 		= "";
		var remaining 	= Math.floor(seconds);

		if (seconds > 3600)
		{
			result 		+= pad((Math.floor(remaining/3600)).toString(),"00")+":";
			remaining 	= remaining % 3600;
		}
		
		result 		+= pad((Math.floor(remaining/60)).toString(),"00")+":";
		remaining 	= remaining % 60;
		result 		+= pad(remaining.toString(),"00")+"";
		
		return result;
	}
};
