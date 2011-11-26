PD.applicationViewController = UI.TabViewController.create({

  showHome: function() {
    this.selectView('pd-home');
  },

  showNew: function() {
    this.selectView('pd-new');
  },

  showPending: function() {
    this.selectView('pd-pending');
  },

  showTransactions: function() {
    this.selectView('pd-transactions');
  },

  titleBinding: SC.Binding.oneWay('view.currentView.elementId').transform(function(value) {
    return 'pd.nav.%@'.fmt((value || '').replace(/^pd-/, '')).toLowerCase();
  })
});
