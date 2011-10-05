PD.ScreenView = SC.View.extend(SC.ManagedLayoutSupport, {
  classNames: ['page'],

  applyLayout: function(width) {
    this.$().width(width);
  }
});

PD.HomeScreenView = PD.ScreenView.create({
  elementId: 'accueil',
  templateName: 'app/home'
});

PD.NewTransactionView = PD.ScreenView.create({
  elementId: "new-transaction",
  templateName: "app/new"
});

PD.TransactionsPageView = PD.ScreenView.create({
  elementId: "transactions",
  templateName: "app/transactions"
});
