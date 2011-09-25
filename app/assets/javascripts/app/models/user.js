Dette.User = SC.Object.extend({
  avatar: function(){
    return "http://graph.facebook.com/%@/picture".fmt(this.get('id'));
  }.property('id').cacheable()
});

