if (typeof swingingVideoPlayer === "undefined") swingingVideoPlayer = {};
if (typeof swingingVideoPlayer.builder === "undefined") swingingVideoPlayer.builder = {};
if (typeof swingingVideoPlayer.controller === "undefined") swingingVideoPlayer.controller = {};

swingingVideoPlayer.wrapper = function(element, options)
{		
	this.options 			 = $.extend({}, this.defaults, options);
	this.options.element 	 = element;
	this.options.touchDevice = ('ontouchstart' in window);
	
	this.init();
};

swingingVideoPlayer.wrapper.prototype = 
{
	init: function()
	{
		this.buildVideotagMimesArray();
		this.detect();
		this.build();

		if(this.options.touchDevice === false)
		{
			this.fireUpVideoController();
			this.addControllerTemplate();
		}
	},
	
	buildVideotagMimesArray: function()
	{
		this.options.videotagMimes = new Array();
		
		for(i = 0; i < this.options.sources.length; i++)
		{
			this.options.videotagMimes.push(this.options.sources[i][0]);
		}
	},
	
	detect: function()
	{
		this.detector 	  = new swingingVideoPlayer.builder.detect(this.options);
		this.detectedKind = this.detector.getPlayerKind();
	},
	
	build: function()
	{
		new swingingVideoPlayer.builder[this.detectedKind](this.options);
	},
	
	fireUpVideoController: function()
	{
		if(this.detectedKind != 'none')
		{
			new swingingVideoPlayer.controller[this.detectedKind](this.options);
		}
	},
	
	addControllerTemplate: function()
	{
		if(this.detectedKind != 'none')
		{
			new swingingVideoPlayer.controller.attach(this.options);
		}
	},
	
	defaults:
	{
		poster: 	'',
		width: 		854,
		height: 	363,
		type: 		'video',
		autoplay: 	0,
		playerLoc: 	'player.swf'
	}
};

$.fn.swingingVideoPlayer = function(options)
{
    return this.each(function()
    {
        (new swingingVideoPlayer.wrapper(this, options));
    });
};