(function() {
var get = SC.get, set = SC.set, getPath = SC.getPath, setPath = SC.setPath;

UI.SearchFieldMenuItem = SC.View.extend({
  classNameBindings: ['isSelected'],
  isSelected: function() {
    return getPath(this, 'collectionView.content.selection') === get(this, 'content');
  }.property('collectionView.content.selection', 'content').cacheable(),
  click: function() {
    setPath(this, 'collectionView.content.selection', get(this, 'content'));
  }
});

UI.SearchFieldMenu = SC.CollectionView.extend({
  tagName: 'ul',
  classNames: ['ui-search-field-menu'],
  isVisibleBinding: SC.Binding.from('content.length').bool(),
  itemViewClass: UI.SearchFieldMenuItem
});

UI.SearchField = SC.TextField.extend(SC.ActionSupport, {
  classNames: ['ui-search-field'],
  content: null,
  min: 2,

  search: function() {
    this.fireAction();
  },

  lookup: function(value) {
    get(this, 'content').filterByValue(value);
  },

  select: function(value) {
    set(this, 'value', value);
    this.reset();
  },

  clear: function() {
    set(this, 'value', null);
    this.reset();
  },

  reset: function() {
    //setPath(this, 'content.selection', null);
    //get(this, 'content').resetFilter();
  },

  // Key Events
  insertNewline: function() {
    this.search();
  },
  cancel: function() {
    this.reset();
  },

  // @private
  _valueDidChange: function() {
    var value = get(this, 'value');
    if (value && value.length > get(this, 'min') && !this._noLookup) {
      this.lookup(value);
    }
     this._noLookup = false;
  }.observes('value'),

  _selectionDidChange: function() {
    var value = getPath(this, 'content.selection');
    this._noLookup = true;
    this.select(value);
  }.observes('content.selection')
});

})();
