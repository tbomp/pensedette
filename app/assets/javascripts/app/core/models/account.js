Panda.Account = DS.Model.extend({
  uid: DS.attr('string'),
  name: DS.attr('string'),
  transactions: DS.hasMany('Panda.Transaction')
});
