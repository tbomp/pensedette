(function() {
var get = SC.get, set = SC.set;

SC.ActionSupport = SC.Mixin.create({
  targetBinding: 'content',
  actionContext: null,

  targetObject: function() {
    var target = get(this, 'target');

    if (SC.typeOf(target) === 'string') {
      return SC.getPath(this, target);
    } else {
      return target;
    }
  }.property('target').cacheable(),

  fireAction: function(action) {
    if (action === undefined) { action = this.get('action'); }
    var target = get(this, 'targetObject');

    if (target && action) {
      if (SC.Statechart && SC.typeOf(target.sendAction) === 'function') {
        return target.sendAction(action, this, get(this, 'actionContext'));
      }
      if (SC.typeOf(action) === 'string') {
        action = target[action];
      }
      return action.call(target, this, get(this, 'actionContext'));
    }
    return false;
  }
});

SC.Button.reopen(SC.ActionSupport, {
  title: null,
  defaultTemplate: SC.Handlebars.compile('{{title}}'),
  attributeBindings: ['type', 'disabled'],

  propagateEvents: false,  
  disabled: false,

  mouseUp: function(event) {
    if (get(this, 'isActive')) {
      this.fireAction();
      set(this, 'isActive', false);
    }

    this._mouseDown = false;
    this._mouseEntered = false;
    return this.get('propagateEvents');
  },

  mouseDown: function() {
    set(this, 'isActive', true);
    this._mouseDown = true;
    this._mouseEntered = true;
    return this.get('propagateEvents');
  }
});

})();
