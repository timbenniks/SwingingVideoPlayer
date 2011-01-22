swingingVideoPlayer.builder.videotag = function(options)
{
	this.options = options;
	this.init();
};

swingingVideoPlayer.builder.videotag.prototype =
{
	init: function()
	{
		this.preBuildActions();
		this.build();
	},
	
	preBuildActions: function()
	{
		if(this.options.touchDevice)
		{
			$(this.options.element).css({ width: this.options.width, height: this.options.height, position: 'relative' })
		}
		else
		{
			this.errorDiv = $('<div></div>')
								.addClass('video-error');

			this.poster   = $('<img />')
								.addClass('video-poster')
								.attr('src', this.options.poster)
								.attr('width', this.options.width)
								.attr('height', this.options.height)
								.css({position: 'absolute', top: 0, left: 0, zIndex: 600});
						
			$(this.options.element)
				.css({ width: this.options.width, height: this.options.height, position: 'relative' })
				.append(this.errorDiv)
				.append(this.poster)
				.append(this.playBtn);
		}
	},
	
	build: function()
	{
		this.videoTag = $('<video></video>')
							.attr({ width: this.options.width, height: this.options.height, poster: this.options.poster, autoplay: this.options.autoplay })
							.appendTo(this.options.element);

		if(this.options.touchDevice)
		{
			this.videoTag.attr({ controls: 'controls' })
		}
		
		$('<source />')
			.attr({ src: this.options.source, type: this.options.mime })
			.prependTo(this.videoTag);
	}
};