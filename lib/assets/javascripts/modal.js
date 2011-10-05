(function() {
var get = SC.get, set = SC.set;

SC.ModalHeaderView = SC.View.extend({
  classNames: ['modal-header'],
  defaultTemplate: SC.Handlebars.compile('<a href="#" class="close">×</a><h3>{{parentView.title}}</h3>')
});

SC.ModalBodyView = SC.View.extend({
  classNames: ['modal-body'],
  templateBinding: 'parentView.template'
});

SC.ModalFooterView = SC.ContainerView.extend({
  classNames: ['modal-footer']
});

SC.ModalButton = SC.Button.extend({
  classNames: ['btn'],
  targetBinding: 'parentView.parentView'
});

SC.Modal = SC.ContainerView.extend({
  backdrop: true,
  keyboard: false,
  animate: true,

  title: null,
  message: null,

  classNames: ['modal'],
  classNameBindings: ['animate:fade'],
  isVisible: false,

  headerView: SC.ModalHeaderView,
  bodyView: SC.ModalBodyView,
  footerView: SC.ModalFooterView,
  childViews: ['headerView', 'bodyView', 'footerView'],

  defaultTemplate: SC.Handlebars.compile('<p>{{parentView.message}}</p>'),

  open: function() {
    if (get(this, 'state') !== 'inDOM') {
      this._insertElementLater(function() {
        this.$().appendTo('body');
        this._willOpen = true;
      });
    } else {
      this.$().modal('show');
    }
    return this;
  },
  close: function() {
    this.$().modal('hide');
    return this;
  },
  toggle: function() {
    this.$().modal('toggle');
    return this;
  },
  didInsertElement: function() {
    this._super();
    this.$().modal({
      backdrop: get(this, 'backdrop'),
      keyboard: get(this, 'keyboard')
    });
    this.$()
      .bind('shown', $.proxy(this, 'didShown'))
      .bind('hidden', $.proxy(this, 'didHidden'));
    var controller = get(this, 'controller');
    if (controller) {
      controller.set('modalView', this);
    }
    if (this._willOpen) {
      this.$().modal('show');
      this._willOpen = false;
    }
  },
  didShown: function(evt) {
    var controller = get(this, 'controller');
    if (controller && typeof controller.shown === 'function') {
      controller.shown.call(controller, evt);
    } else {
      this.shown(evt);
    }
  },
  didHidden: function(evt) {
    var controller = get(this, 'controller');
    if (controller && typeof controller.hidden === 'function') {
      controller.hidden.call(controller, evt);
    } else {
      this.hidden(evt);
    }
  },
  shown: SC.K,
  hidden: SC.K
});

SC.Alert = SC.Modal.extend({
  footerView: SC.ModalFooterView.extend({
    childViews: ['ok'],
    ok: SC.ModalButton.extend({
      title: 'OK',
      action: 'close'
    })
  })
});

SC.Alert.reopenClass({
  open: function(title, message) {
    return this.create({
      title: title,
      message: message,
      hidden: function() {
        this.destroy();
      }
    }).open();
  }
});

})();
