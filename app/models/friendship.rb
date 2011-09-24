class Friendship < ActiveRecord::Base
  col :user, :friend, :as => :references

  belongs_to :user
  belongs_to :friend, :class_name => 'User'
end
Friendship.auto_upgrade!

