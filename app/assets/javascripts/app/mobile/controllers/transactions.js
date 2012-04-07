Panda.TransactionController = Ember.Object.extend({

  amountBinding: 'content.amount',
  labelBinding: 'content.label',

  submit: function(evt) {
    evt.preventDefault();

    var content = this.get('content');

    Panda.userController.getPath('account.transactions').pushObject(content);
    content.set('account', Panda.friendsController.get('account'));
    content.get('transaction').commit();

    content.addObserver('isSaving', this, 'didSave');
  },

  didSave: function(content, key, isSaving) {
    if (!isSaving) {
      content.removeObserver('isSaving', this, 'didSave');
      this.reset();
    }
  },

  reset: function() {
    this.set('content', Panda.Transaction.createRecord());
  },

  friendNameBinding: 'Panda.friendsController.name'
});

Panda.TransactionsController = Ember.ArrayProxy.extend({

  contentBinding: 'Panda.userController.account.transactions'

});
