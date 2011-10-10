class Api::TransactionsController < ApplicationController
  respond_to :json
  before_filter :authenticate_user!

  def account
    render :json => current_user.account
  end

  def index
    render :json => current_user.transactions
  end

  def create
    creditor_uid = resource_params[:creditor]
    creditor_account = nil
    borrower_uid = resource_params[:borrower]
    borrower_account = nil

    if creditor_uid
      creditor_account = Account.find_or_create_by_uid creditor_uid
      borrower_account = current_user.account

      # if !creditor_account
      #   creditor_account = Account.create :uid => creditor_uid
      # end
    elsif borrower_uid
      creditor_account = current_user.account
      borrower_account = Account.find_or_create_by_uid borrower_uid

      # if !borrower_account
      #   borrower_account = Account.create :uid => borrower_uid
      # end
    end
    if borrower_account && creditor_account
      @resource = Transaction.new :creditor => creditor_account, :borrower => borrower_account,
        :amount => resource_params[:amount], :label => resource_params[:label], :state => 0
      if resource.save
        render :json => resource, :status => :created
      else
        render :json => resource.errors, :status => :unprocessable_entity
      end
    else
      head :not_found
    end
  end

  def update(options={}, &block)
    if resource.update_attributes :state => resource_params[:state], :label => resource_params[:label]
      head :ok
    else
      render :json => resource.errors, :status => :unprocessable_entity
    end
  end

  def destroy
    resource.destroy
    head :ok
  end

  protected

  def resource
    @resource ||= current_user.transactions.find params[:id]
  end

  def resource_params
    request.request_parameters
  end
end

