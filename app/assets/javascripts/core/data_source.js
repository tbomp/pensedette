PD.DataSource = SC.DataSource.extend({
  fetch: function(store, query) {
    var recordType = query.get('recordType');
    switch (recordType) {
    case PD.Friend:
      return this.fetchFriends(store, query);
    case PD.Transaction:
      return this.fetchTransactions(store, query);
    }
    return false;
  },

  createRecord: function(store) {
    return true;
  },

  updateRecord: function (store) {
    return true;
  },

  fetchFriends: function(store, query) {
    $.ajax('/api/1.0/friends', {
      dataType: 'json',
      success: function(data) {
        console.log(data);
      },
      error: function() {
        
      }
    });
    return true;
  },

  fetchTransactions: function(store, query) {
    $.ajax('/api/1.0/transactions', {
      dataType: 'json',
      success: function(data) {
        console.log(data);
      },
      error: function() {
        
      }
    });
    return true;
  },

  createTransaction: function(store, storeKey) {
    var data = {amount: amount};
    if (borrow) {
      data.creditor = uid;
    } else {
      data.borrower = uid;
    }
    $.ajax('/api/1.0/transactions', {
      type: 'POST',
      dataType: 'json',
      data: data,
      //contentType: 'application/json',
      //data: JSON.stringify(data),
      success: function(data) {

      },
      error: function() {
        
      }
    });
  },

  updateTransaction: function() {
    $.ajax('/api/1.0/transactions/%@'.fmt(id), {
      type: 'PUT',
      dataType: 'json',
      data: {
        state: data.state,
        label: data.label
      },
      success: function(data) {
        console.log(data);
      },
      error: function() {
        
      }
    });
  }
});
