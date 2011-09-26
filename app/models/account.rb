class Account < ActiveRecord::Base
  belongs_to :user

  col :user, :as => :references
  col :uid, :as => :string
  col :total, :as => :integer, :default => 0

  validates :total,
    :numericality => {
      :only_integer => true
    }

  def transactions
    Transaction.where('borrower_id = ? OR creditor_id = ?', id, id)
  end

  def as_json options={}
    super :only => [:uid, :total]
  end
end
Account.auto_upgrade!

