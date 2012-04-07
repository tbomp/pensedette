DS.Model.reopen({
  namingConvention: {
    keyToJSONKey: function(key) {
      return Ember.String.decamelize(key);
    },

    foreignKey: function(key) {
      return Ember.String.decamelize(key);
    }
  }
});
