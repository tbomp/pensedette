PD.statechart = SC.Statechart.create({
  rootState: SC.State.extend({
    initialSubstate: 'homeScreen',

    homeScreen: SC.State.extend({
      enterState: function() {
        console.log('homeScreen');
        PD.rootView.homeScreen.set('isVisible', true);
      },
      exitState: function() {
        PD.rootView.homeScreen.set('isVisible', false);
      }
    }),
    newTransactionScreen: SC.State.extend({
      enterState: function() {
        PD.rootView.newTransactionScreen.set('isVisible', true);
      },
      exitState: function() {
        PD.rootView.newTransactionScreen.set('isVisible', false);
      },
      createTransaction: function() {
        console.log('createTransaction');
      }
    }),
    transactionsScreen: SC.State.extend({
      enterState: function() {
        PD.rootView.transactionsScreen.set('isVisible', true);
      },
      exitState: function() {
        PD.rootView.transactionsScreen.set('isVisible', false);
      }
    }),
    pendingScreen: SC.State.extend({
      enterState: function() {
        console.log('pendingScreen');
        PD.rootView.pendingScreen.set('isVisible', true);
      },
      exitState: function() {
        PD.rootView.pendingScreen.set('isVisible', false);
      }
    }),

    logout: function() {
      console.log('logout');
    },
    showHomeScreen: function() {
      this.gotoState('homeScreen');
    },
    showNewTransactionScreen: function() {
      this.gotoState('newTransactionScreen');
    },
    showTransactionsScreen: function() {
      this.gotoState('transactionsScreen');
    },
    showPendingScreen: function() {
      this.gotoState('pendingScreen');
    }
  })
});
