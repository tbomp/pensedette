
Dette = SC.Application.create({
  store: SC.Store.create().from('AR.DataSource'),
  Models: {},
  Views: {},
  Controllers: {}
});

Dette.listFriends = function(callback) {
  $.getJSON('/api/1.0/friends', callback);
}

Dette.createTransaction = function(uid, amount, borrow, callback) {
  var data = {amount: amount};
  if (borrow) {
    data.creditor_uid = uid;
  } else {
    data.borrower_uid = uid;
  }
  $.ajax('/api/1.0/transactions', {
    data: JSON.stringify(data),
    type: 'POST',
    success: callback,
    contentType: 'application/json',
    dataType: 'json'
  });
};

Dette.test = function() {
  Dette.createTransaction(100001497762726, 400, true, function(data) {
    console.log(data);
  });
  Dette.createTransaction(100001497762726, 300, false, function(data) {
    console.log(data);
  });
};

SC.$(function(){
  Dette.listFriends(function(data){
    Dette.FriendsList.set('content', []);
    data.forEach(function(user) {
      Dette.FriendsList.pushObject(Dette.User.create(user));
    });
  })
});

