//=require ./record

PD.Transaction = PD.Record.extend({
  amount: SC.Record.attr(Number),
  label: SC.Record.attr(String),
  state: SC.Record.attr(Number, {defaultValue: 0}),
  borrower: null,
  creditor: null,

  amountF: function() {
    return Math.round(this.get('amount') / 100);
  }.property('amount').cacheable()
});

PD.Transaction.PENDING = 0;
PD.Transaction.ACCEPTED = 1;
PD.Transaction.REGECTED = 2;
