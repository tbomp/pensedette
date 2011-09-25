class Account < ActiveRecord::Base
  belongs_to :user

  col :user, :as => :references
  col :uid, :as => :integer
  col :total, :as => :integer, :default => 0

  validates :total,
    :numericality => {
      :only_integer => true
    }

  def transactions
    Transaction.where('borrower_id = ? OR creditor_id = ?', id, id)
  end
end
Account.auto_upgrade!

