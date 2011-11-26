(function() {
var get = SC.get, set = SC.set, getPath = SC.getPath;

SC.ActionSupport = SC.Mixin.create({
  targetObject: function() {
    var target = get(this, 'target');

    if (SC.typeOf(target) === 'string') {
      return getPath(this, target);
    } else {
      return target;
    }
  }.property('target').cacheable(),

  fireAction: function(action) {
    if (action === undefined) { action = get(this, 'action'); }
    var target = get(this, 'targetObject');

    if (target && action) {
      if (SC.Statechart && SC.typeOf(target.sendAction) === 'function') {
        return target.sendAction(action, this);
      }
      if (SC.typeOf(action) === 'string') {
        action = target[action];
      }
      return action.call(target, this);
    }
    return false;
  }
});

SC.Button.reopen(SC.ActionSupport, {
  label: null,
  defaultTemplate: SC.Handlebars.compile('<label>{{label}}</label>'),
  attributeBindings: ['disabled'],

  propagateEvents: false,  
  disabled: false,

  mouseUp: function(event) {
    if (get(this, 'isActive')) {
      this.fireAction();
      set(this, 'isActive', false);
    }

    this._mouseDown = false;
    this._mouseEntered = false;
    return get(this, 'propagateEvents');
  },

  mouseDown: function() {
    set(this, 'isActive', true);
    this._mouseDown = true;
    this._mouseEntered = true;
    return get(this, 'propagateEvents');
  }
});

SC.TextField.reopen({
  attributeBindings: ['_autocapitalize:autocapitalize', 'pattern', 'disabled'],
  autocapitalize: false,
  _autocapitalize: function() {
    return get(this, 'autocapitalize') ? false : 'off';
  }.property('autocapitalize').cacheable(),
  pattern: null,
  disabled: false
});

SC.Checkbox.reopen({
  attributeBindings: ['disabled'],
  disabled: false
});

SC.BLANK_IMAGE_URL = "data:image/gif;base64,R0lGODlhAQABAJAAAP///wAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==";

SC.IMAGE_STATE_NONE = 'none';
SC.IMAGE_STATE_LOADING = 'loading';
SC.IMAGE_STATE_LOADED = 'loaded';
SC.IMAGE_STATE_FAILED = 'failed';

SC.Image = SC.View.extend({
  classNames: ['sc-image'],
  attributeBindings: ['src'],
  tagName: 'img',
  status: SC.IMAGE_STATE_NONE,
  src: null,

  didInsertElement: function() {
    this.didChangeSrc();
    this.$()
      .load($.proxy(this, 'didLoad'))
      .error($.proxy(this, 'didError'));
  },
  didChangeSrc: function() {
    set(this, 'status', SC.IMAGE_STATE_LOADING);
  }.observes('src'),

  didLoad: function() {
    if (this.$().prop('src') === get(this, 'src')) {
      set(this, 'status', SC.IMAGE_STATE_LOADED);
    }
  },
  didError: function(error) {
    set(this, 'status', SC.IMAGE_STATE_FAILED);
    this.$().prop('src', SC.BLANK_IMAGE_URL);
  }
});

SC.SelectOption = SC.View.extend({
  tagName: 'option',
  classNames: ['sc-select-option'],
  defaultTemplate: SC.Handlebars.compile('{{label}}'),
  attributeBindings: ['value', 'selected'],

  labelBinding: '*content.label',
  valueBinding: '*content.value',
  selectedBinding: '*content.selected'
});

SC.Select = SC.CollectionView.extend({
  tagName: 'select',
  classNames: ['sc-select'],
  attributeBindings: ['multiple', 'disabled'],
  disabled: false,

  itemViewClass: SC.SelectOption,
  _value: null,

  value: function(key, value) {
    if (value !== undefined) {
      set(this, '_value', value);

      get(this, 'childViews').forEach(function(el, idx) {
        var content = get(el, 'content');

        if (content === value) {
          set(content, 'selected', true);
        } else {
          set(content, 'selected', false);
        }
      });
    }

    return get(this, '_value');
  }.property('_value').cacheable(),

  willInsertElement: function() {
    this._elementValueDidChange();
  },

  change: function() {
    this._elementValueDidChange();
  },

  _elementValueDidChange: function() {
    var views = SC.View.views,
        selectedOptions = this.$('option:selected'),
        value;

    if (get(this, 'multiple') && get(this, 'multiple') !== "false") {
      value = selectedOptions.toArray().map(function(el) { return get(views[el.id], 'content'); });
    } else {
      value = get(views[selectedOptions.prop('id')], 'content');
    }

    set(this, 'value', value);
    set(get(this, 'content'), 'selection', value);
  },

  arrayWillChange: function(content, start, removed) {
    var selected, idx, obj;

    if (content && removed) {
      for (idx = start; idx < start+removed; idx++) {
        obj = content.objectAt(idx);

        if (selected = get(content, 'selection')) {
          if (SC.isArray(selected) && selected.contains(obj)) {
            selected.removeObject(obj);
          } else if (selected === obj) {
            set(content, 'selection', null);
          }
        }
      }
    }

    this._super(content, start, removed);
  }
});

})();
