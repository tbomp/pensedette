(function() {
var get = SC.get;

SC.Record.reopen({
  primaryKey: 'id',

  toJSON: function() {
    return get(this, 'store').readDataHash(get(this, 'storeKey'));
  },

  all: function(store, options, remote) {
    var query = SC.Query[remote ? 'remote' : 'local'](this, options);
    return store.find(query);
  }
});

})();
