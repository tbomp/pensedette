class Api::FriendsController < ApplicationController
  before_filter :authenticate_user!

  def index
    res = []
    if params[:q]
      res = []
    else
      res = current_user.friendships.map do |friendship|
        friendship.friend
      end
    end
    render :json => res
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
end

