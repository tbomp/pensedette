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
    account = current_user.account
    foreign_account = Account.find(filtered_params[:account])
    if account && foreign_account
      @resource = Transaction.new(
        :account => account,
        :foreign_account => foreign_account,
        :amount => filtered_params[:amount],
        :label => filtered_params[:label]
      )
      resource.save
      respond_with resource, :location => nil
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

  def filtered_params
    params[:transaction].slice(:label, :amount, :account)
  end

  def resource
    @resource ||= current_user.transactions.find params[:id]
  end

  def resource_params
    request.request_parameters
  end
end

