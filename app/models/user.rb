class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :registerable, :recoverable, :rememberable, :trackable, :omniauthable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :remember_me, :uid, :account, :name

  belongs_to :account

  def transactions
    self.account.transactions
  end

  def to_data
    UserSerializer.new(self).to_json
  end

  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session["devise.facebook_data"] && session["devise.facebook_data"]["extra"]["raw_info"]
        user.email = data["email"]
        create_account user, session["devise.facebook_data"]["uid"], data["name"]
        user
      end
    end
  end

  def self.find_for_facebook_oauth(access_token, signed_in_resource=nil)
    data = access_token['extra']['raw_info']
    if user = User.find_by_email(data['email'])
      user.update_attributes :name => data['name']
      user
    else # Create a user with a stub password.
      user = User.create :email => data['email'], :name => data['name']
      create_account user, access_token['uid'], data['name']
      user
    end
  end

  def self.create_account user, uid, name
    account = Account.find_or_create_by_uid(uid)
    account.update_attributes :name => name
    user.update_attributes(:account => account)
  end
end

