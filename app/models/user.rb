class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :uid

  has_many :friendships
  has_many :friends, :through => :friendships

  has_many :inverse_friendships, :class_name => "Friendship", :foreign_key => "friend_id"  
  has_many :inverse_friends, :through => :inverse_friendships, :source => :user

  has_one :account

  def transactions
    self.account.transactions
  end

  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session["devise.facebook_data"] && session["devise.facebook_data"]["extra"]["user_hash"]
        user.email = data["email"]
        create_account user, session["devise.facebook_data"]["uid"]
        user
      end
    end
  end

  def self.find_for_facebook_oauth(access_token, signed_in_resource=nil)
    data = access_token["extra"]["user_hash"]
    if user = User.find_by_email(data["email"])
      user
    else # Create a user with a stub password. 
      user = User.create :email => data["email"], :password => Devise.friendly_token[0,20]
      create_account user, access_token["uid"]
      user
    end
  end

  def self.create_account user, uid
    account = Account.find_by_uid(uid)
    if !account
      Account.create :user => user, :uid => uid
    else
      account.update_attributes :user => user
    end
  end
end

