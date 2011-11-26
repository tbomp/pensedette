PD.statechart = SC.Statechart.create({
  // Helper methods
  hideOverlays: function() {
    this.sendAction('hide');
    return this;
  },

  togglePage: function(name, flag) {
    console.log(name+'View');
    this.rootView.get(name+'View').toggle(flag);
    return this;
  },

  init: function() {
    this._super();
    SC.$(document).keydown($.proxy(function(evt) {
      this.sendAction('keyDown', evt);
    }, this)).keyup($.proxy(function(evt) {
      this.sendAction('keyUp', evt);
    }, this));
  },

  rootState: SC.State.extend({
    initialSubstate: 'home',

    home: SC.State.extend({
      enterState: function() {
        console.log('home');
        PD.statechart.hideOverlays().togglePage('home', true);
      },
      exitState: function() {
        PD.statechart.togglePage('home', false);
      }
    }),
    newTransaction: SC.State.extend({
      enterState: function() {
        PD.statechart.hideOverlays().togglePage('newTransaction', true);
      },
      exitState: function() {
        PD.statechart.togglePage('newTransaction', false);
      },
      createTransaction: function() {
        console.log('createTransaction');
      }
    }),
    transactions: SC.State.extend({
      enterState: function() {
        PD.statechart.hideOverlays().togglePage('transactions', true);
      },
      exitState: function() {
        PD.statechart.togglePage('transactions', false);
      }
    }),
    pending: SC.State.extend({
      enterState: function() {
        console.log('pending');
        PD.statechart.hideOverlays().togglePage('pending', true);
      },
      exitState: function() {
        PD.statechart.togglePage('pending', false);
      }
    }),

    logout: function() {
      console.log('logout');
    },
    gotoHome: function() {
      this.gotoState('home');
    },
    gotoNewTransaction: function() {
      this.gotoState('newTransaction');
    },
    gotoTransactions: function() {
      this.gotoState('transactions');
    },
    gotoPending: function() {
      this.gotoState('pending');
    }
  })
});
