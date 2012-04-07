class Api::AccountsController < ApplicationController
  respond_to :json
  before_filter :authenticate_user!

  def index
    account = Account.find_or_create_by_uid(params[:uid])
    account.update_attributes(:name => params[:name])
    respond_with [account]
  end
end
