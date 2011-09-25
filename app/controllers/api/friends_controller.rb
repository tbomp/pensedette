class Api::FriendsController < ApplicationController
  before_filter :authenticate_user!

  def index
    render :json => facebook_friends
  end

  def create
    id = params[:friend_id]
    friendship = current_user.friendships.build(:friend_id => id)
    if friendship.save
      render :json => User.find(id)
    else
      head 400
    end
  end

  def destroy
    friendship = current_user.friendships.find(params[:id])
    friendship.destroy
  end

  protected

  def facebook_friends
    @facebook_friends ||= get_facebook_friends
  end

  def get_facebook_friends
    token = session["oauth_token"]
    if token
      require 'koala'
      graph = Koala::Facebook::GraphAPI.new(token)
      graph.get_connections("me", "friends")
    else
      []
    end
  end
end

