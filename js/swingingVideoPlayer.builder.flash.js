swingingVideoPlayer.builder.flash = function(options)
{
	this.options = options;
	this.init();
}

swingingVideoPlayer.builder.flash.prototype =
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
			.append(this.playBtn);

	},
	
	build: function()
	{
		this.flashvars = 
		{ 
			file: 			this.options.source, 
			image: 			this.options.poster, 
			controlbar: 	'none', 
			icons: 			false, 
			displayclick: 	'none', 
			type: 			this.options.type, 
			autostart: 		this.options.autoplay 
		};
		
		this.randID      = Math.random().toString().replace('.', '');
		this.flashPlayer = new SWFObject(this.options.playerLoc, 'flashPlayer'+this.randID, this.options.width, this.options.height, '9');
		
		this.flashPlayer.addParam('allowscriptaccess','always');
		this.flashPlayer.addParam('wmode','transparent');
		this.flashPlayer.addParam('allowfullscreen','true');
		this.flashPlayer.addParam('flashvars', $.param(this.flashvars));
		
		this.options.element.innerHTML += this.flashPlayer.getSWFHTML();
	}
};

