Dette.Models.Transaction = SC.Record.extend({
  label: SC.Record.attr(String),
  amount: SC.Record.attr(Number),
  borrower_uid: SC.Record.attr(Number),
  creditor_uid: SC.Record.attr(Number),
  state: SC.Record.attr(Number, {defaultValue: 0})
});

Dette.Models.Transaction.PENDING = 0;
Dette.Models.Transaction.ACCEPTED = 1;
Dette.Models.Transaction.REGECTED = 2;

