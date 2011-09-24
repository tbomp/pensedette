class Transaction < ActiveRecord::Base
  belongs_to :creditor, :class_name => 'User'
  belongs_to :borrower, :class_name => 'User'

  col :creditor_id, :as => :references
  col :borrower_id, :as => :references
  col :amount, :as => :integer
  col :state, :as => :integer

  scope :accepted, :where => {:state => Transaction.ACCEPTED}
  scope :regected, :where => {:state => Transaction.REGECTED}
  scope :canceled, :where => {:state => Transaction.CANCELED}

  validates :amount,
    :presence => true,
    :numericality => {
      :greater_than => 0,
      :only_integer => true
    }

  validates :state,
    :inclusion => {:in => [
      Transaction.ACCEPTED,
      Transaction.REGECTED,
      Transaction.CANCELED,
      Transaction.CLEARED,
      Transaction.PENDING
    ]
  }

  PENDING  = 0
  ACCEPTED = 1
  REGECTED = 2
  CANCELED = 3
  CLEARED  = 4
end
Transaction.auto_upgrade!

