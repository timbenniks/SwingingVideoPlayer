// set an object with the available mime-types per plugin / player
swingingVideoPlayer.builder.mimes = {
	h264: 	['video/h264', 'video/mp4', 'video/wmv', 'video/x-ms-wmv'],
	theora: ['video/ogg', 'video/webm'],
	flash:	['video/x-flv', 'video/mp4', 'video/x-youtube', 'video/x-vimeo']
}

swingingVideoPlayer.builder.detect = function(mime)
{
	this.mime 	= mime;
	this.player	= false;
	this.init();
}

swingingVideoPlayer.builder.detect.prototype =
{
	init: function()
	{
		this.detectBrowserPlugins()
	},
	
	// What plugins does you browser have? The higher in this list, the more important it is.
	// So first h264, then theora, then flash.
	detectBrowserPlugins: function()
	{
		if(this.supportsNativeH264() && this.playableByNativeH264(this.mime)) 
		{
			this.setPlayerKind('videotag');
		}
		else if(this.supportsNativeOggTheora() && this.playableByNativeOggTheora(this.mime)) 
		{
			this.setPlayerKind('videotag');
		}
		else if(this.supportsNativeWebM() && this.playableByNativeOggTheora(this.mime)) 
		{
			this.setPlayerKind('videotag');
		}
		else if(this.detectFlash() && this.playableByFlash(this.mime))
		{
			this.setPlayerKind('flash');
		}
		else if(true)
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
		
	supportsNativeOggTheora: function(self)
	{
		return  !!document.createElement('video').canPlayType 
				&& document.createElement("video").canPlayType('video/ogg; codecs="theora, vorbis"');
	},
	
	supportsNativeWebM: function(self)
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
		return this.inArray(swingingVideoPlayer.builder.mimes.h264, this.mime)
	},
	
	playableByNativeOggTheora: function(mime)
	{
		return this.inArray(swingingVideoPlayer.builder.mimes.theora, this.mime)
	},
	
	playableByFlash: function(mime)
	{
		return this.inArray(swingingVideoPlayer.builder.mimes.flash, this.mime)
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
