swingingVideoPlayer.controller.attach = function(options)
{
	this.options 	 = $.extend({}, this.defaults, options);
	this.controllBar = swingingVideoPlayer.controller.template;
	this.playBtn 	 = $('<div></div>')
							.addClass('video-play')
							.css({width: this.options.width, height: this.options.height, position: 'absolute', top: 0, left: 0, zIndex: 800})
	this.init();
};

// functions
swingingVideoPlayer.controller.attach.prototype =
{
	init: function()
	{
		this.addControls();
		this.assignListeners();
	},
	
	addControls: function()
	{
		$(this.options.element)
			.append(this.playBtn)
			.append(this.controllBar);
	},
	
	assignListeners: function()
	{
		var controls = $('.video-controls', this.options.element);
		
		$(this.options.element).hover(function()
		{
			var self = $(this);

			if(self.data('animating')) return;
			
			self.data('animating', true);

			controls.fadeIn(250, function() 
			{
				self.data('animating', false);
			});
		},
		function()
		{
			 controls.fadeOut(250);
		});
		
		$('.video-play-pause', controls).bind('click', 		 function() { $.publish('swingingVideoPlayer.playPause', [this]); });
		$('.video-play', this.options.element).bind('click', function() { $.publish('swingingVideoPlayer.playPause', [$('.video-play-pause', controls)]); });
		
		$('.fullscreen', controls).bind('click', function() 
		{ 
			$.publish('swingingVideoPlayer.fullscreen'); 
		});
		
		$(document).keyup(function(e)
		{
			if(e.keyCode == $.ui.keyCode.SPACE)
			{
				$.publish('swingingVideoPlayer.playPause', [$('.video-play-pause', controls)]);
			}

			return false;
		});

		
		if(this.options.autoplay)
		{
			$.publish('swingingVideoPlayer.playPause', [$('.video-play-pause', controls)]);
		}
	}
};
