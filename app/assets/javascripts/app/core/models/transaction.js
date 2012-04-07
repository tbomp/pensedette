Panda.Transaction = DS.Model.extend({
  amount: DS.attr('number'),
  label: DS.attr('string'),
  state: DS.attr('number', {defaultValue: 0}),
  account: DS.belongsTo('Panda.Account'),

  formattedAmount: function() {
    return Math.round(this.get('amount') / 100);
  }.property('amount').cacheable()
});

Panda.Transaction.PENDING = 0;
Panda.Transaction.ACCEPTED = 1;
Panda.Transaction.REGECTED = 2;
