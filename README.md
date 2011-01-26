Swinging Video Player
========================
Swinging Video Player is an HTML5 video player with graceful fallback to Flash and a consistent UI for all devices and browsers.

Yet another player? Why dude...
------------------------
Because I can! Ok, for real. 
I wanted to create a video player that handles web video and not just fancy smancy buzzy HTML5 stuff.
It's all about the user. Everybody has the right to see your video's the way you intended it.
So, no matter what the technology is used, the user should get consistent experience watching your video's on their laptop, tablet or HTC phone.

Swinging Video Player feature detects and does the embedding for you. It favours HTML5, after that it uses flash.
Depending on your browser and the sources you add, the player goes into HTML5 mode or not. 
For Example, if you only add an h264 file, Firefox (and later on Chrome) will get a flash player, but your iPad will use it's native HTML5 player.

Skinning
-------------------------
To optimize for the many devices that are used, the UI is build out of HTML and CSS. This combination is strong and easy to intergrade by any web developer.
You don't need themes or skins, just CSS away. Use images or gradients. Or make it progressively enhance according to the users' browser and device capabilities.

Dependencies
-------------------------
Swinging Video Player uses jQuery for the DOM manipulation and event publishing and a customized (very small) jQuery UI for the sliders and keyboard handlers.
For the flash embed it uses swfObject. The customized jQuery UI and swfObject are delivered within the codebase so you don't have to get those yourself.

Because I was already using jQuery I added a small jQuery function to turn SwingingVideoPlayer into a jQuery Plugin.
You do not have to use the plugin, you can also just instanciate the Swinging Video player prototype.

Implementation
-------------------------



Extending
-------------------------