PD.Friend = PD.Record.extend({
  //uid: 
  name: SC.Record.attr(String),
  source: SC.Record.attr(String),
  //cercles:

  avatar: function(){
    if (this.get('source') === 'facebook') {
      return "http://graph.facebook.com/%@/picture".fmt(this.get('uid'));
    } else {
      return PD.defaultAvatar;
    }
  }.property('uid').cacheable()
});

