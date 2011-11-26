PD.Friend = SC.Record.extend({
  //uid: 
  name: SC.Record.attr(String),
  source: SC.Record.attr(String),

  avatar: function(){
    if (this.get('source') === 'facebook') {
      return "http://graph.facebook.com/%@/picture".fmt(this.get('uid'));
    } else {
      return PD.defaultAvatar;
    }
  }.property('uid').cacheable()
});

