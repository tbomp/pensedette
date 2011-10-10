//= require app/controllers/transactions

PD.TransactionsView = SC.CollectionView.extend({
  tagName: 'ul',
  contentBinding: 'PD.Transactions',
  itemViewClass: SC.View.extend({
    templateName: 'app/transaction'
  })
});

