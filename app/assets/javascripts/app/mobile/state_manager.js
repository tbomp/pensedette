
Panda.StateManager = Em.StateManager.extend({

  initialState: 'pending',

  pending: Em.State.create({
    enter: function() {
    }
  }),

  'new': Em.State.create({
    enter: function() {
      Panda.transactionController.reset();
    }
  }),

  transactions: Em.State.create({
    enter: Em.K
  })
});
