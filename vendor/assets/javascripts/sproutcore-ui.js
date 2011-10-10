
(function(exports) {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @class 

  Defines the SproutCore UI namespace. All component views, structural views,
  and utilities are namespaced within the UI namespace.
 */
UI = SC.Namespace.create();

})({});

(function(exports) {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



var get = SC.get;
var set = SC.set;

UI.THEMES = {};

UI._Templates = SC.Object.extend({

  themeTemplates: null,

  unknownProperty: function(key) {
    var themeTemplates = get(this,'themeTemplates');
    var templates = themeTemplates? themeTemplates[key] : null;

    return templates || SC.TEMPLATES[key];
  }
});

/** 
  @class
  
  @extends
*/
SC.View.reopen(
/** @scope SC.View.prototype */{
  
  /**
  
    @type String
  */
  themeName: null,

  /**
    Returns a hash to find the templateName in

    First, try to see if the theme overrides the template. If it does, use that
    one. Otherwise, return SC.TEMPLATES
  */
  templates: function(key, value) {
    var theme = get(this, 'themeName');

    return UI._Templates.create({themeTemplates: UI.THEMES[theme]});
  }.property('themeName')
});

})({});


(function(exports) {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


var set = SC.set;
var get = SC.get;

/** 
  @class

  Overview
  ========

  UI.LayoutManager is an internal class used by UI.LayoutSupport to manage and
  update the layout of a view. The main API entry-points are: 
  layoutForManagedView(), and destroy(). The former returns a layout hash of
  properties to set on the view, and the latter cleans up the internal state
  of the layout manager.
  
  @private
  @extends SC.Object
 */
UI.LayoutManager = SC.Object.extend(
/** @scope UI.LayoutManager.prototype */{

  _direction: null,

  _anchors: null,
  _remainingSpace: null,

  _propertyMetadata: {
    remainingSpace: {
      neighbors: ['top','right','bottom','left']
    },
    top: {
      constraint: 'height',
      direction: 'vertical',
      neighbors: ['left','right']
    },
    right: {
      constraint: 'width',
      direction: 'horizontal',
      neighbors: ['top','bottom']
    },
    bottom: {
      constraint: 'height',
      direction: 'vertical',
      neighbors: ['left','right']
    },
    left: {
      constraint: 'width',
      direction: 'horizontal',
      neighbors: ['top','bottom']
    }
  },
  

  init: function() {
    this._anchors = {};
    return this._super();
  },

  layoutForManagedView: function(view, anchor, options) {
    if (anchor === 'remainingSpace') {
      return this._layoutForContentView(view, anchor, options);
    } else if (anchor) {
      return this._layoutForAnchoredView(view, anchor, options);
    }
    return null;
  },

  destroy: function() {
    this._direction = null;
    this._anchors = {};
    this._remainingSpace = null;
  },

  _layoutForAnchoredView: function(view, anchor, options) {
    var direction = this._direction,
        meta = this._propertyMetadata[anchor],
        neighbors = meta.neighbors,
        size = options.size,
        anchors = this._anchors,
        layout = {};

    if (direction !== null && direction !== meta.direction) { throw new SC.Error("You can't setup a horizontal anchor in a vertical view and vice versa."); }
    if (size === undefined || size === null) { throw new SC.Error("Anchors require a size property"); }

    layout[anchor] = 0;
    layout[meta.constraint] = size;

    for (var i=0,l=neighbors.length; i<l; i++) {
      var neighbor = neighbors[i];
      layout[neighbor] = 0;
    }

    this._direction = meta.direction;
    this._anchors[anchor] = {
      view: view,
      constraint: size
    };

    this._reflowContentView();

    return layout;
  },

  _layoutForContentView: function(view, anchor) {
    var direction = this._direction, anchors = this._anchors;
    var beforeAnchorName, afterAnchorName, beforeAnchor, afterAnchor;
    var remainingSpace = {
      view: view,
      before: null,
      after: null
    };

    if (direction === 'horizontal') {
      beforeAnchorName = 'left';
      afterAnchorName = 'right';
    }
    else if (direction === 'vertical') {
      beforeAnchorName = 'top';
      afterAnchorName = 'bottom';
    }

    beforeAnchor = anchors[beforeAnchorName];
    remainingSpace.before = beforeAnchor? beforeAnchor.constraint : 0;

    afterAnchor = anchors[afterAnchorName];
    remainingSpace.after = afterAnchor? afterAnchor.constraint : 0;

    this._remainingSpace = remainingSpace;

    var layout = {};
    var neighbors = this._propertyMetadata[anchor].neighbors;

    for (var i=0,l=neighbors.length; i<l; i++) {
      var neighbor = neighbors[i];
      layout[neighbor] = 0;
    }

    layout[beforeAnchorName] = remainingSpace.before;
    layout[afterAnchorName] = remainingSpace.after;
    return layout;
  },

  _reflowContentView: function() {
    var remainingSpace = this._remainingSpace;

    if (!remainingSpace) { return; }
    else if (!remainingSpace.view) { return; }

    var layout = this._layoutForContentView(remainingSpace ,'remainingSpace');
    var element = get(remainingSpace.view,'element');

    if (element) {
      remainingSpace.view.applyLayout(layout);
    } else {
      SC.run.schedule('render', remainingSpace.view, 'applyLayout', layout);
    }
  }
});

UI.rootLayoutManager = UI.LayoutManager.create({});

})({});


