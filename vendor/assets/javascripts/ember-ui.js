
(function(exports) {
// Vector and Matrix mathematics modules for JavaScript
// Copyright (c) 2007 James Coglan
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var Sylvester = {
  version: '0.1.3',
  precision: 1e-6
};

function Matrix() {}
Matrix.prototype = {

  // Returns element (i,j) of the matrix
  e: function(i,j) {
    if (i < 1 || i > this.elements.length || j < 1 || j > this.elements[0].length) { return null; }
    return this.elements[i-1][j-1];
  },

  // Maps the matrix to another matrix (of the same dimensions) according to the given function
  map: function(fn) {
    var els = [], ni = this.elements.length, ki = ni, i, nj, kj = this.elements[0].length, j;
    do { i = ki - ni;
      nj = kj;
      els[i] = [];
      do { j = kj - nj;
        els[i][j] = fn(this.elements[i][j], i + 1, j + 1);
      } while (--nj);
    } while (--ni);
    return Matrix.create(els);
  },

  // Returns the result of multiplying the matrix from the right by the argument.
  // If the argument is a scalar then just multiply all the elements. If the argument is
  // a vector, a vector is returned, which saves you having to remember calling
  // col(1) on the result.
  multiply: function(matrix) {
    if (!matrix.elements) {
      return this.map(function(x) { return x * matrix; });
    }
    var returnVector = matrix.modulus ? true : false;
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    if (!this.canMultiplyFromLeft(M)) { return null; }
    var ni = this.elements.length, ki = ni, i, nj, kj = M[0].length, j;
    var cols = this.elements[0].length, elements = [], sum, nc, c;
    do { i = ki - ni;
      elements[i] = [];
      nj = kj;
      do { j = kj - nj;
        sum = 0;
        nc = cols;
        do { c = cols - nc;
          sum += this.elements[i][c] * M[c][j];
        } while (--nc);
        elements[i][j] = sum;
      } while (--nj);
    } while (--ni);
    var M = Matrix.create(elements);
    return returnVector ? M.col(1) : M;
  },

  x: function(matrix) { return this.multiply(matrix); },
  
  // Returns true iff the matrix can multiply the argument from the left
  canMultiplyFromLeft: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    // this.columns should equal matrix.rows
    return (this.elements[0].length == M.length);
  },

  // Set the matrix's elements from an array. If the argument passed
  // is a vector, the resulting matrix will be a single column.
  setElements: function(els) {
    var i, elements = els.elements || els;
    if (typeof(elements[0][0]) != 'undefined') {
      var ni = elements.length, ki = ni, nj, kj, j;
      this.elements = [];
      do { i = ki - ni;
        nj = elements[i].length; kj = nj;
        this.elements[i] = [];
        do { j = kj - nj;
          this.elements[i][j] = elements[i][j];
        } while (--nj);
      } while(--ni);
      return this;
    }
    var n = elements.length, k = n;
    this.elements = [];
    do { i = k - n;
      this.elements.push([elements[i]]);
    } while (--n);
    return this;
  }
};

// Constructor function
Matrix.create = function(elements) {
  var M = new Matrix();
  return M.setElements(elements);
};

// Utility functions
$M = Matrix.create;

})({});


(function(exports) {
// ==========================================================================
// Project:  TransformJS        
// Copyright: ©2011 Strobe Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
(function($) {

  if ( !$.cssHooks ) {
    throw("jQuery 1.4.3+ is needed for this plugin to work");
    return;
  }
  
  var translationUnit = ''
  
  var prop = "transform",
      vendorProp, supportedProp, supports3d, supports2d, supportsFilter,
      
      // capitalize first character of the prop to test vendor prefix
      capProp = prop.charAt(0).toUpperCase() + prop.slice(1),
      prefixes = [ "Moz", "Webkit", "O", "ms" ],
      div = document.createElement( "div" );

  if ( prop in div.style ) {

    // browser supports standard CSS property name
    supportedProp = prop;
    supports3d = div.style.perspective !== undefined;
  } 
  else {

    // otherwise test support for vendor-prefixed property names
    for ( var i = 0; i < prefixes.length; i++ ) {
      vendorProp = prefixes[i] + capProp;

      if ( vendorProp in div.style ) {
        supportedProp = vendorProp;
        if (prefixes[i] === 'Moz') {
            translationUnit = 'px'
        }
        if((prefixes[i] + 'Perspective') in div.style) {
          supports3d = true;
        }
        else {
          supports2d = true;
        }
        break;
      }
    }
  }
  
  if (!supportedProp) {
    supportsFilter = ('filter' in div.style);
    supportedProp = 'filter';
  }

  // console.log('supportedProp: '+supportedProp+', 2d: '+supports2d+', 3d: '+supports3d+', filter: '+supportsFilter);

  // avoid memory leak in IE
  div = null;
  
  // add property to $.support so it can be accessed elsewhere
  $.support[ prop ] = supportedProp;
  
  var transformProperty = supportedProp;

  var properties = {
    rotateX: {
      defaultValue: 0,
      matrix: function(a) {
        if (supports3d) {
          return $M([
            [1,0,0,0],
            [0,Math.cos(a), Math.sin(-a), 0],
            [0,Math.sin(a), Math.cos( a), 0],
            [0,0,0,1]
          ]);          
        }
        else {
          return $M([
            [1, 0,0],
            [0, 1,0],
            [0,0,1]
          ]);               
        }
      }
    },
    rotateY: {
      defaultValue: 0,
      matrix: function(b) {
        if (supports3d) {
          return $M([
            [Math.cos( b), 0, Math.sin(b),0],
            [0,1,0,0],
            [Math.sin(-b), 0, Math.cos(b), 0],
            [0,0,0,1]
          ]);
        }
        else {
          return $M([
            [1, 0,0],
            [0, 1,0],
            [0,0,1]
          ]);               
        }
      }
    },
    rotateZ: {
      defaultValue: 0,
      matrix: function(c) {
        if (supports3d) {
          return $M([
            [Math.cos(c), Math.sin(-c), 0, 0],
            [Math.sin(c), Math.cos( c), 0, 0],
            [0,0,1,0],
            [0,0,0,1]
          ]);
        }
        else {
          return $M([
            [Math.cos(c), Math.sin(-c),0],
            [Math.sin(c), Math.cos( c),0],
            [0,0,1]
          ]);          
        }
      }
    },
    scale: {
      defaultValue: 1,
      matrix: function(s) {
        if (supports3d) {
          return $M([
            [s,0,0,0],
            [0,s,0,0],
            [0,0,s,0],
            [0,0,0,1]
          ]);
        }
        else {
          return $M([
            [s, 0,0],
            [0, s,0],
            [0,0,1]
          ]);               
        }
      }
    },
    translateX: {
      defaultValue: 0,
      matrix: function(tx) {
        if (supports3d) {
          return $M([
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [tx,0,0,1]
          ]);
        }
        else {
          return $M([
            [1, 0,0],
            [0, 1,0],
            [tx,0,1]
          ]);               
        }
      }
    },
    translateY: {
      defaultValue: 0,
      matrix: function(ty) {
        if (supports3d) {
          return $M([
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,ty,0,1]
          ]);
        }
        else {
          return $M([
            [1, 0,0],
            [0, 1,0],
            [0,ty,1]
          ]);               
        }
      }
    },
    translateZ: {
      defaultValue: 0,
      matrix: function(tz) {
        if (supports3d) {
          return $M([
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,tz,1]
          ]);
        }
        else {
          return $M([
            [1, 0,0],
            [0, 1,0],
            [0,0,1]
          ]);               
        }
      }
    }
  };
  
  var applyMatrix = function(elem) {
      var transforms = $(elem).data('transforms');
      var tM;
      
      if (supports3d) {
        tM = $M([
          [1,0,0,0],
          [0,1,0,0],
          [0,0,1,0],
          [0,0,0,1]
        ]);
      }
      else {
        tM = $M([
          [1,0,0],
          [0,1,0],
          [0,0,1]
        ]);
      }

      for (var name in properties) {
        tM = tM.x(properties[name].matrix(transforms[name] || properties[name].defaultValue))
      }
      
      if (supports3d) {
        s  = "matrix3d(";
          s += tM.e(1,1).toFixed(10) + "," + tM.e(1,2).toFixed(10) + "," + tM.e(1,3).toFixed(10) + "," + tM.e(1,4).toFixed(10) + ",";
          s += tM.e(2,1).toFixed(10) + "," + tM.e(2,2).toFixed(10) + "," + tM.e(2,3).toFixed(10) + "," + tM.e(2,4).toFixed(10) + ",";
          s += tM.e(3,1).toFixed(10) + "," + tM.e(3,2).toFixed(10) + "," + tM.e(3,3).toFixed(10) + "," + tM.e(3,4).toFixed(10) + ",";
          s += tM.e(4,1).toFixed(10) + "," + tM.e(4,2).toFixed(10) + "," + tM.e(4,3).toFixed(10) + "," + tM.e(4,4).toFixed(10);
        s += ")";        
      }
      else if (supports2d) {
        s  = "matrix(";
          s += tM.e(1,1).toFixed(10) + "," + tM.e(1,2).toFixed(10) + ",";
          s += tM.e(2,1).toFixed(10) + "," + tM.e(2,2).toFixed(10) + ",";
          s += tM.e(3,1).toFixed(10) + translationUnit + "," + tM.e(3,2).toFixed(10) + translationUnit;
        s += ")";        
      }
      else if (supportsFilter) {
        s = "progid:DXImageTransform.Microsoft.";
			 	  s += "Matrix(";
            s += "M11="+tM.e(1,1).toFixed(10) + ",";
            s += "M12="+tM.e(1,2).toFixed(10) + ",";
            s += "M21="+tM.e(2,1).toFixed(10) + ",";
            s += "M22="+tM.e(2,2).toFixed(10) + ",";
            s += "SizingMethod='auto expand'";
          s += ")";
          
        elem.style.top = tM.e(3,1);
        elem.style.left = tM.e(3,2);
      }

      elem.style[transformProperty] = s;
  }
  
  var hookFor = function(name) {
    
    $.fx.step[name] = function(fx){
      $.cssHooks[name].set( fx.elem, fx.now + fx.unit );
    };
    
    return {
      get: function( elem, computed, extra ) {
        var transforms = $(elem).data('transforms');
        if (transforms === undefined) {
          transforms = {};
          $(elem).data('transforms',transforms);
        }
        
        return transforms[name] || properties[name].defaultValue;
      },
      set: function( elem, value) {
        var transforms = $(elem).data('transforms');
        if (transforms === undefined) transforms = {};
        var propInfo = properties[name];

        if (typeof propInfo.apply === 'function') {
          transforms[name] = propInfo.apply(transforms[name] || propInfo.defaultValue, value);
        } else {
          transforms[name] = value
        }
        
        $(elem).data('transforms',transforms);
        
        applyMatrix(elem);
      }
    }
  }

  if (transformProperty) {
    for (var name in properties) {
      $.cssHooks[name] = hookFor(name);
      $.cssNumber[name] = true;
    } 
  }

})(jQuery);

})({});


