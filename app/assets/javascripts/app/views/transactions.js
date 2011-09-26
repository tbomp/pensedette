Dette.TransactionsCollection = SC.CollectionView.create({
  elementId: 'cbList',
  tagName: 'ul',
  contentBinding: 'Dette.TransactionsList',
  itemViewClass: SC.View.extend({
    classNames: ['cbListEntriesPlus'],
    templateName: 'app/transaction',
    didInsertElement: function(){
      console.log('test');
      //amountEU
    }
  })
});

