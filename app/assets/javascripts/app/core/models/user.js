Panda.User = DS.Model.extend({
  uid: DS.attr('string'),

  account: DS.belongsTo('Panda.Account')
});
