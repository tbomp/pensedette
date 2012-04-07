Panda.Friend = DS.Model.extend({
  name: DS.attr('string'),
  source: DS.attr('string'),

  avatar: function(){
    if (this.get('source') === 'facebook') {
      return "http://graph.facebook.com/%@/picture".fmt(this.get('id'));
    } else {
      return Panda.defaultAvatar;
    }
  }.property('id').cacheable(),

  select: function(evt) {
    evt.preventDefault();
    console.log(this.get('name'));
  }
});

