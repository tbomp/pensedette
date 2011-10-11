//= require sproutcore

(function() {
var get = SC.get, set = SC.set, getPath = SC.getPath, setPath = SC.setPath;

SC.ActionSupport = SC.Mixin.create({

  targetView: function() {
    return this.nearestWithProperty('target');
  }.property().cacheable(),

  _parentViewDidChange: function() {
    this.invokeRecursively(function(view) {
      view.propertyDidChange('collectionView');
      view.propertyDidChange('itemView');
      view.propertyDidChange('contentView');
      view.propertyDidChange('targetView');
    });
  }.observes('parentView'),

  targetObject: function() {
    var target = getPath(this, 'targetView.target');

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
  title: null,
  defaultTemplate: SC.Handlebars.compile('{{title}}'),
  attributeBindings: ['type', 'disabled'],

  propagateEvents: false,  
  disabled: false,

  mouseUp: function(event) {
    console.log('click');
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
  attributeBindings: ['autocapitalize', 'pattern'],
  autocapitalize: 'off',
  pattern: null
});

SC.View.reopen({
  toggleMethod: 'toggle',

  _isVisibleDidChange: function() {
    var method = this.$()[get(this, 'toggleMethod')];
    if (!method) { method = 'toggle'; }
    method.call(this.$(), get(this, 'isVisible'));
  }.observes('isVisible'),

  show: function() {
    set(this, 'isVisible', true);
  },
  hide: function() {
    set(this, 'isVisible', false);
  },
  toggle: function() {
    this.toggleProperty('isVisible');
  }
});

SC.ScrollView = SC.ContainerView.extend({
  hasVerticalScroller: true,
  hasHorizontalScroller: true,

  classNames: 'sc-scroll',

  contentViewTagName: 'div',
  contentView: SC.View.extend({
    tagNameBinding: 'parentView.contentViewTagName',
    templateBinding: 'parentView.template'
  }),
  childViews: ['contentView'],

  didInsertElement: function() {
    this._super();
    this._scroll = new iScroll(this.get('element'), {
      onBeforeScrollStart: null,
      hScroll: false
    });
  }
});

SC.ScrollViewOld = SC.ContainerView.extend({
  hasVerticalScroller: true,
  hasHorizontalScroller: true,

  classNames: 'sc-scroll',

  contentViewTagName: 'div',
  contentView: SC.View.extend({
    classNames: 'sc-scroll-content',
    tagNameBinding: 'parentView.contentViewTagName',
    templateBinding: 'parentView.template',
    panChange: function(rec) {
      var val = rec.get('translation');
      if (getPath(this, 'parentView.hasVerticalScroller')) {
        this.$().css({
          translateY: '%@=%@'.fmt((val.y < 0)? '-' : '+',Math.abs(val.y))
        });
      }
      if (getPath(this, 'parentView.hasHorizontalScroller')) {
        this.$().css({
          translateX: '%@=%@'.fmt((val.x < 0)? '-' : '+',Math.abs(val.x))
        });
      }
    }
  }),

  childViews: ['contentView'],

  init: function() {
    this._super();
    if (!get(this, 'isTouch')) {
      this._didChangeScrollers
        .observes('hasHorizontalScroller', 'hasVerticalScroller');
    }
  },
  didInsertElement: function() {
    this._super();
    this.propertyDidChange('hasHorizontalScroller');
  },

  _didChangeScrollers: function() {
    this.$().css('overflow-x',
      get(this, 'hasHorizontalScroller') ? 'scroll' : 'hidden');
    this.$().css('overflow-y',
      get(this, 'hasVerticalScroller') ? 'scroll' : 'hidden');
  }
});

})();
