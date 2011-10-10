PD.HeaderView = SC.View.extend(UI.LayoutSupport, {
  tagName: 'header',
  templateName: 'app/header',
  anchorTo: 'top',
  size: '30px'
});

PD.ContentScrollView = SC.ScrollView.extend(UI.LayoutSupport, {
  anchorTo: 'remainingSpace',
  hasHorizontalScroller: false
});

PD.FooterView = SC.View.extend(UI.LayoutSupport, {
  tagName: 'footer',
  templateName: 'app/footer',
  anchorTo: 'bottom',
  size: '30px'
});

PD.ContainerView = SC.View.extend(UI.LayoutSupport, {
  classNames: ['container'],
  isVisible: false,
  anchorTo: 'remainingSpace'
});

PD.ApplicationView = SC.ContainerView.extend({
  classNames: ['application'],
  targetBinding: 'PD.statechart',
  homeScreen: PD.ContainerView.extend({
    elementId: 'home',
    templateName: 'app/home'
  }),
  newTransactionScreen: PD.ContainerView.extend({
    elementId: 'new-transaction',
    templateName: 'app/new'
  }),
  transactionsScreen: PD.ContainerView.extend({
    elementId: 'transactions',
    templateName: 'app/transactions'
  }),
  pendingScreen: PD.ContainerView.extend({
    elementId: 'pending',
    templateName: 'app/pending'
  }),
  childViews: ['homeScreen', 'newTransactionScreen', 'transactionsScreen', 'pendingScreen']
});
