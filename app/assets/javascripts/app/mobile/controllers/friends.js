Panda.FriendsController = Em.ArrayProxy.extend({
  init: function() {
    this.set('content', Panda.store.findAll(Panda.Friend));
  },

  didFindFriend: function(friends, key, name) {
    if (typeof name === 'string' && name.length > 1) {
      this.set('results', Panda.store.filter(Panda.Friend, function(data) {
        return data.get('name').toLowerCase().match(name.toLowerCase());
      }));
    } else {
      this.set('results', null);
    }
  }.observes('name'),

  name: null,
  results: null,
  selectedAccount: null,

  select: function(evt) {
    evt.preventDefault();
    var friend = evt.view.get('content');

    var account = Panda.Account.find({uid: friend.get('id'), name: friend.get('name')});
    this.set('loadingAccounts', account);
    this.set('name', friend.get('name'));
  },

  account: function() {
    return this.getPath('loadingAccounts.firstObject');
  }.property('loadingAccounts.isLoaded')
});
