Dette.Models.User = SC.Record.extend({
  name: SC.Record.attr(String),
  avatar: function(){
    return "http://graph.facebook.com/%@/picture".fmt(this.get('id'));
  }
});

