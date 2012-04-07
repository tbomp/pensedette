Panda.ApplicationView = Em.TabContainerView.extend({
  elementId: 'panda-application',
  currentViewBinding: Em.Binding.oneWay('Panda.stateManager.currentState.name').transform(function(value) {
    return typeof value === 'string' ? value.replace(/^\./, '') : null;
  }),
  currentViewTitleBinding: Em.Binding.oneWay('Panda.stateManager.currentState.name').transform(function(value) {
    return typeof value === 'string' ? I18n.translate('panda.nav.'+value) : null;
  }),
  templateName: 'app/mobile/application'
});

Panda.TabView = Em.TabView.extend({

  tagName: 'li',
  template: Em.Handlebars.compile('<a {{bindAttr href="href"}}>{{title}}</a>'),

  classNameBindings: ['active', 'value'],
  titleBinding: Em.Binding.oneWay('value').transform(function(value) {
    return I18n.translate("panda.nav.%@".fmt(value));
  }),
  active: function() {
    return Panda.stateManager.getPath('currentState.name') === ".%@".fmt(this.get('value'));
  }.property('value', 'Panda.stateManager.currentState.name').cacheable(),
  hrefBinding: Em.Binding.oneWay('value').transform(function(value) {
    return '#'+value;
  })
});

$('a[href]').click(function(evt) {
  evt.preventDefault();
  var href = $(this).attr('href');
  location.href = href;
  Panda.stateManager.goToState(href.replace(/^#/, ''));
});

Panda.TabPaneView = Em.TabPaneView.extend({
  templateNameBinding: Em.Binding.oneWay('viewName').transform(function(value) {
    return "app/mobile/%@".fmt(value);
  }),

  init: function() {
    var name = this.get('viewName');
    this.set('classNames', 'panda-%@'.fmt(name));
    this._super();
  }
});
