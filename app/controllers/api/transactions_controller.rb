class Api::TransactionsController < InheritedResources::Base
  respond_to :json
  actions :all, :except => [:new, :edit, :show, :destroy]
  before_filter :authenticate_user!

  def account
    render :json => current_user.account
  end

  def create
    Rails.logger.debug(resource_params)
    creditor_id = resource_params[:creditor_id]
    creditor_uid = resource_params[:creditor_uid]
    creditor_account = nil
    borrower_id = resource_params[:borrower_id]
    borrower_uid = resource_params[:borrower_uid]
    borrower_account = nil

    if creditor_id || creditor_uid
      if creditor_id
        creditor_account = Account.where(:user_id => creditor_id).first
      else
        creditor_account = Account.where(:uid => creditor_uid).first
        if !creditor_account
          creditor_account = Account.create :uid => creditor_uid
        end
      end
      borrower_account = current_user.account
    elsif borrower_id || borrower_uid
      if creditor_id
        borrower_account = Account.where(:user_id => borrower_id).first
      else
        borrower_account = Account.where(:uid => borrower_uid).first
        if !borrower_account
          borrower_account = Account.create :uid => borrower_uid
        end
      end
      creditor_account = current_user.account
    end
    if borrower_account && creditor_account
      @resource = Transaction.create :creditor => creditor_account,
        :borrower => borrower_account, :amount => resource_params[:amount], :state => 0
      #create!
      render :json => @resource
    else
      head 400
    end
  end

  def update(options={}, &block)
    update! do |format|
      format.json do
        object = resource
        update_resource(object, :state => resource_params[:state])
        render :json => object
      end
    end
  end

  protected

  def begin_of_association_chain
    current_user
  end

  def resource_params
    request.request_parameters
  end
end

