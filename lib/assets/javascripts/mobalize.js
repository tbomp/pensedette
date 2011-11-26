var Mobalize = {};

/**
 * ScrollFix v0.1
 * http://www.joelambert.co.uk
 *
 * Copyright 2011, Joe Lambert.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

Mobalize.scrollFix = function(elem) {
	// Variables to track inputs
	var startY = startTopScroll = deltaY = undefined,
	
	// Create a lock to prevent multiple interference per interaction
	modifiedY = false,
	
	// Get the first child of the element and treat it as the content	
	content = elem.querySelector('*');
	
	// If there is no content, then do nothing	
	if(!content)
		return;

	// Handle the start of interactions
	elem.addEventListener('touchstart', function(event){
		startY = event.touches[0].pageY;
		startTopScroll = elem.scrollTop;
		
		// Reset the lock
		modifiedY = false;
		
		//console.log('start (top):', startTopScroll);
		//console.log('start (bottom):', startTopScroll + elem.offsetHeight, content.offsetHeight);
		
		if(startTopScroll <= 0)
			elem.scrollTop = 1;

		if(startTopScroll + elem.offsetHeight >= content.offsetHeight)
			elem.scrollTop = content.offsetHeight - elem.offsetHeight - 1;
	}, false);
	
	// Handle movements
	elem.addEventListener('touchmove', function(event){
		deltaY = event.touches[0].pageY - startY;
		
		// Is the content currently at the top?
		if(startTopScroll == 0 && deltaY > 0 && !modifiedY) {
			// Offset the scroll position to prevent Safari scrolling the whole page
			elem.scrollTop = 1;
			modifiedY = true;
			event.stopPropagation();
		}
		
		//console.log(startTopScroll, elem.offsetHeight, content.offsetHeight);
		
		// Is the content currently at the bottom?
		if(startTopScroll + elem.offsetHeight == content.offsetHeight && !modifiedY) {
			// Offset the scroll position to prevent Safari scrolling the whole page
			elem.scrollTop = startTopScroll-1;
			modifiedY = true;
			event.stopPropagation();
		}
	}, false);
};

// Fix for iPhone viewport scale bug 
// http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/

(function() {

var viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');
var ua = navigator.userAgent;

var gestureStart = function () {
  viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
};

window.addEventListener("load", function(){
  if (viewportmeta && /iPhone|iPad/.test(ua) && !/Opera Mini/.test(ua)) {
    viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
    document.addEventListener("gesturestart", gestureStart, false);
  }
}, false);

})();


// Hide URL Bar for iOS and Android by Scott Jehl
// https://gist.github.com/1183357

Mobalize.hideUrlBar = function () {
  var win = window,
    doc = win.document;

  // If there's a hash, or addEventListener is undefined, stop here
  if( !location.hash || !win.addEventListener ){

    //scroll to 1
    window.scrollTo( 0, 1 );
    var scrollTop = 1,

    //reset to 0 on bodyready, if needed
    bodycheck = setInterval(function(){
      if( doc.body ){
        clearInterval( bodycheck );
        scrollTop = "scrollTop" in doc.body ? doc.body.scrollTop : 1;
        win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
      } 
    }, 15 );

    win.addEventListener( "load", function(){
      setTimeout(function(){
        //reset to hide addr bar at onload
        win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
      }, 0);
    }, false );
  }
};
