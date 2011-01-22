swingingVideoPlayer.controller.flash = function(options)
{		
	$.subscribe('swingingVideoPlayer.playPause', function(){ return });
	$.subscribe('swingingVideoPlayer.fullscreen', function(){ return });

	new $.flashPlayerManager(options.element, options);
};

(function($)
{
    $.flashPlayerManager = function(el, options)
    {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery version of element
        // base.element[0] is the JavaScript object.
        base.element = $(el);
		
		// Also set the element when it is needed outside of the scope of base.
        $.flashPlayerManager.base = base;
        
        // Add a reverse reference to the DOM object
        base.element.data("flashPlayerManager", base);
        
        // Init function for this class. It checks out the players ready state.
        base.init = function()
        {
            base.options = $.extend({}, $.flashPlayerManager.defaultOptions, options);
            base.catchPlayerReady();
        };
        
        // JWplayer demands that this is used to determine if the player is ready.
		base.catchPlayerReady = function()
        {
			playerReady = function(obj)
			{
				try 
				{
					base.player   = $("#"+obj['id'], base.element);

					base.player.each(function()
					{
						this.addModelListener("TIME", 		"$.flashPlayerManager.timeTracker");
						this.addModelListener("STATE", 		"$.flashPlayerManager.playTracker");
						this.addModelListener("LOADED", 	"$.flashPlayerManager.loaded");
						this.addModelListener("ERROR", 		"$.flashPlayerManager.error");
						this.addControllerListener("VOLUME","$.flashPlayerManager.volumeTracker");
					});

					base.bindControls();
				}
				catch(err)
				{
					throw(err);
				}
			}
        };
        
        // Bind the playes controls.
        // The spacebar, play buttons and seekers.
		base.bindControls = function()
        {    		
    		if(base.options.autoplay) 
			{
				$('.video-play-pause', base.element).removeClass('paused').addClass('playing');
				if($('.video-play', base.element).length)
				{
					$('.video-play', base.element).fadeOut(150, function()
					{
						$('.video-poster', base.element).fadeOut(150)
					});
				}
			}
			
			// bind the spacebar to teh play event.
			$(document).keyup(function(e)
			{
				if(e.keyCode == $.ui.keyCode.SPACE)
				{
					base.player[0].sendEvent("PLAY");
					
					if($('.video-play', base.element).length)
					{
						$('.video-play', base.element).fadeOut(150, function()
						{
							$('.video-poster', base.element).fadeOut(150)
						});
					}
				}
	
				return false;
			});
	
			$('.video-play-pause', base.element).live('click', function() 
			{
				base.player[0].sendEvent("PLAY");
				
				if($('.video-play', base.element).length)
				{
					$('.video-play', base.element).fadeOut(150, function()
					{
						$('.video-poster', base.element).fadeOut(150)
					});
				}
			});
			
			$('.video-play', base.element).live('click', function(){ $('.video-play-pause', base.element).click(); });
			
			$('.video-seeker-bg', base.element).slider(
			{
				range: "min",
				min: 0,
				max: 100000,
				slide: function(event, ui) 
				{
					base.player[0].sendEvent("SEEK", Math.round(base.player[0].getPlaylist()[0].duration * ui.value / 100000));
				}
			});
			
			$('.volume-bg', base.element).slider(
			{
				range: "min",
				min: 0,
				max: 100,
				value: base.player[0].getConfig()['volume'],
				slide: function(event, ui) 
				{
					base.player[0].sendEvent("VOLUME", ui.value);
				}
			}); 
			
			$('.fullscreen', base.element).hide();
        };
      	
      	// A time formatting helper function.
      	// Does all sorts of magic.
		base.formatTime = function(seconds)
		{
			var pad = function(s,l) { return( l.substr(0, (l.length-s.length) )+s ); }
			
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
		};
		
        // Run initializer
        base.init();
    };
    
    // defaults...
    $.flashPlayerManager.defaultOptions = 
    {
        autoplay: 0
    };
    
    // This function is outside of the 'base' scope because 
    // it is called by a global event listener in JWplayer.
    // It slides the seeker to where the movie is at the moment.
	$.flashPlayerManager.timeTracker = function(obj) 	
    {
		var base 			= $.flashPlayerManager.base;
    	var percentComplete = Math.round(100000 * obj.position / obj.duration);
		var player 			= $("#"+obj['id']);
		
		$('.video-seeker-bg', base.element).slider('option', 'value', percentComplete);
		$('.video-time', base.element).text(base.formatTime(obj.position));
		$('.video-time-total', base.element).text(base.formatTime(obj.duration));
    }

    // This function is outside of the 'base' scope because 
    // it is called by a global event listener in JWplayer.
    // It handles teh play / pauze event from JWplayer.
    $.flashPlayerManager.playTracker = function(obj)
    {
		var base = $.flashPlayerManager.base;

    	if(obj.newstate == "PLAYING")
		{
			$('.video-play-pause', base.element).removeClass('paused').addClass('playing');
		} 
		else 
		{
			$('.video-play-pause', base.element).addClass('paused').removeClass('playing');
		}	
    }

    // This funciton is outside of the 'base' scope because 
    // it is called by a global event listener in JWplayer.
    // It shows how far the movie has been loaded.
    $.flashPlayerManager.loaded = function(obj) 
    {
		var base 		= $.flashPlayerManager.base;
    	var totalLoaded = Math.floor((obj.loaded / obj.total) * 100);

		$('.movie-loaded-amount', base.element).animate({width: totalLoaded+'%'}, 200);
    }
    
    // This funciton is outside of the 'base' scope because 
    // it is called by a global event listener in JWplayer.
    // It shows the error it gets from JWplayer.
    $.flashPlayerManager.error = function(obj)
    {
    	var base = $.flashPlayerManager.base;

		$('.video-error', base.element).text(obj.message).fadeIn(250);
		$('.video-controls', base.element).remove();
		$('.video-play', base.element).remove();
    };
    
	// This funciton is outside of the 'base' scope because 
    // it is called by a global event listener in JWplayer.
    // It shows the volume amount from JWplayer.
	$.flashPlayerManager.volumeTracker = function(obj)
	{
    	var base = $.flashPlayerManager.base;

		$('.volume-bg', base.element).slider('option', 'value', obj.percentage);
  	}
      
	// The jQuery plugin.
	$.fn.flashPlayerManager = function(options)
    {
        return this.each(function()
        {
            (new $.flashPlayerManager(this, options));
        });
    };

})(jQuery);