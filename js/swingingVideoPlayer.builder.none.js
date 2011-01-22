swingingVideoPlayer.builder.none = function(options)
{
	this.options = options;
	this.init();
}

swingingVideoPlayer.builder.none.prototype =
{
	init: function()
	{
		this.preBuildActions();
		this.build();
	},
	
	preBuildActions: function()
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
	},
	
	build: function()
	{
		this.errorDiv.text('The selected video format is not playable...').show();
	}
};
