PD.Record = SC.Record.extend({
  
});

PD.Record.reopenClass({
  all: function(options) {
    var query = SC.Query.local(this);
    return PD.store.find(query);
  }
});
