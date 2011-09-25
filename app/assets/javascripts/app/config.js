$(document).bind("mobileinit", function(){
  console.log('mobileinit');
  $.extend($.mobile , {
    autoInitializePage: true
  });
  //autoInitializePage
  //ajaxEnabled: false,
  //hashListeningEnabled: true
});
