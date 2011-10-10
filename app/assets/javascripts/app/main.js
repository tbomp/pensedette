PD = SC.Application.create({
  store: SC.Store.create().from('PD.DataSource'),
  ready: function() {
    this._super();
    PD.rootView = PD.ApplicationView.create();
    $('body .application').remove();
    PD.rootView.appendTo('body');
    PD.statechart.initStatechart();
  }
});

SC.Button.reopen({
  classNames: ['large']
});

SC.TextField.reopen({
  classNames: ['xlarge']
});
