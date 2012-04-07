//= require ../models/transaction
//= require ../models/account

Panda.dataAdapter = DS.RESTAdapter.create({
  bulkCommit: false,

  namespace: 'api/1.0',

  mappings: {
    transactions: Panda.Transaction,
    accounts: Panda.Account
  }
});
