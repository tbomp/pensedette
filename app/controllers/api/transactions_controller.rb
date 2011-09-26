class Api::TransactionsController < InheritedResources::Base
  respond_to :json
  actions :all, :except => [:new, :edit, :show]
  before_filter :authenticate_user!

  def account
    render :json => current_user.account
  end

  def create
    creditor_uid = resource_params[:creditor]
    creditor_account = nil
    borrower_uid = resource_params[:borrower]
    borrower_account = nil

    if creditor_uid
      creditor_account = Account.find_by_uid creditor_uid
      borrower_account = current_user.account

      if !creditor_account
        creditor_account = Account.create :uid => creditor_uid
      end
    elsif borrower_uid
      creditor_account = current_user.account
      borrower_account = Account.find_by_uid borrower_uid

      if !borrower_account
        borrower_account = Account.create :uid => borrower_uid
      end
    end
    if borrower_account && creditor_account
      resource = Transaction.create :creditor => creditor_account, :borrower => borrower_account,
        :amount => resource_params[:amount], :label => resource_params[:label], :state => 0
      render :json => resource
    else
      head 404
    end
  end

  def update(options={}, &block)
    resource = current_user.transactions.find params[:id]
    resource.update_attributes :state => resource_params[:state], :label => resource_params[:label]
    render :json => resource
  end

  protected

  def begin_of_association_chain
    current_user
  end

  def resource_params
    request.request_parameters
  end
end

