PD.HeaderView = SC.View.extend(UI.LayoutSupport, {
  tagName: 'header',
  templateName: 'app/header',
  anchorTo: 'top',
  size: '30px'
});

PD.PageView = SC.View.extend(UI.LayoutSupport, {
  classNames: ['pd-page'],
  isVisible: false
});

PD.ApplicationView = SC.ContainerView.extend(UI.LayoutSupport, {
  classNames: ['application'],
  headerView: PD.HeaderView,
  scrollView: SC.ContainerView.extend(UI.LayoutSupport, {
    classNames: ['pd-scroll'],
    anchorTo: 'remainingSpace',
    homeView: PD.PageView.extend({
      elementId: 'home',
      tagName: 'ul',
      templateName: 'mobile/home'
    }),
    newTransactionView: PD.PageView.extend({
      elementId: 'new-transaction',
      templateName: 'mobile/new'
    }),
    transactionsView: PD.PageView.extend({
      elementId: 'transactions',
      templateName: 'mobile/transactions'
    }),
    pendingView: PD.PageView.extend({
      elementId: 'pending',
      templateName: 'mobile/pending'
    }),
    childViews: ['homeView', 'newTransactionView', 'transactionsView', 'pendingView']
  }),
  childViews: ['headerView', 'scrollView'],

  homeViewBinding: '*scrollView.homeView',
  newTransactionViewBinding: 'scrollView.newTransactionView',
  transactionsViewBinding: 'scrollView.transactionsView',
  pendingViewBinding: 'scrollView.pendingView'
});
