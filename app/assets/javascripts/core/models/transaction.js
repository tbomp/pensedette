PD.Transaction = SC.Record.extend({
  amount: SC.Record.attr(Number),
  label: SC.Record.attr(String),
  state: SC.Record.attr(Number, {defaultValue: 0}),
  borrower: null,
  creditor: null,

  amountFormated: function() {
    return Math.round(this.get('amount') / 100);
  }.property('amount').cacheable()
});

PD.Transaction.PENDING = 0;
PD.Transaction.ACCEPTED = 1;
PD.Transaction.REGECTED = 2;
