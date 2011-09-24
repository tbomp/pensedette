class Api::FriendsController < ApplicationController
  def index
    render :json => current_user.friendships
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

