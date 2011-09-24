require 'koala'


class WelcomeController < ApplicationController
  before_filter :authenticate_user!, :only => [:app]

  def app
    render :layout => false
  end
  
  def test_get_fb_friends
    puts "See me in the console"
    
    

    if (! @my_oauth_token.nil?)
      @graph = Koala::Facebook::GraphAPI.new(my_oauth_token)    
      @facebook_friends = @graph.get_object("me").FriendList
    else 
      puts "Mocking up a fake friend list"
      @facebook_friends = Array.[]( "John", "Robert", "Martin" )
    end
    
  end
end

