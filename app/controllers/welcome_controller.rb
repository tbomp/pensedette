require 'koala'


class WelcomeController < ApplicationController
  before_filter :authenticate_user!, :only => [:app]

  def app
    render :layout => false
  end
  
  def test_get_fb_friends
    Rails.logger.debug "you goooot me"
    
    facebook_session = session["devise.facebook_data"]

    Rails.logger.debug "My FB session object: #{facebook_session}"
    @my_oauth_token = "something from code"
    
    if (! @my_oauth_token.nil?)
      @graph = Koala::Facebook::GraphAPI.new(my_oauth_token)
      @facebook_friends = @graph.get_object("me").FriendList
    else 
      puts "Mocking up a fake friend list"
      
      john = { :name => "John" }
      
      @facebook_friends = [ john ]
    end
    
    
    @graph = Koala::Facebook::GraphAPI.new
    @me_on_facebook = @graph.get_object("btaylor")
    # @me_on_facebook = { :name => "John", :picture => "http://t1.gstatic.com/images?q=tbn:ANd9GcSY9R-B5U3VugzMmWAgiv1CMS5-NgU8M0O0OQCa8ewx7tuQemIM" }
    
  end
end

