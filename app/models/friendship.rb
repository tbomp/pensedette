class Friendship < ActiveRecord::Base
  col :user_id, :friend_id, :as => :references

  belongs_to :user
  belongs_to :friend, :class_name => 'User'
end
Friendship.auto_upgrade!

