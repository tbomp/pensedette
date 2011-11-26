(function() {
var get = SC.get, set = SC.set;

SC.View.reopen({
  toggleMethod: 'toggle',

  _isVisibleDidChange: function() {
    var method = this.$()[get(this, 'toggleMethod')];
    if (!method) { method = 'toggle'; }
    method.call(this.$(), get(this, 'isVisible'));
  }.observes('isVisible'),

  show: function() {
    set(this, 'isVisible', true);
  },
  hide: function() {
    set(this, 'isVisible', false);
  },
  toggle: function() {
    this.toggleProperty('isVisible');
  }
});

})();
