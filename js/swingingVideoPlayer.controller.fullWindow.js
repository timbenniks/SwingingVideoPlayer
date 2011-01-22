swingingVideoPlayer.controller.fullWindow = function(origWidth, origHeight)
{
	this.origWidth  = origWidth;
    this.origHeight = origHeight;
    this.newWidth 	= null;
    this.newHeight 	= null;
};

swingingVideoPlayer.controller.fullWindow.prototype = 
{	
	calculateSizes: function()
	{
		this.windowWidth  = $(window).width();
	    this.windowHeight = $(window).height();
        this.proportion   =  this.windowWidth / this.origWidth;
		
		this.newWidth  = this.windowWidth;
		this.newHeight = this.proportion * this.origHeight;
		
		if(this.newHeight > this.windowHeight)
		{
			this.newHeight  = this.windowHeight;
			this.proportion = this.newHeight / this.origHeight;
			this.newWidth 	= this.proportion * this.origWidth;
		}
        
        return [this.newWidth, this.newHeight];
	},
	
	positionFullWindowPlayer: function()
	{
		this.windowWidth  = $(window).width();
	    this.windowHeight = $(window).height();

		var leftPositionCalculation = Math.floor((parseInt(this.windowWidth) / 2) - (parseInt(this.newWidth) / 2));
        var topPositionCalculation  = Math.floor(($(window).scrollTop() + (parseInt(this.windowHeight) - parseInt(this.newHeight)) / 2));

        if(leftPositionCalculation < 0) 
        {
            this.fullWindowLeftPos = 0;
        }
        else 
        {
            this.fullWindowLeftPos = leftPositionCalculation;
        }

        if(topPositionCalculation < 0) 
        {
            this.fullWindowTopPos = $(window).scrollTop();
        }
        else 
        {
            this.fullWindowTopPos = topPositionCalculation;
        }

        return [this.fullWindowLeftPos, this.fullWindowTopPos]
	}
};
