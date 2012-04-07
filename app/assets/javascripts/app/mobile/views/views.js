Panda.Button = Ember.Button.extend({
  classNames: 'panda-button'.w()
});

Panda.ListButton = Panda.Button.extend({
  tagName: 'li'
});

Panda.SwitchButton = Em.Button.extend({
  targetBinding: 'parentView',
  classNameBindings: ['isOff:disabled'],
  tagName: 'button',
  action: 'switchValue',
  isOff: function() {
    return this.getPath('parentView.value') !== this.get('value');
  }.property('parentView.value', 'value').cacheable()
});

Panda.Switch = Em.ContainerView.extend({
  tagName: 'li',
  classNames: ['clearfix', 'pd-switch'],
  childViews: ['leftButton', 'rightButton'],
  leftButton: Panda.SwitchButton.extend({
    value: 'borrower',
    title: 'Je dois'
  }),
  rightButton: Panda.SwitchButton.extend({
    value: 'creditor',
    title: 'Tu me dois'
  }),
  switchValue: function(view) {
    this.set('value', view.get('value'));
  }
});

Panda.FriendFinder = Em.View.extend({
  tagName: 'li',
  classNames: 'panda-friend-finder'.w(),
  isActive: false
});

Panda.FriendFinderTextField = Em.TextField.extend({
  focusIn: function() {
    var position = this.$().offset();
    //window.scrollTo( 0, position.top );
    this.setPath('parentView.isActive', true);
    Panda.friendsController.pushObjects([
      {name: 'Paul'},
      {name: 'Pierre'},
      {name: 'Thomas'}
    ]);
  },
  focusOut: function() {
    this.setPath('parentView.isActive', false);
  }
});
