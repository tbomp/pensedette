PD.Transaction = SC.Record.extend({
  amount: SC.Record.attr(Number),
  label: SC.Record.attr(String),
  state: SC.Record.attr(Number, {defaultValue: 0}),
  borrower: null,
  creditor: null,

  amountF: function() {
    return Math.round(this.get('amount') / 100);
  }.property('amount').cacheable()
});

Dette.Transaction.PENDING = 0;
Dette.Transaction.ACCEPTED = 1;
Dette.Transaction.REGECTED = 2;
