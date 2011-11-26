(function() {
var get = SC.get, set = SC.set, getPath = SC.getPath;

SC.ObjectProxy = SC.Object.extend({
  content: null,
  unknownProperty: function(keyName) {
    this.addProxiedProperty(keyName);
    SC.defineProperty(this, keyName, SC.computed(function() {
      return getPath(this, 'content.' + keyName);
    }).property('content').cacheable());
    return get(this, keyName);
  },
  addProxiedProperty: function(keyName){
    var proxiedProperties = this.proxiedProperties || (this.proxiedProperties = new SC.Set());
    proxiedProperties.add(keyName);
  },
  contentDidChange: function(){
    var proxiedProperties = this.proxiedProperties;
    if (proxiedProperties){
      proxiedProperties.forEach(function(keyName){
        this.notifyPropertyChange(keyName);
      }, this);
    }
  }.observes('content')
});

})();
