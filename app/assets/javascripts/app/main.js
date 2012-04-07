// ==========================================================================
// Project:   Pense-Dette
// Copyright: ©2011 Paul Chavard
// ==========================================================================

Ember.LOG_STATE_TRANSITIONS = true;

I18n.defaultLocale = "fr";
I18n.locale = "fr";

Panda = Em.Application.create({
  store: DS.Store.create({
    adapter: 'Panda.dataAdapter',
    revision: 4
  }),

  ready: function() {
    if (window._DATA) {
      this.loadUser(_DATA);

      Panda.stateManager = Panda.StateManager.create();

      this.appendApplication();

      this.loadTransactions();
    }
  },

  appendApplication: function() {
    Panda.ApplicationView.create().append();
    $('#application').remove();
  },

  loadTransactions: function() {
    Panda.transactionsController = Panda.TransactionsController.create();
    Panda.transactionController = Panda.TransactionController.create();

    Panda.transactionController.reset();
  },

  loadUser: function(data) {
    Panda.store.loadMany(Panda.Account, data.accounts);
    Panda.store.loadMany(Panda.Transaction, data.transactions);
    Panda.store.load(Panda.User, data.user);

    Panda.userController = Panda.UserController.create({
      content: Panda.User.find(data.user.id)
    });

    Panda.friendsController = Panda.FriendsController.create();
  }
});
