(function() {
var get = SC.get;

SC.Record.reopen({
  primaryKey: 'id',

  toJSON: function() {
    return get(this, 'store').readDataHash(get(this, 'storeKey'));
  },

  statusText: function() {
    var status = get(this, 'status');
    for (key in SC.Record) {
      if (status === SC.Record[key]) {
        return key;
      }
    }
  }.property('status').cacheable(),

  all: function(store, options, remote) {
    var query = SC.Query[remote ? 'remote' : 'local'](this, options);
    return store.find(query);
  }
});

})();
