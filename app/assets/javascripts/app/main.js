// ==========================================================================
// Project:   Pense-Dette
// Copyright: ©2011 Paul Chavard
// ==========================================================================

SC.I18n.defaultLocale = "fr";
SC.I18n.locale = "fr";

PD = SC.Application.create({
  store: SC.Store.create().from('PD.DataSource'),

  ready: function() {
    this._super();
    PD.RootView.create().replaceIn('#application');
    //Mobalize.hideUrlBar();
  }
});
