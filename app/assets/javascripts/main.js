PD = SC.Application.create({
  store: SC.Store.create().from('PD.DataSource'),
  ready: function() {
    this._super();
    SC.run.begin();
    PD.statechart.rootView = PD.ApplicationView.create().append();
    SC.run.end();
    PD.statechart.initStatechart();
    Mobalize.hideUrlBar();
  }
});