(function(exports) {
// ==========================================================================
// Project:   TransformJS
// Copyright: ©2011 Majd Taby
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
})({});

(function(exports) {
UI = Ember.Namespace.create();

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

UI.Animatable = Ember.Mixin.create({

  /**
    Walk like a duck.

    @property {Boolean}
  */
  isAnimatable: true,

  /**
    @method willAnimateView
   */

  /**
    @method didAnimateView
   */

  /**
    @param {UI.Animation}
    @param {Ember.Mixin}
    @return {Ember.View}
   */
  animate: function(animationClass, animation) {
    animation = UI.Animation.createAnimation(animationClass, {
      target: this
    }, animation);
    set(this, 'animation', animation);
    // Ember.addObserver(animation, 'isRunning', this, function isRunningObserver() {
    //   if (!get(animation, 'isRunning')) {
    //     //Ember.removeObserver(animation, 'isRunning', isRunningObserver);
    //     set(this, 'animation', null);
    //   }
    // });
    animation.run();
    return this;
  },

  /**
    @return {Ember.View}
  */
  resetAnimation: function() {
    var animation = get(this, 'animation');
    if (animation && get(animation, 'isRunning')) {
      animation.stop();
    }
    return this;
  }

  /**
   *
   */
  // animationTimeline: function(key, value) {
  //   if (value !== undefined) {
  //     this.resetAnimation();
  //     if (value === null) {
  //       return null;
  //     }
  //     var currentState = {}, step, _key,
  //       w = this.$().width(), h = this.$().height();
      
  //     this._animation = {};
  //     this._animation.timeline = Ember.keys(value).filter(function(key) {
  //       return key.match(/[0-9]?[0-9]%$/);
  //     }).sort().map(function(key) {
  //       step = value[key];
  //       if (typeof step === 'function') {
  //         step = step(w, h);
  //       }
  //       for (_key in step) {
  //         if (step.hasOwnProperty(_key) && !currentState[_key]) {
  //           currentState[_key] = this.$().css(_key);
  //         }
  //       }
  //       return step;
  //     }, this);
  //     this._animation.currentState = currentState;
  //     return this;
  //   }
  //   return (this._animation || {}).timeline;
  // }.property().cacheable(),

  // animate__: function(target, action) {
  //   var timeline = get(this, 'animationTimeline'),
  //       duration = get(this, 'animationDuration'),
  //       easing = get(this, 'animationEasing');
  //   if (timeline && duration) {
  //     if (target && typeof action === 'string') {
  //       action = target[action];
  //     }
  //     timeline = Ember.copy(timeline);
  //     this.$().css(timeline.shift());
  //     var step = timeline.shift();
  //     while (step) {
  //       var options = {
  //         duration: duration,
  //         easing: easing,
  //         queue: true
  //       };
  //       if (timeline.length === 0 && target && action) {
  //         options.complete = Ember.$.proxy(function() {
  //           action.call(target, this);
  //         }, this);
  //       }
  //       this.$().animate(step, options);
  //       step = timeline.shift();
  //     }
  //   }
  // },

});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
UI.Draggable = Ember.Mixin.create({

  /**
    Walk like a duck.

    @property {Boolean}
  */
  isDraggable: true
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
UI.Droppable = Ember.Mixin.create({

  /**
    Walk like a duck.

    @property {Boolean}
  */
  isDroppable: true
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get;

UI.Scrollable = Ember.Mixin.create({

  /**
    Walk like a duck.

    @property {Boolean}
  */
  isScrollable: true,

  hasHorizontalScroller: false,
  hasVerticalScroller: true,

  didInsertElement: function() {
    this._super();
    this.propertyDidChange('hasVerticalScroller');
    this.fixiOSScroll();
  },

  scrollersDidChange: Ember.observer(function() {
    this.$().css({
      'overflow-x': get(this, 'hasHorizontalScroller') ? 'scroll' : 'hidden',
      'overflow-y': get(this, 'hasVerticalScroller') ? 'scroll' : 'hidden'
    });
  }, 'hasHorizontalScroller', 'hasVerticalScroller'),

  /**
   * ScrollFix v0.1
   * http://www.joelambert.co.uk
   *
   * Copyright 2011, Joe Lambert.
   * Free to use under the MIT license.
   * http://www.opensource.org/licenses/mit-license.php
   */
  fixiOSScroll: function() {
    // Variables to track inputs
    var startY, startTopScroll, deltaY,
        elem = this.$().css('-webkit-overflow-scrolling', 'touch')[0];

    // Handle the start of interactions
    elem.addEventListener('touchstart', function(event) {
      startY = event.touches[0].pageY;
      startTopScroll = elem.scrollTop;

      if (startTopScroll <= 0) {
        elem.scrollTop = 1;
      }

      if (startTopScroll + elem.offsetHeight >= elem.scrollHeight) {
        elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
      }
    }, false);
  }
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get;

/**
  @extends Ember.Mixin
 */
UI.Searchable = Ember.Mixin.create({

  /**
    Walk like a duck.

    @property {Boolean}
  */
  isSearchable: true,

  /**
    @property {String}
  */
  searchText: null,

  /**
    @property {Number}
  */
  searchPause: 100,

  /**
    @property {Number}
  */
  minSearchLen: 1,

  init: function() {
    this._super();
    this._runSearch();
  },

  _searchDidChange: Ember.observer(function() {
    var searchPause = get(this, 'searchPause'),
        searchText = get(this, 'searchText') || "",
        minSearchLen = get(this, 'minSearchLen');

    // Check for min length
    if (searchText.length < minSearchLen) {
      this.reset();
      return;
    }

    if (searchPause > 0) {
      this._setSearchInterval(searchPause);
    } else {
      this._runSearch();
    }
  }, 'searchText'),

  _setSearchInterval: function(searchPause) {
    Ember.run.cancel(this._searchTimer);
    this._searchTimer = Ember.run.later(this, '_runSearch', searchPause);
  },

  _sanitizeSearchString: function(str) {
    var specials = [
        '/', '.', '*', '+', '?', '|',
        '(', ')', '[', ']', '{', '}', '\\'
    ];
    this._cachedRegex = this._cachedRegex || new RegExp('(\\' + specials.join('|\\') + ')', 'g');
    return str.replace(this._cachedRegex, '\\$1');
  },

  _runSearch: function() {
    var searchText = get(this, 'searchText');
    if (!Ember.empty(searchText)) {
      searchText = this._sanitizeSearchString(searchText).toLowerCase();
      this.runSearch(searchText);
    } else {
      this.reset();
    }
  },

  /**
    Override to implement searching functionality

    @param {String} searchText a text to search for
  */
  runSearch: Ember.K,

  /**
    Override to implement reset functionality
  */
  reset: Ember.K
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
UI.Sortable = Ember.Mixin.create({

  /**
    Walk like a duck.

    @property {Boolean}
  */
  isSortable: true
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, escapeHTML = Ember.Handlebars.Utils.escapeExpression;

/**
  @extends Ember.Mixin
*/
UI.TitleSupport = Ember.Mixin.create({

  /**
    Walk like a duck.

    @property {Boolean}
  */
  hasTitleSupport: true,

  /**
    @property {String}
    @default null
  */
  title: null,

  /**
    @property {String}
    @default false
  */
  localize: false,

  /**
    @property {String}
    @default true
  */
  escapeHTML: true,

  /** @private */
  formattedTitle: Ember.computed(function() {
    var title = get(this, 'title');
    if (!Ember.empty(title)) {
      if (get(this, 'localize')) {
        title = Ember.String.loc(title);
      }
      if (get(this, 'escapeHTML')) {
        title = escapeHTML(title);
      }
    }
    return title;
  }).property('title', 'escapeHTML', 'localize').cacheable()

});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

/**
  @static
  @constant
  @type String
*/
UI.TOGGLE_BEHAVIOR = 'toggle';

/**
  @static
  @constant {String}
*/
UI.PUSH_BEHAVIOR =   'push';

/**
  @static
  @constant
  @type String
*/
UI.TOGGLE_ON_BEHAVIOR = 'on';

/**
  @static
  @constant {String}
*/
UI.TOGGLE_OFF_BEHAVIOR = 'off';

/**
  @static
  @constant {String}
*/
UI.HOLD_BEHAVIOR = 'hold';

/**
  @extends Ember.Button
  @mixins UI.ButtonSupport
 */
UI.Button = Ember.Button.extend(UI.TitleSupport, {
  classNames: ['ui-button'],
  classNameBindings: ['isDefault:default', 'isCancel:cancel', 'value:active'],

  /**
    The WAI-ARIA role of the button.

    @type String
    @default 'button'
    @readOnly
  */
  ariaRole: 'button',

  /**
    If true, then this button will be triggered when you hit return.

    This will also apply the "default" classname to the button.

    @property {Boolean}
    @default false
  */
  isDefault: false,

  /**
    If true, then this button will be triggered when you hit escape.

    This will also apply the "cancel" classname to the button.

    @property {Boolean}
    @default false
  */
  isCancel: false,

  /**
   * [willSubmit description]
   *
   * @type {Boolean}
   * @default false
   */
  isSubmit: false,

  /**
    The behavioral mode of this button.

    Possible values are:

     - `UI.PUSH_BEHAVIOR` -- Pressing the button will trigger an action tied to the
       button. Does not change the value of the button.
     - `UI.TOGGLE_BEHAVIOR` -- Pressing the button will invert the current value of
       the button. If the button has a mixed value, it will be set to true.
     - `UI.TOGGLE_ON_BEHAVIOR` -- Pressing the button will set the current state to
       true no matter the previous value.
     - `UI.TOGGLE_OFF_BEHAVIOR` -- Pressing the button will set the current state to
       false no matter the previous value.
     - `UI.HOLD_BEHAVIOR` -- Pressing the button will cause the action to repeat at a
       regular interval specifed by 'holdInterval'

    @property {String}
    @default Ember.PUSH_BEHAVIOR
  */
  buttonBehavior: UI.PUSH_BEHAVIOR,

  /*
    If buttonBehavior is `UI.HOLD_BEHAVIOR`, this specifies, in milliseconds,
    how often to trigger the action. Ignored for other behaviors.

    @property {Number}
    @default 100
  */
  holdInterval: 100,

  mouseDown: function() {
    if (!get(this, 'disabled')) {
      if (get(this, 'buttonBehavior') === UI.HOLD_BEHAVIOR) {
        this._holdTimer = Ember.run.later(this, 'triggerAction', get(this, 'holdInterval'));
      }
    }
    return this._super();
  },

  triggerAction: function() {
    switch (get(this, 'buttonBehavior')) {
    case UI.TOGGLE_BEHAVIOR:
      this.toggleProperty('value');
      break;
    case UI.TOGGLE_ON_BEHAVIOR:
      set(this, 'value', true);
      break;
    case UI.TOGGLE_OFF_BEHAVIOR:
      set(this, 'value', false);
      break;
    case UI.HOLD_BEHAVIOR:
      Ember.run.cancel(this._holdTimer);
      break;
    }
    if (get(this, 'isSubmit')) {
      this.$().closest('form.ember-form').submit();
    }
    this._super();
  },

  tapEnd: function() {
    if (get(this, 'buttonBehavior') === UI.PUSH_BEHAVIOR) {
      this.triggerAction();
    }
  },

  keyUp: function(event) {
    this.interpretKeyEvents(event);
    return false;
  },

  insertNewline: function() {
    if (get(this, 'isDefault')) {
      this.triggerAction();
    }
  },

  cancel: function() {
    if (get(this, 'isCancel')) {
      this.triggerAction();
    }
  },

  /** @private */
  interpretKeyEvents: function(event) {
    var map = UI.Button.KEY_EVENTS;
    var method = map[event.keyCode];

    if (method) { return this[method](event); }
  },

  /** @private */
  defaultTemplate: Ember.Handlebars.compile('{{{formattedTitle}}}')
});

UI.Button.KEY_EVENTS = {
  13: 'insertNewline',
  27: 'cancel'
};

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/**
  @extends Ember.Checkbox
  @mixins UI.TitleSupport
 */
UI.Checkbox = Ember.Checkbox.extend(UI.TitleSupport, {
  tagName: 'label',
  classNames: ['ui-checkbox'],
  defaultTemplate: Ember.Handlebars.compile('<input type="checkbox" {{bindAttr checked="value" disabled="disabled"}}/>{{{formattedTitle}}}')
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, getPath = Ember.getPath;

UI.FilePicker = UI.Button.extend({
  tagName: 'span',
  classNames: ['ui-filepicker'],
  classNameBindings: ['disabled'],

  /**
   * [hasSelection description]
   * @type {Boolean}
   */
  hasSelection: false,

  /**
   * [multiple description]
   * @type {Boolean}
   */
  multiple: true,

  /**
   * [disabled description]
   * @type {Boolean}
   */
  disabled: false,

  /**
   * [files description]
   * @type {Array}
   */
  files: Ember.A(),

  /**
   * [selectionSize description]
   * @type {Number}
   */
  selectionSize: 0,

  didInsertElement: function() {
    this._super();
    this.$().css({position: 'relative'}).append('<input type="file"/>').find('input:file').css({
      position: 'absolute', cursor: 'pointer', opacity: 0,
      top: 0, bottom: 0, left: 0, right: 0, width: '100%', height: '100%'
    })
      .attr('multiple', get(this, 'multiple'))
      .attr('disabled', get(this, 'disabled'))
      .on('change', $.proxy(this, 'didChangeFiles'));
  },
  didChangeFiles: function(evt) {
    var files = Ember.A(evt.currentTarget.files);
    set(this, 'selectionSize', 0);
    files.forEach(function(file) { this.incrementProperty('selectionSize', file.size); }, this);
    get(this, 'files').replace(0, getPath(this, 'files.length'), files);

    Ember.run.schedule('sync', this, function() {
      if (get(this, 'hasSelection')) {
        this.change();
      }
    });
  },
  change: Ember.K,
  mouseUp: Ember.K,
  didChangeSelection: Ember.observer(function() {
    set(this, 'hasSelection', !!getPath(this, 'files.length'));
  }, 'files.length'),
  didChangeMultiple: Ember.observer(function() {
    this.$('input:file').attr('multiple', get(this, 'multiple'));
  }, 'multiple'),
  didChangeDisabled: Ember.observer(function() {
    this.$('input:file').attr('disabled', get(this, 'disabled'));
  }, 'disabled'),

  /** @private */
  defaultTemplate: Ember.Handlebars.compile('{{{formattedTitle}}}')
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get;

/**
  @extends Ember.View
  @mixins Ember.TargetActionSupport
*/
Ember.Form = Ember.View.extend(Ember.TargetActionSupport, {
  tagName: 'form',
  classNames: ['ember-form'],

  submit: function(evt) {
    evt.preventDefault();
    console.log('submit', this.get('isValid'))
    if (this.get('isValid')) {
      this.triggerAction();
    }
  },

  isValid: function() {
    return this.$()[0].checkValidity();
  }.property(),

  fields: Ember.computed(function() {
    var views = Ember.View.views;
    return Ember.A(this.$('input, textarea, select').toArray()).map(function(el) {
      return views[el.id];
    }).filterProperty('isView');
  }).property()
});

/**
 * @extends Ember.Form
 */
UI.Form = Ember.Form.extend({
  classNames: ['ui-form']
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

/**
  @extends Ember.TextField
 */
UI.TextField = Ember.TextField.extend(UI.TitleSupport, Ember.TargetActionSupport, {
  classNames: ['ui-text-field'],

  /**
    @property {String}
  */
  autocomplete: 'on',

  /**
    @property {String}
  */
  autocapitalize: 'off',

  /**
    @property {Boolean}
  */
  clearOnEsc: false,

  /**
    @property {Boolean}
  */
  blurOnEnter: false,

  /**
    @property {Boolean}
  */
  isDefault: false,

  isValid: function() {
    return this.$()[0].checkValidity();
  }.property(),

  insertNewline: function() {
    if (!get(this, 'isValid')) { return; }
    if (get(this, 'isDefault')) {
      this.triggerAction();
    }
    if (get(this, 'blurOnEnter')) {
      this.blur();
    }
  },

  cancel: function() {
    if (get(this, 'clearOnEsc')) {
      this.clear();
    }
  },

  /**
    Clear the value and gain focus
  */
  clear: function() {
    set(this, 'value', '');
    this.focus();
  },

  /** @private */
  attributeBindings: ['autocomplete', 'autocapitalize'],

  /** @private */
  placeholderBinding: 'formattedTitle'
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/**
  @extends UI.TextField
 */
UI.NumericField = UI.TextField.extend({
  classNames: ['ui-numeric-field'],
  type: 'number',

  /**
   @property {String}
  */
  autocomplete: 'off',

  /**
   @property {String}
  */
  pattern: '[0-9]*',

  /**
   @property {Number}
  */
  min: null,

  /**
   @property {Number}
  */
  max: null,

  /** @private */
  attributeBindings: ['pattern', 'min', 'max']
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

var valueProperty = Ember.computed(function(key, value) {
  if (value !== undefined) {
    // normalize invalid value
    if (typeof value !== 'number') {
      value = 0;
    }
    this._value = value;
  }
  return Math.min(get(this, 'max'), Math.max(get(this, 'min'), this._value));
}).property('max', 'min').cacheable();

/**
  @extends Ember.View
*/
UI.ProgressIndicator = Ember.View.extend({
  classNames: ['ui-progress-indicator'],

  /**
    @property {Number}
  */
  value: 0,

  /**
    @property {Number}
  */
  min: 0,

  /**
    @property {Number}
  */
  max: 100,

  /**
    @property {Number}
  */
  percentage: 0,

  /**
    @property {Number}
  */
  isComplete: false,

  didInsertElement: function() {
    this.propertyDidChange('value');
  },

  /** @private */
  defaultTemplate: Ember.Handlebars.compile('<div></div>'),

  init: function() {
    this._super();
    this._value = get(this, 'value');
    Ember.defineProperty(this, 'value', valueProperty);
  },

  willChangeValue: Ember.observer(function() {
    var value = get(this, 'value'),
        max = get(this, 'max'),
        percentage = 100 * value / max;
    set(this, 'isComplete', value === max);
    set(this, 'percentage', percentage);

    this.$('> div:first-child')
      .toggle(value > get(this, 'min'))
      .width(percentage.toFixed(0) + "%");

    this.didChangeValue.call(this, value);
  }, 'value'),

  didChangeValue: Ember.K
});


})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/**
  @extends UI.TextField
 */
UI.SearchField = UI.TextField.extend({
  classNames: ['ui-search-field'],
  autocomplete: 'off',
  type: 'search',
  clearOnEsc: true,
  blurOnEnter: true
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, getPath = Ember.getPath, setPath = Ember.setPath;

/**
  @extends Ember.View
  @mixins UI.TitleSupport
*/
UI.SelectOption = Ember.View.extend(UI.TitleSupport, {
  tagName: 'option',
  classNames: ['ember-select-option', 'ui-select-option'],
  attributeBindings: ['value', 'disabled'],

  disabled: false,
  localizeBinding: Ember.Binding.oneWay('collectionView.localize'),

  title: Ember.computed(function() {
    var content = get(this, 'content');
        titleKey = getPath(this, 'collectionView.itemTitleKey');
    return titleKey ? get(content, titleKey) : content.toString();
  }).property('content', 'collectionView.itemTitleKey').cacheable(),

  value: Ember.computed(function() {
    var content = get(this, 'content');
        valueKey = getPath(this, 'collectionView.itemValueKey');
    return valueKey ? get(content, valueKey) : content.toString();
  }).property('content', 'collectionView.itemValueKey').cacheable(),

  selected: Ember.computed(function() {
    var selection = getPath(this, 'collectionView.content.selection');
    return selection && selection.contains(get(this, 'content'));
  }).property('collectionView.content.selection.@each').cacheable(),

  selectedDidChange: Ember.observer(function() {
    Ember.run.schedule('render', this, function() {
      this.$().prop('selected', get(this, 'selected'));
    });
  }, 'selected'),

  defaultTemplate: Ember.Handlebars.compile('{{{formattedTitle}}}')
});

/**
  @extends Ember.CollectionView
*/
UI.Select = Ember.CollectionView.extend({
  tagName: 'select',
  classNames: ['ember-select', 'ui-select'],
  attributeBindings: ['multiple', 'disabled'],

  /**
   * [localize description]
   * @type {Boolean}
   */
  localize: false,

  /**
   * [disabled description]
   * @type {Boolean}
   */
  disabled: false,

  /**
   * [multiple description]
   * @type {Boolean}
   */
  multiple: false,

  /**
    If you set this to a non-null value, then the name shown for each
    menu item will be pulled from the object using the named property.
    if this is null, the collection items themselves will be used.

    @type {String}
    @default null
  */
  itemTitleKey: 'title',

  /**
     Set this to a non-null value to use a key from the passed set of items
     as the value for the options popup.  If you don't set this, then the
     items themselves will be used as the value.

     @type {String}
     @default null
  */
  itemValueKey: 'value',

  /** @private */
  itemViewClass: UI.SelectOption,

  /** @private */
  didInsertElement: function() {
    this._updateElementValue();
  },

  /** @private */
  change: function() {
    Ember.run.once(this, this._updateElementValue);
  },

  /** @private */
  _updateElementValue: function() {
    var views = Ember.View.views,
      selectedOptions = this.$('option:selected').toArray(),
      selectedObjects = Ember.A(selectedOptions).map(function(el) {
        return get(views[el.id], 'content');
      });
    setPath(this, 'content.selection', selectedObjects);
  }
});

})({});


(function(exports) {
})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Strobe Inc. and contributors. ©2011 Paul Chavard
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get;

/**
  @extends Ember.Mixin

  Support methods for the Delegate design pattern.

  The Delegate design pattern makes it easy to delegate a portion of your
  application logic to another object.  This is most often used in views to
  delegate various application-logic decisions to controllers in order to
  avoid having to bake application-logic directly into the view itself.

  The methods provided by this mixin make it easier to implement this pattern
  but they are not required to support delegates.

  ## The Pattern

  The delegate design pattern typically means that you provide a property,
  usually ending in "delegate", that can be set to another object in the
  system.

  When events occur or logic decisions need to be made that you would prefer
  to delegate, you can call methods on the delegate if it is set.  If the
  delegate is not set, you should provide some default functionality instead.
 */
UI.DelegateSupport = Ember.Mixin.create({

  /**
    Walk like a duck.

    @property {Boolean}
  */
  hasDelegateSupport: true,

  /**
    Selects the delegate that implements the specified method name.  Pass one
    or more delegates.  The receiver is automatically included as a default.

    This can be more efficient than using invokeDelegateMethod() which has
    to marshall arguments into a delegate call.

    @param {String} methodName
    @param {Object...} delegate one or more delegate arguments
    @returns {Object} delegate or null
   */
  delegateFor: function(methodName) {
    var idx = 1,
        len = arguments.length,
        ret;

    while(idx<len) {
      ret = arguments[idx];
      if (ret && typeof ret[methodName] === 'function') return ret;
      idx++;
    }

    return (typeof this[methodName] !== 'function') ? this : null;
  },

  /**
    Invokes the named method on the delegate that you pass.  If no delegate
    is defined or if the delegate does not implement the method, then a
    method of the same name on the receiver will be called instead.

    You can pass any arguments you want to pass onto the delegate after the
    delegate and methodName.

    @param {Object} delegate a delegate object.  May be null.
    @param {String} methodName a method name
    @param {Object...} args (OPTIONAL) any additional arguments

    @returns {Object} value returned by delegate
   */
  invokeDelegateMethod: function(delegate, methodName, args) {
    args = Ember.A(arguments);
    args = args.slice(2, args.length);
    if (!delegate || !delegate[methodName]) {
      delegate = this;
    }

    var method = delegate[methodName];
    return method ? method.apply(delegate, args) : null;
  },

  /**
    Search the named delegates for the passed property.  If one is found,
    gets the property value and returns it.  If none of the passed delegates
    implement the property, search the receiver for the property as well.

    @param {String} key the property to get.
    @param {Object} delegate one or more delegate
    @returns {Object} property value or undefined
   */
  getDelegateProperty: function(key, delegate) {
    var idx = 1,
        len = arguments.length,
        ret;

    while(idx<len) {
      ret = arguments[idx++];
      if (ret && get(ret, key) !== undefined) {
        return get(ret, key);
      }
    }

    return get(this, key);
  }
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

UI.AnimationSupport = Ember.Mixin.create(UI.DelegateSupport, {

  /**
    Walk like a duck.

    @property {Boolean}
  */
  hasAnimationSupport: true,

  /**
    @property {String|UI.Animation}
   */
  animation: 'Fade',

  /**
    @property {Boolean}
  */
  removeHiddenView: true,

  /**
    Invoked when entering state. Will append or show view depending on view state.
    If `animation` property is set, will animate in view.
  */
  show: function(animation) {
    var view = this.isView ? this : get(this, 'view');
    if (!view) { return false; }
    animation = animation || get(this, 'animation');
    if (animation && view.isAnimatable) {
      Ember.run.schedule('render', function() {
        view.resetAnimation().animate(animation, {
          out: false,
          delegate: (get(this, 'delegate') || this)
        });
      });
    } else {
      this.invokeDelegateMethod(get(this, 'delegate'), 'willAnimateView', view);
    }
  },

  /**
    Invoked when exiting state. Will remove or hide view depending on `recycleView` property.
    If `animation` property is set, will animate out view.
  */
  hide: function(animation) {
    var view = this.isView ? this : get(this, 'view');
    if (!view) { return false; }
    animation = animation || get(this, 'animation');
    if (animation && view.isAnimatable) {
      view.resetAnimation().animate(animation, {
        out: true,
        delegate: (get(this, 'delegate') || this)
      });
    } else {
      this.invokeDelegateMethod(get(this, 'delegate'), 'didAnimateView', view, {out: true});
    }
  },

  willAnimateView: function(view) {
    console.log(get(this, 'rootElement'));
    if (get(view, 'state') !== 'inDOM') {
      view.appendTo(get(this, 'rootElement'));
    }
    set(view, 'isVisible', true);
  },

  didAnimateView: function(view, animation) {
    if (!get(animation, 'out')) { return; }
    if (get(this, 'removeHiddenView')) {
      view.remove();
    } else {
      set(view, 'isVisible', false);
    }
  }

});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Strobe Inc. and contributors. ©2011 Paul Chavard
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

/**
  @class

  Overview
  =======

  UI.LayoutSupport provides anchoring support for the childviews of any
  Ember.View it is mixed to.

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

    MyApp.ContainerView = Ember.View.extend(UI.LayoutSupport,{...});
    MyApp.TopToolbarView = Ember.View.extend(UI.LayoutSupport,{...});
    MyApp.ContentAreaView = Ember.View.extend(UI.LayoutSupport,{...});
    MyApp.BottomToolbarView = Ember.View.extend(UI.LayoutSupport,{...});

  Notes:
  --------

  - Each view which mixes-in UI.LayoutSupport becomes the layout manager
    for its children. That means, you can create complex layouts by combining
    the view hierarchy with UI.LayoutSupport.

  - Each UI.LayoutSupported-view supports anchors in a single direction (either
    horizontal or vertical). In other words, you can't have one view with both
    top and left anchors, but you can create a view with top and bottom anchors.

  @extends Ember.Mixin
*/
UI.LayoutSupport = Ember.Mixin.create({

  /**
    Walk like a duck.

    @property {Boolean}
  */
  hasLayoutSupport: true,

  anchorTo: 'remainingSpace',
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

  renderWithLayout: function(buffer) {
    var layoutManager = this._getLayoutManager();

    var layout = this._layout = layoutManager.layoutForManagedView(this, get(this,'anchorTo'), {
      size: get(this, 'size')
    });

    if (layout) {
      this.applyLayout(layout, buffer);
    }
  },

  render: function(buffer) {
    this.renderWithLayout(buffer);
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


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get;

/**
  @extends Ember.Mixin

  Implements common pagination management properties for controllers.
*/
UI.PaginationSupport = Ember.Mixin.create(UI.DelegateSupport, {

  /**
    Walk like a duck.

    @property {Boolean}
  */
  hasPaginationSupport: true,

  /**
   *
   */
  total: 0,

  /**
   *
   */
  rangeStart: 0,

  /**
   *
   */
  rangeWindowSize: 10,

  /**
   *
   */
  rangeStop: Ember.computed(function() {
    var rangeStop = get(this, 'rangeStart') + get(this, 'rangeWindowSize'),
    total = get(this, 'total');
    if (rangeStop < total) {
      return rangeStop;
    }
    return total;
  }).property('total', 'rangeStart', 'rangeWindowSize').cacheable(),

  /**
   *
   */
  hasPrevious: Ember.computed(function() {
    return get(this, 'rangeStart') > 0;
  }).property('rangeStart').cacheable(),

  /**
   *
   */
  hasNext: Ember.computed(function() {
    return get(this, 'rangeStop') < get(this, 'total');
  }).property('rangeStop', 'total').cacheable(),

  /**
   *
   */
  nextPage: function() {
    if (get(this, 'hasNext')) {
      this.incrementProperty('rangeStart', get(this, 'rangeWindowSize'));
    }
  },

  /**
   *
   */
  previousPage: function() {
    if (get(this, 'hasPrevious')) {
      this.decrementProperty('rangeStart', get(this, 'rangeWindowSize'));
    }
  },

  /**
   *
   */
  page: Ember.computed(function() {
    return (get(this, 'rangeStart') / get(this, 'rangeWindowSize')) + 1;
  }).property('rangeStart', 'rangeWindowSize').cacheable(),

  /**
   *
   */
  totalPages: Ember.computed(function() {
    return Math.ceil(get(this, 'total') / get(this, 'rangeWindowSize'));
  }).property('total', 'rangeWindowSize').cacheable(),

  pageDidChange: Ember.observer(function() {
    this.invokeDelegateMethod(get(this, 'delegate'), 'didRequestRange', get(this, 'rangeStart'), get(this, 'rangeStop'));
  }, 'total', 'rangeStart', 'rangeStop')
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Strobe Inc. and contributors. ©2011 Paul Chavard
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = Ember.get, set = Ember.set;

/**
  @extends Ember.Mixin

  Implements common selection management properties for controllers.

  Selection can be managed by any controller in your applications.  This
  mixin provides some common management features you might want such as
  disabling selection, or restricting empty or multiple selections.

  To use this mixin, simply add it to any controller you want to manage
  selection and call updateSelectionAfterContentChange()
  whenever your source content changes.  You can also override the properties
  defined below to configure how the selection management will treat your
  content.

  This mixin assumes the arrangedObjects property will return an Ember.Array of
  content you want the selection to reflect.

  Add this mixin to any controller you want to manage selection.
*/
UI.SelectionSupport = Ember.Mixin.create({

  /**
    Walk like a duck.

    @property {Boolean}
  */
  hasSelectionSupport: true,

  /**
    If true, selection is allowed. Default is true.

    @property {Boolean}
  */
  allowsSelection: true,

  /**
    If true, multiple selection is allowed. Default is false.

    @property {Boolean}
  */
  allowsMultipleSelection: false,

  /**
    If true, allow empty selection Default is true.

    @property {Boolean}
  */
  allowsEmptySelection: true,

  /**
    Override to return the first selectable object.  For example, if you
    have groups or want to otherwise limit the kinds of objects that can be
    selected.

    the default imeplementation returns firstObject property.

    @returns {Object} first selectable object
  */
  firstSelectableObject: function() {
    return get(this, 'firstObject');
  }.property(),

  /**
    This is the current selection.  You can make this selection and another
    controller's selection work in concert by binding them together. You
    generally have a master selection that relays changes TO all the others.

    @property {UI.SelectionSet}
  */
  selection: function(key, value) {
    var old = this._scsel_selection,
    oldlen = old ? get(old, 'length') : 0,
    empty,
    arrangedObjects = get(this, 'arrangedObjects'),
    len;

    // whenever we have to recompute selection, reapply all the conditions to
    // the selection.  This ensures that changing the conditions immediately
    // updates the selection.
    //
    // Note also if we don't allowSelection, we don't clear the old selection;
    // we just don't allow it to be changed.
    if ((value === undefined) || !this.get('allowsSelection')) { value = old; }

    len = (value && value.isEnumerable) ? get(value, 'length') : 0;

    // if we don't allow multiple selection
    if ((len > 1) && !get(this, 'allowsMultipleSelection')) {

      if (oldlen > 1) {
        value = UI.SelectionSet.create().addObject(get(old, 'firstObject')).freeze();
        len = 1;
      } else {
        value = old;
        len = oldlen;
      }
    }

    // if we don't allow empty selection, block that also, unless we
    // have nothing to select.  select first selectable item if necessary.
    if ((len === 0) && !get(this, 'allowsEmptySelection') && arrangedObjects && get(arrangedObjects, 'length') !== 0) {
      if (oldlen === 0) {
        value = this.get('firstSelectableObject');
        if (value) { value = UI.SelectionSet.create().addObject(value).freeze(); }
        else { value = UI.SelectionSet.EMPTY; }
        len = get(value, 'length');

      } else {
        value = old;
        len = oldlen;
      }
    }

    // if value is empty or is not enumerable, then use empty set
    if (len === 0) { value = UI.SelectionSet.EMPTY; }

    // always use a frozen copy...
    if(value !== old) value = value.frozenCopy();
    this._scsel_selection = value;

    return value;

  }.property('arrangedObjects', 'allowsEmptySelection', 'allowsMultipleSelection', 'allowsSelection').cacheable(),

  /**
    YES if the receiver currently has a non-zero selection.

    @property {Boolean}
  */
  hasSelection: function() {
    var sel = get(this, 'selection');
    return !! sel && (get(sel, 'length') > 0);
  }.property('selection').cacheable(),

  // ..........................................................
  // METHODS
  //
  /**
    Selects the passed objects in your content.  If you set "extend" to YES,
    then this will attempt to extend your selection as well.

    @param {Ember.Enumerable} objects objects to select
    @param {Boolean} extend optionally set to true to extend selection
    @returns {Object} receiver
  */
  selectObjects: function(objects, extend) {

    // handle passing an empty array
    if (!objects || get(objects, 'length') === 0) {
      if (!extend) { set(this, 'selection', UI.SelectionSet.EMPTY); }
      return this;
    }

    var sel = this.get('selection');
    if (extend && sel) { sel = sel.copy(); }
    else { sel = UI.SelectionSet.create(); }

    sel.addObjects(objects).freeze();
    set(this, 'selection', sel);
    return this;
  },

  /**
    Selects a single passed object in your content.  If you set "extend" to
    YES then this will attempt to extend your selection as well.

    @param {Object} object object to select
    @param {Boolean} extend optionally set to true to extend selection
    @returns {Object} receiver
  */
  selectObject: function(object, extend) {
    if (object === null) {
      if (!extend) { set(this, 'selection', null); }
      return this;

    } else { return this.selectObjects([object], extend); }
  },

  /**
    Deselects the passed objects in your content.

    @param {Ember.Enumerable} objects objects to select
    @returns {Object} receiver
  */
  deselectObjects: function(objects) {

    if (!objects || get(objects, 'length') === 0) { return this; } // nothing to do
    var sel = get(this, 'selection');
    if (!sel || get(sel, 'length') === 0) { return this; } // nothing to do
    // find index for each and remove it
    sel = sel.copy().removeObjects(objects).freeze();
    set(this, 'selection', sel.freeze());
    return this;
  },

  /**
    Deselects the passed object in your content.

    @param {Ember.Object} object single object to select
    @returns {Object} receiver
  */
  deselectObject: function(object) {
    if (!object) { return this; } // nothing to do
    else { return this.deselectObjects([object]); }
  },

  /**
    Returns true if the selection contains the passed object.  This will search
    selected ranges in all source objects.

    @param {Object} object the object to search for
    @returns {Boolean}
  */
  objectIsSelected: function(object) {
    return get(this, 'selection').containsObject(object);
  },

  /**
    Call this method whenever your source content changes to ensure the
    selection always remains up-to-date and valid.

    @returns {Object}
  */
  updateSelectionAfterContentChange: function() {
    var arrangedObjects = get(this, 'arrangedObjects');
    var selectionSet = get(this, 'selection');
    var allowsEmptySelection = get(this, 'allowsEmptySelection');
    var indexSet; // Selection index set for arranged objects

    // If we don't have any selection, there's nothing to update
    if (!selectionSet) { return this; }
    // Remove any selection set objects that are no longer in the content
    indexSet = selectionSet.indexSetForSource(arrangedObjects);
    if ((indexSet && (get(indexSet, 'length') !== get(selectionSet, 'length'))) || (!indexSet && (get(selectionSet, 'length') > 0))) { // then the selection content has changed
      selectionSet = selectionSet.copy().constrain(arrangedObjects).freeze();
      set(this, 'selection', selectionSet);
    }

    // Reselect an object if required (if content length > 0)
    if ((get(selectionSet, 'length') === 0) && arrangedObjects && (get(arrangedObjects, 'length') > 0) && !allowsEmptySelection) {
      this.selectObject(get(this, 'firstSelectableObject'), false);
    }

    return this;
  }

});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get;

/**
  @extends Ember.Mixin
*/
UI.TextSelectionSupport = Ember.Mixin.create({
  disableTextSelection: true,

  /** @private */
  classNameBindings: ['disableTextSelection:sc-ui-disable-text-selection'],

  mouseDown: function(evt) {
    if (!get(this, 'disableTextSelection')) {
      evt.preventDefault();
    }
  }
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = Ember.get;

Ember.TextSupport.reopen({

  /**
    Walk like a duck.

    @property {Boolean}
  */
  hasTextSupport: true,

  /**
    @property {Boolean}
    @default false
  */
  required: false,

  /**
    @property {Boolean}
    @default false
  */
  readonly: false,

  /**
    @property {Boolean}
    @default false
  */
  autofocus: false,

  /**
    @property {String}
    @default '1'
   */
  tabindex: '1',

  /** @private */
  attributeBindings: ['required', 'readonly', 'autofocus', 'tabindex'],

  /**
    Give focus to the field
  */
  focus: function() {
    Ember.run.schedule('render', this, function() {
      get(this, 'element').focus();
    });
  },

  /**
    Blur the field
  */
  blur: function() {
    Ember.run.schedule('render', this, function() {
      get(this, 'element').blur();
    });
  }
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

var animKeyFramesRE = /^(from|to|\d+%?)$/,
    sorter = function(a, b) { return a.pct - b.pct; };

/**
  @class

  Overview
  ========

  UI.Animation is used to animate views. Most of the time you will use UI.Animatable behavior
  or UI.AnimationSupport mixin depending on your building blocks: Ember.View or Ember.State

  @extends Ember.Object
 */
UI.Animation = Ember.Object.extend(UI.DelegateSupport, {

  /**
    Walk like a duck.

    @property {Boolean}
  */
  isAnimation: true,

  /**
   * View to animate
   * @property {Ember.View}
   */
  target: null,

  /**
   * CSS properties to set before animation
   * @property {Object}
   */
  before: null,

  /**
   * @property {Object}
   */
  from: null,

  /**
   * @property {Object}
   */
  to: null,

  /**
   * @property {Object}
   */
  keyframes: null,

  /**
   * CSS properties to set after animation
   * @property {Object}
   */
  after: null,

  /**
   * @property {Number|String}
   */
  delay: 0,

  /**
   * @property {Number|String}
   */
  duration: 'normal',

  /**
   * @property {String}
   */
  easing: 'swing',

  /**
   * @property {Number}
   */
  iteration: 1,

  /**
   * @property {Boolean}
   */
  isRunning: false,

  /**
   * Run animation
   */
  run: function() {
    if (get(this, 'isRunning')) {
      return false;
    }
    set(this, 'isRunning', true);
    var target = get(this, 'target'),
        options = this.getProperties(
      'before',
      'from',
      'to',
      'after',
      'delay',
      'duration',
      'easing',
      'iteration'
    );
    this._queue = options.queue = "fx-%@".fmt(Ember.guidFor(target));
    var delegate = this.delegateFor('willAnimateView', get(this, 'delegate'), target);
    console.log('delegate', delegate);
    this.invokeDelegateMethod(delegate, 'willAnimateView', target, this);
    this.animateElement(target.$(), options);
    return true;
  },

  /**
   * Stop animation
   */
  stop: function() {
    if (get(this, 'isRunning')) {
      get(this, 'target').$().stop(this._queue, true);
      return true;
    }
    return false;
  },

  /** @private */
  animateElement: function(element, options) {
    // delay
    if (options.delay > 0) {
      element.delay(options.delay, options.queue);
    }
    // before
    if (options.before) {
      element.queue(options.queue, function() {
        element.css(options.before);
        Ember.$(this).dequeue();
      });
    }
    for (var i = options.iteration; i > 0; i--) {
      try {
        element
        // from
        .animate(options.from, {
          duration: 0,
          queue: options.queue
        })
        // to
        .animate(options.to, {
          duration: options.duration,
          easing: options.easing,
          queue: options.queue,
          complete: Ember.$.proxy(function() {
            if (i === 0) {
              // after
              if (options.after) {
                element.css(options.after);
              }
              this._queue = null;
              set(this, 'isRunning', false);
            }
            var target = get(this, 'target'),
                delegate = this.delegateFor('didAnimateView', get(this, 'delegate'), target);
            this.invokeDelegateMethod(delegate, 'didAnimateView', target, this);
          }, this)
        });
      } catch (e) {
        set(this, 'isRunning', false);
        throw e;
      }
    }
    // run
    element.dequeue(options.queue);
  },

  /** @private */
  // _keyframesDidChange: function() {
  //   var keyframes = get(this, 'keyframes'),
  //       from = get(this, 'from'),
  //       to = get(this, 'to');
  //   if (keyframes && (to || from)) {
  //     throw new Ember.Error('You can not specify `keyframes` parameter and `to` or `from` parameter at the same time');
  //   } else if (!keyframes && to && from) {
  //     keyframes = {
  //       from: from,
  //       to: to
  //     };
  //   }
  //   if (keyframes) {
  //     this._createTimeline(keyframes);
  //   } else {
  //     set(this, '_timeline', null);
  //   }
  // }.observes('keyframes', 'to', 'from'),

  /**
   * @private
   * Takes the given keyframe configuration object and converts it into an ordered array with the passed attributes per keyframe
   * or applying the 'to' configuration to all keyframes. Also calculates the proper animation duration per keyframe.
   */
  _timeline: Ember.computed(function() {
    var keyframes = get(this, 'keyframes'),
        attrs = [],
        timeline = [],
        duration = get(this, 'duration'),
        prevMs, ms, pct, keyframe;

    for (pct in keyframes) {
      if (keyframes.hasOwnProperty(pct) && animKeyFramesRE.test(pct)) {
        keyframe = {attrs: keyframes[pct]};

        // CSS3 spec allow for from/to to be specified.
        if (pct == "from") {
          pct = 0;
        } else if (pct == "to") {
          pct = 100;
        }
        // convert % values into integers
        keyframe.pct = parseInt(pct, 10);
        attrs.push(keyframe);
      }
    }
    
    // Sort by pct property
    attrs = attrs.sort(sorter);
    //attrs = attrs.sortProperty('pct');

    if (typeof duration === 'string') {
      switch (duration) {
      case 'slow':
        duration = 600;
        break;
      case 'fast':
        duration = 200;
        break;
      default:
        // normal
        duration = 400;
      }
    }

    for (var i = 0, l = attrs.length; i < l; i++) {
      prevMs = (attrs[i - 1]) ? duration * (attrs[i - 1].pct / 100) : 0;
      ms = duration * (attrs[i].pct / 100);
      timeline.push({
        duration: ms - prevMs,
        attrs: attrs[i].attrs
      });
    }
    return timeline;
  }).property('keyframes', 'to', 'from', 'duration')
});

UI.Animation.reverseDirectionMap = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
};

UI.Animation.reopenClass({
  createAnimation: function() {
    var args = Ember.A(arguments),
        animation = args.shift();
    if (typeof animation === 'string') {
      animation = UI[animation];
    }
    if (animation && this.detect(animation)) {
      return animation.create.apply(animation, args.filter(function(mixin) { return !Ember.none(mixin); }));
    }
  }
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get;

UI.Cube = UI.Animation.extend({

  duration: 'slow',

  direction: 'left',

  easing: 'ease-in',

  out: false,

  reverse: false,

  before: {
    webkitTransformStyle: 'preserve-3d'
  }
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get;

UI.Fade = UI.Animation.extend({

  out: false,

  reverse: false,

  from: function() {
    var out = get(this, 'out'), reverse = get(this, 'reverse');
    if ((out && !reverse) || (!out && reverse)) {
      return {opacity: 1};
    } else {
      return {opacity: 0};
    }
  }.property('out', 'reverse'),

  to: function() {
    var out = get(this, 'out'), reverse = get(this, 'reverse');
    if ((out && !reverse) || (!out && reverse)) {
      return {opacity: 0};
    } else {
      return {opacity: 1};
    }
  }.property('out', 'reverse')
});

UI.FadeIn = UI.Fade;
UI.FadeOut = UI.Fade.extend({out: true});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get;

UI.Flip = UI.Animation.extend({

  duration: 'slow',

  direction: 'left',

  easing: 'ease-in',

  out: false,

  reverse: false,

  before: {
    webkitTransformStyle: 'preserve-3d',
    webkitBackfaceVisibility: 'hidden'
  },

  from: function() {
    
  }.property('target', 'direction', 'out'),

  to: function() {
    
  }.property('target', 'direction', 'out')
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get;

UI.Pop = UI.Animation.extend({

  out: false,

  reverse: false,

  from: function() {
    var out = get(this, 'out'), reverse = get(this, 'reverse');
    if ((out && !reverse) || (!out && reverse)) {
      return {
        opacity: 1,
        scale: 1
      };
    } else {
      return {
        opacity: 0,
        scale: 0
      };
    }
  }.property('out', 'reverse'),

  to: function() {
    var out = get(this, 'out'), reverse = get(this, 'reverse');
    if ((out && !reverse) || (!out && reverse)) {
      return {
        opacity: 0,
        scale: 0
      };
    } else {
      return {
        opacity: 1,
        scale: 1
      };
    }
  }.property('out', 'reverse')
});

UI.PopIn = UI.Pop;
UI.PopOut = UI.Pop.extend({out: true});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get;

UI.Slide = UI.Animation.extend({

  duration: 'fast',

  direction: 'left',

  out: false,

  reverse: false,

  from: function() {
    var element = get(this, 'target').$(),
        direction = get(this, 'direction'),
        out = get(this, 'out'),
        reverse = get(this, 'reverse'),
        translateX = 0,
        translateY = 0;

    if (reverse) {
      direction = UI.Animation.reverseDirectionMap[direction];
    }
    switch (direction) {
    case 'left':
      translateX = element.width();
      break;
    case 'right':
      translateX = -element.width();
      break;
    case 'up':
      translateY = element.height();
      break;
    case 'down':
      translateY = -element.height();
      break;
    }
    return {
      translateX: (out) ? 0 : translateX,
      translateY: (out) ? 0 : translateY
    };
  }.property('target', 'direction', 'out', 'reverse'),

  to: function() {
    var element = get(this, 'target').$(),
        direction = get(this, 'direction'),
        out = get(this, 'out'),
        reverse = get(this, 'reverse'),
        translateX = 0,
        translateY = 0;

    if (reverse) {
      direction = UI.Animation.reverseDirectionMap[direction];
    }
    switch (direction) {
    case 'left':
      translateX = -element.width();
      break;
    case 'right':
      translateX = element.width();
      break;
    case 'up':
      translateY = -element.height();
      break;
    case 'down':
      translateY = element.height();
      break;
    }
    return {
      translateX: (out) ? translateX : 0,
      translateY: (out) ? translateY : 0
    }
  }.property('target', 'direction', 'out', 'reverse')
});

UI.SlideIn = UI.Slide;
UI.SlideOut = UI.Slide.extend({out: true});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Strobe Inc. and contributors. ©2011 Paul Chavard
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

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
  @extends Ember.Object
 */
UI.LayoutManager = Ember.Object.extend({

  /**
    Walk like a duck.

    @property {Boolean}
  */
  isLayoutManager: true,

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
        size = parseInt(options.size) + 'px',
        anchors = this._anchors,
        layout = {};

    if (direction !== null && direction !== meta.direction) { throw new Ember.Error("You can't setup a horizontal anchor in a vertical view and vice versa."); }
    if (size === undefined || size === null) { throw new Ember.Error("Anchors require a size property"); }

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

    if (beforeAnchorName) {
      layout[beforeAnchorName] = remainingSpace.before;
    }
    if (afterAnchorName) {
      layout[afterAnchorName] = remainingSpace.after;
    }

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
      if (remainingSpace.view.isView) {
        Ember.run.schedule('render', remainingSpace.view, 'applyLayout', layout);
      }
    }
  }
});

UI.rootLayoutManager = UI.LayoutManager.create({});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

UI.ViewState = Ember.ViewState.extend(UI.AnimationSupport, {

  enter: function(stateManager) {
    set(this, 'rootElement', get(stateManager, 'rootElement') || 'body');
    this.show();
  },

  exit: function() {
    this.hide();
  }
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, getPath = Ember.getPath;
var URL = window['URL' || 'webkitURL'];

Ember.BLANK_IMAGE_DATA_URL = "data:image/gif;base64,R0lGODlhAQABAJAAAP///wAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==";

/**
  @extends Ember.View
*/
UI.ImageView = Ember.View.extend({
  classNames: ['ui-image'],

  /**
   */
  useCanvas: true,

  /**
   */
  tagName: Ember.computed(function() {
    return get(this, 'useCanvas') ? 'canvas' : 'img';
  }).property('useCanvas').cacheable(),

  /**
    Image source url

    @property {String}
  */
  src: null,

  /**
    Default image source url

    @property {String}
  */
  defaultImage: Ember.BLANK_IMAGE_DATA_URL,

  /**

    @property {Boolean}
  */
  preserveAspectRatio: true,

  /**
    @property {Number}
  */
  height: null,

  /**
    @property {Number}
  */
  width: null,

  /**
    @property {String}
  */
  alt: null,

  /**
    @property {String}
   */
  ariaRole: 'img',

  /**
    @property {String}
  */
  status: 'none',

  attributeBindings: ['alt', 'width', 'height'],

  /**
    @property {File}
  */
  file: null,

  /**
    @property {Image}
   */
  image: new Image(),

  /**
    Reset image src to default blank value
  */
  reset: function() {
    this._loadDefaultImage(get(this, 'defaultImage'));
    set(this, 'status', 'none');
  },

  /**
    Reset image src to default blank value
  */
  toDataURL: function(type) {
    if (!get(this, 'useCanvas')) {
      return false;
    }
    type = type || 'image/jpg';
    var context = get(this, 'element').getContext('2d');
    if (context.toDataURL) {
      return context.toDataURL(type);
    }
    return false;
  },

  /**
   *
   */
  didLoad: function() {
    this._renderImage();
    set(this, 'status', 'loaded');
  },

  /**
   *
   */
  didError: function() {
    this._loadDefaultImage(get(this, 'defaultImage'));
    set(this, 'status', 'failed');
  },

  /** @private */
  init: function() {
    this._super();
    var file = get(this, 'file');
    if (URL && file) {
      set(this, 'src', URL.createObjectURL(file));
    } else if (!get(this, 'src')) {
      set(this, 'src', Ember.BLANK_IMAGE_DATA_URL);
    } else {
      this.propertyDidChange('src');
    }
    Ember.run.schedule('render', this, function() {
      this.propertyDidChange('width');
      this.propertyDidChange('height');
    });
  },

  /** @private */
  destroy: function() {
    var file = get(this, 'file');
    if (URL && file) {
      URL.revokeObjectURL(file);
    }
    return this._super();
  },

  /** @private */
  didChangeSrc: Ember.observer(function() {
    set(this, 'status', 'loading');
    Ember.run.schedule('render', this, '_loadImage');
  }, 'src'),

  /** @private */
  didChangeWidthHeight: Ember.observer(function(view, key) {
    var w = get(this, 'width'),
        h = get(this, 'height'),
        ew = getPath(this, 'image.width'),
        eh = getPath(this, 'image.height'),
        par = get(this, 'preserveAspectRatio'),
        arw = (par && h) ? ew / (eh / h) : ew,
        arh = (par && w) ? eh / (ew / w) : eh;
    // if (w && h) {
    //   if (key === 'height') {
    //     h = null;
    //   } else {
    //     w = null;
    //   }
    // }
    if (w && key != 'width') {
      set(this, 'height', arh);
    } else {
      set(this, 'width', arw);
    }
    if (get(this, 'useCanvas')) {
      this._renderImage();
    }
  }, 'width', 'height'),

  /** @private */
  _render: Ember.computed(function() {
    return UI.ImageView.renders[(get(this, 'useCanvas') ? 'canvas' : 'image')];
  }).property('useCanvas').cacheable(),

  /** @private */
  _loadImage: function() {
    Ember.$(get(this, 'image')).prop('src', get(this, 'src'))
      .load(Ember.$.proxy(this, 'didLoad'))
      .bind('error abort', Ember.$.proxy(this, 'didError'));
  },

  _renderImage: function(image) {
    get(this, '_render')(this, get(this, 'image'));
  },

  _loadDefaultImage: function(url) {
    var defaultImage = new Image();
    Ember.$(defaultImage).prop('src', url)
      .load(Ember.$.proxy(function() {
        get(this, '_render')(this, defaultImage);
        delete defaultImage;
      }, this))
      .bind('error abort', Ember.$.proxy(function() {
        delete defaultImage;
      }, this));
  }
});

UI.ImageView.reopenClass({
  createFromFile: function(file) {
    return this.create({file: file});
  },
  createFromURL: function(url) {
    return this.create({src: url});
  }
});

UI.ImageView.renders = {
  image: function(view, image) {
    view.$().prop('src', image.src);
  },
  canvas: function(view, image) {
    var canvas = get(view, 'element'),
        canvasContext = canvas.getContext('2d');
    var w = parseInt(get(view, 'width')), h = parseInt(get(view, 'height'));
    canvasContext.clearRect(0, 0, w, h);
    canvasContext.drawImage(image, 0, 0, w, h);
  }
};

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/**
  @extends Ember.View
 */
UI.LabelView = Ember.View.extend(UI.TextSelectionSupport, UI.TitleSupport, {
  tagName: 'span',
  classNames: ['ui-label'],
  defaultTemplate: Ember.Handlebars.compile('{{{formattedTitle}}}')
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
UI.LayoutView = Ember.View.extend(UI.LayoutSupport);

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, getPath = Ember.getPath, setPath = Ember.setPath;

/**
  @extends Ember.View
  @mixins UI.ButtonSupport
*/
UI.ListItemView = Ember.View.extend(UI.TitleSupport, {
  tagName: 'li',
  classNames: ['ui-list-item'],
  classNameBindings: ['selected', 'disabled'],

  localizeBinding: 'collectionView.localize',
  disabled: false,

  mouseUp: function(event) {
    if (!getPath(this, 'collectionView.disabled')) {
      this._super(event);
    }
  },

  triggerAction: function() {
    get(this, 'collectionView').change(this, get(this, 'value'));
  },

  selected: Ember.computed(function() {
    var selection = getPath(this, 'collectionView.content.selection');
    return selection && selection.contains(get(this, 'content'));
  }).property('collectionView.content.selection.@each').cacheable()
});

/**
  @extends Ember.CollectionView
  @mixins UI.SelectableSupport
*/
UI.ListView = Ember.CollectionView.extend(Ember.TargetActionSupport, {
  tagName: 'ul',
  classNames: ['ui-list'],
  classNameBindings: ['disabled'],

  /**
   * [localize description]
   * @type {Boolean}
   */
  localize: false,

  /**
   * [disabled description]
   * @type {Boolean}
   */
  disabled: false,

  /**
   * [multiple description]
   * @type {Boolean}
   */
  multiple: true,

  itemViewClass: UI.ListItemView,

  change: function(view, selected) {
    var selection = getPath(this, 'content.selection'),
        content = get(view, 'content');
    if (!selection) {
      selection = Ember.A([]);
      setPath(this, 'content.selection', selection);
    }
    if (selected && !selection.contains(content)) {
      selection.pushObject(content);
    } else {
      selection.removeObject(content);
    }
  }
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

/**
  @extends Ember.View
  @mixins UI.Animatable
 */
UI.PopoverView = Ember.View.extend(UI.AnimationSupport, UI.Animatable, {
  classNames: ['ui-popover'],
  isVisible: false,
  rootElement: 'body',

  // show: function(animation) {
  //   this.showView(this, get(this, 'rootElement'), animation);
  // },

  // hide: function(animation) {
  //   this.hideView(this, animation);
  // },

  willAnimateView: function(view, rootElement) {
    this._super(view, rootElement);
    Ember.run.schedule('render', this, 'applyLayout');
  },

  applyLayout: Ember.K
});

/**
 * [OverlayView description]
 * @extends UI.PopoverView
 */
UI.OverlayView = UI.PopoverView.extend({
  classNames: ['ui-overlay'],

  /**
   * [opacity description]
   * @type {Number}
   */
  opacity: 0.6,

  /**
   * [color description]
   * @type {String}
   */
  color: '#444',

  /**
   * [applyLayout description]
   */
  applyLayout: function() {
    this.$().css({
      display: 'block',
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: '0px',
      left: '0px',
      opacity: get(this, 'opacity'),
      backgroundColor: get(this, 'color')
    });
  }
});

/**
 * [DialogView description]
 * @extends UI.PopoverView
 */
UI.DialogView = UI.PopoverView.extend({
  classNames: ['ui-dialog'],

  /**
   * [top description]
   * @type {Number}
   */
  top: 100,

  /**
   * [width description]
   * @type {Number}
   */
  width: 200,

  /**
   * [height description]
   * @type {Number}
   */
  height: 100,

  /**
   * [isModal description]
   * @type {Boolean}
   */
  isModal: true,

  /**
   * [overlayView description]
   * @type {UI.OverlayView}
   */
  overlayView: UI.OverlayView,

  init: function() {
    this._super();
    set(this, 'overlayView', get(this, 'overlayView').create({rootElement: get(this, 'rootElement')}));
  },

  /**
   * [willAnimateView description]
   * @param  {[type]} view        [description]
   * @param  {[type]} rootElement [description]
   * @return {[type]}
   */
  willAnimateView: function(view, rootElement) {
    this._super(view, rootElement);
    if (get(this, 'isModal')) {
      get(this, 'overlayView').show();
    }
  },

  didAnimateView: function(view, animation) {
    this._super(view, animation);
    if (get(this, 'isModal')) {
      get(this, 'overlayView').hide();
    }
  },

  modalDidChange: Ember.observer(function() {
    if (get(this, 'isModal') && get(this, 'isVisible')) {
      get(this, 'overlayView').show();
    } else {
      get(this, 'overlayView').hide();
    }
  }, 'isModal'),

  /**
   * [applyLayout description]
   */
  applyLayout: Ember.observer(function() {
    var width = get(this, 'width'),
        height = get(this, 'height');
    this.$().width(width).height(height).css({
      display: 'block',
      position: 'fixed',
      zIndex: 11000,
      left: 50 + '%',
      marginLeft: -(width/2) + "px",
      top: get(this, 'top') + "px"
    });
  }, 'top', 'width', 'height')
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember UI
// Copyright: ©2011 Paul Chavard and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get;

Ember.View.reopen({
  repondToKeyEvents: false
});

Ember.$(document).on('keyup keydown', function(evt) {
  $('.ember-view:visible').each(function(i, elem) {
    var view = Ember.View.views[elem.id];
    if (view && get(view, 'repondToKeyEvents')) {
      if (evt.type === 'keydown' && typeof view.keyDown === 'function') {
        view.keyDown(evt);
      } else if (typeof view.keyUp === 'function') {
        view.keyUp(evt);
      }
    }
  });
});

})({});
