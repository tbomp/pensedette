class WelcomeController < ApplicationController
  before_filter :authenticate_user!, :only => [:app]

  def app
    render 'app_sc'
  end
end

