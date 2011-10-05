SC.layoutManager = SC.Object.create({
  windowWidth: 0,
  windowHeight: 0,

  init: function() {
    this._super();
    this._window.resize(SC.$.proxy(this, '_onResize')).resize();
  },
  registerForLayout: function(view) {
    this._managedViews.pushObject(view);
    this._callApplyLayout(view);
  },

  _managedViews: [],
  _window: SC.$(window),

  _onResize: function() {
    this._windowSize();
    this._managedViews.forEach(this._callApplyLayout, this);
  },
  _windowSize: function() {
    this.set('windowWidth', this._window.width());
    this.set('windowHeight', this._window.height());
  },
  _callApplyLayout: function(view) {
    if (view && view.get('state') === 'inDOM'
      && view.get('hasLayout') === true
      && typeof view.applyLayout === 'function') {
        view.applyLayout(this.windowWidth, this.windowHeight);
    }
  }
});

SC.ManagedLayoutSupport = SC.Mixin.create({
  hasLayout: true,

  didInsertElement: function() {
    this._super();
    SC.layoutManager.registerForLayout(this);
  }
});