(function(exports) {
// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


var set = SC.set;
var get = SC.get;

/** 
  @class

  Overview
  =======

  UI.LayoutSupport provides anchoring support for the childviews of any 
  SC.View it is mixed to.

  Anchoring allows a view to get anchored to a side of its parent view. It's
  primarily used when building out the structure of an application. An example
  usage is a toolbar across the top of the page, with a sidebar for the 
  content space under it. In this scenario, the toolbar would be anchored to
  the top of the container view, and the sidebar would be anchored to the
  left of the view under it. 

  You will not generally interact with UI.LayoutSupport directly. Rather, 
  you simply specify the anchorTo property, and the size property, and it'll
  take care of the rest.

  Usage
  =======

  A typical usage scenario is for building a top toolbar and a bottom toolbar
  with a third view filling out the remaining space for content. In that case,
  your handlebars template will look like this:

    {{#view MyApp.ContainerView}}
      {{#view MyApp.TopToolbarView anchorTo="top" size="50"}}

      {{/view}}
      {{#view MyApp.ContentAreaView anchorTo="remainingSpace"}}

      {{/view}}
      {{#view MyApp.BottomToolbarView anchorTo="bottom" size="50"}}

      {{/view}}
    {{/view}}

  And your application's javascript file will be look like so: 

    MyApp.ContainerView = SC.View.extend(UI.LayoutSupport,{...});
    MyApp.TopToolbarView = SC.View.extend(UI.LayoutSupport,{...});
    MyApp.ContentAreaView = SC.View.extend(UI.LayoutSupport,{...});
    MyApp.BottomToolbarView = SC.View.extend(UI.LayoutSupport,{...});

  Notes: 
  --------

  - Each view which mixes-in UI.LayoutSupport becomes the layout manager
    for its children. That means, you can create complex layouts by combining
    the view hierarchy with UI.LayoutSupport.

  - Each UI.LayoutSupported-view supports anchors in a single direction (either
    horizontal or vertical). In other words, you can't have one view with both 
    top and left anchors, but you can create a view with top and bottom anchors.
  
  @extends SC.Object
*/
UI.LayoutSupport = SC.Mixin.create(
/** @scope UI.LayoutManager.prototype */{

  hasLayoutSupport: true,

  anchorTo: null,
  size: null,

  _layout: null,

  layoutManager: null,

  init: function() {

    set(this,'layoutManager', UI.LayoutManager.create({}));

    return this._super();
  },

  _getLayoutManager: function() {
    if (this._managerCache) return this._managerCache;
    var manager = null,
        view = get(this, 'parentView');

    while (view) {
      manager = get(view, 'layoutManager');
      if (manager) { break; }

      view = get(view, 'parentView');
    }

    manager = this._managerCache = manager || UI.rootLayoutManager;
    return manager;
  },

  applyLayout: function(layout, buffer) {
    if (buffer) {
      buffer.style('position','absolute');

      for (var prop in layout) {
        buffer.style(prop, layout[prop]); 
      }
    } else {
      this.$().css(layout);
    }
  },

  render: function(buffer) {
    var layoutManager = this._getLayoutManager();

    var layout = this._layout = layoutManager.layoutForManagedView(this, get(this,'anchorTo'), {
      size: get(this,'size')
    });

    if (layout) {
      this.applyLayout(layout, buffer);
    }

    return this._super(buffer);
  },

  destroy: function() {

    var manager = this._getLayoutManager();
    manager.destroy();

    this._managerCache = undefined;

    return this._super();
  }

});

})({});
