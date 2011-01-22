// set an object with the available mime-types per plugin / player
swingingVideoPlayer.builder.mimes = {
	h264: 	['video/h264', 'video/mp4'],
	theora: ['video/ogg', 'video/webm'],
	flash:	['video/mp4']
}

swingingVideoPlayer.builder.detect = function(options)
{
	this.options 		= options;
	this.videotagMimes  = this.options.videotagMimes;
	this.player			= false;

	this.init();
}

swingingVideoPlayer.builder.detect.prototype =
{
	init: function()
	{
		for(var i = 0; i < this.videotagMimes.length; i++)
		{
			this.determinePlayerKind(this.videotagMimes[i])
		}
	},
	
	// What plugins does you browser have? The higher in this list, the more important it is.
	// So first h264, theora, webM and flash.
	determinePlayerKind: function(mimeToChackAgainst)
	{
		if(this.supportsNativeH264() && this.playableByNativeH264(mimeToChackAgainst)) 
		{
			this.setPlayerKind('videotag');
		}
		if(this.supportsNativeOggTheora() && this.playableByNativeOggTheora(mimeToChackAgainst)) 
		{
			this.setPlayerKind('videotag');
		}
		else if(this.supportsNativeWebM() && this.playableByNativeOggTheora(mimeToChackAgainst)) 
		{
			this.setPlayerKind('videotag');
		}

		// If the playerkind is not set yet try to set it to flash.
		if(this.getPlayerKind() == '' && this.detectFlash() && this.playableByFlash(mimeToChackAgainst))
		{
			this.setPlayerKind('flash');
						
			for(b = 0; b < this.options.sources.length; b++)
			{
				if(this.options.sources[b][0] == mimeToChackAgainst)
				{
					swingingVideoPlayer.builder.flashSourceToUse = this.options.sources[b][1];
				}
			}
		}
		
		// Still no playerkind? (The flash fallback did not work)
		if(this.getPlayerKind() == '')
		{
			this.setPlayerKind('none');
		}
	},

	// Getters and setters
	setPlayerKind: function(kind) { this.player = kind; },
	getPlayerKind: function(kind) { return this.player; },
		
	supportsNativeH264: function()
	{
		return  !!document.createElement('video').canPlayType 
				&& document.createElement("video").canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
	},
		
	supportsNativeOggTheora: function()
	{
		return  !!document.createElement('video').canPlayType 
				&& document.createElement("video").canPlayType('video/ogg; codecs="theora, vorbis"');
	},                           
	
	supportsNativeWebM: function()
	{
		return  !!document.createElement('video').canPlayType 
				&& document.createElement("video").canPlayType('video/webm; codecs="vp8, vorbis');
	},
	
	detectFlash: function() 
	{
		if (window.ActiveXObject) 
		{
			try { control = new ActiveXObject('ShockwaveFlash.ShockwaveFlash'); } catch (e) { return; }

			if (control) 
			{
		        return true;
			}
		} 
		else 
		{
	    	return this.detectPlugin('Flash');
		}
	},
 	
 	// Helper function that loops through a list of plugins. It returns true when it gets a hit.
 	// You can pass multiple plugins to this function because they might have a dependency.
 	// 'Shockwave','Flash' could be the arguments.
 	detectPlugin: function()
	{
	    this.plugins 	 = this.detectPlugin.arguments;
	    this.pluginFound = false;
		
		if(navigator.plugins && navigator.plugins.length > 0) 
	    {
			for(var i=0; i < navigator.plugins.length; i++) 
			{
			    this.numFound = 0;
			    
			    for(var c=0; c < this.plugins.length; c++)
			    {
					if((navigator.plugins[i].name.indexOf(this.plugins[c]) >= 0) 
					|| (navigator.plugins[i].description.indexOf(this.plugins[c]) >= 0)) 
				    {
					    this.numFound++;
					}   
			    }
	
				if(this.numFound == this.plugins.length) 
				{
					this.pluginFound = true;
					break;
			   	}
			}
	    }
	 
	    return this.pluginFound;
	},
	
	playableByNativeH264: function(mime)
	{	
		return this.inArray(swingingVideoPlayer.builder.mimes.h264, mime)
	},
	
	playableByNativeOggTheora: function(mime)
	{
		return this.inArray(swingingVideoPlayer.builder.mimes.theora, mime)
	},
	
	playableByFlash: function(mime)
	{
		return this.inArray(swingingVideoPlayer.builder.mimes.flash, mime)
	},
	
	inArray: function(array, value)
	{
		var i;
		for(i = 0; i < array.length; i++)
 		{
			if(array[i] == value)
			{
				return true;
			}
		}
		
		return false;
	}
};
