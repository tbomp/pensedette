PD.transactionController = SC.ObjectProxy.create({

  store: PD.store.chain(),

  init: function() {
    this._super();
    this.reset();
  },

  edit: function(transaction) {
    this.get('store').discardChanges();
    transaction = this.get('store').find(transaction);
    this.set('content', transaction);
  },

  save: function() {
    if (this.get('isRecord')) {
      this.get('store').commitChanges();
      PD.store.commitRecord(this.get('content'));
    }
    this.reset();
  },

  reset: function() {
    var transaction = this.get('store').createRecord(PD.Transaction, {});
    this.set('content', transaction);
  }
});

PD.transactionsController = SC.ArrayProxy.create({
  content: PD.store.find(PD.Transaction)
});
