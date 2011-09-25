class WelcomeController < ApplicationController
  before_filter :authenticate_user!, :only => [:app]

  #def app
  #  render :layout => false
  #end
end

