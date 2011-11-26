PD.RootView = SC.View.extend({
  templateName: 'app/mobile/application'
});

PD.Button = UI.Button.extend({
  classNames: 'pd-button'.w(),
  target: 'PD.applicationViewController',
  localize: true
});

PD.BackButton = UI.Button.extend({
  title: 'back',
  target: 'PD.applicationViewController',
  action: 'showHome',
  isVisibleBinding: SC.Binding.oneWay('targetObject.currentViewId').transform(function(value) {
    return value !== 'pd-home';
  })
});

PD.TextField = UI.TextField.extend({
  classNames: 'pd-text-field'.w(),
  localize: true
});

PD.ListButton = PD.Button.extend({
  tagName: 'li'
});

PD.SwitchButton = SC.Button.extend({
  targetBinding: 'parentView',
  classNames: ['btn'],
  classNameBindings: ['isOff:disabled'],
  tagName: 'button',
  action: 'switchValue',
  isOff: function() {
    return this.getPath('parentView.value') !== this.get('value');
  }.property('parentView.value', 'value').cacheable()
});

PD.Switch = SC.ContainerView.extend({
  tagName: 'li',
  classNames: ['clearfix', 'pd-switch'],
  childViews: ['leftButton', 'rightButton'],
  leftButton: PD.SwitchButton.extend({
    value: 'borrower',
    title: 'Je dois'
  }),
  rightButton: PD.SwitchButton.extend({
    value: 'creditor',
    title: 'Tu me dois'
  }),
  switchValue: function(view) {
    this.set('value', view.get('value'));
  }
});

PD.FriendFinder = SC.View.extend({
  tagName: 'li',
  classNames: 'pd-friend-finder'.w(),
  isActive: false
});

PD.FriendFinderTextField = SC.TextField.extend({
  focusIn: function() {
    var position = this.$().offset();
    //window.scrollTo( 0, position.top );
    this.setPath('parentView.isActive', true);
    PD.Friends.pushObjects([
      {name: 'Paul'},
      {name: 'Pierre'},
      {name: 'Thomas'}
    ]);
  },
  focusOut: function() {
    this.setPath('parentView.isActive', false);
  }
});
