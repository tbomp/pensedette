Dette.Transaction = SC.Object.extend({
  amountEU: function() {
    return Math.round(this.get('amount') / 100);
  }.property('amount').cacheable()
});

Dette.Transaction.PENDING = 0;
Dette.Transaction.ACCEPTED = 1;
Dette.Transaction.REGECTED = 2;

