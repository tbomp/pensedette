class Transaction < ActiveRecord::Base
  belongs_to :creditor, :class_name => 'User'
  belongs_to :borrower, :class_name => 'User'

  col :creditor, :as => :references
  col :borrower, :as => :references
  col :amount, :as => :integer
  col :state, :as => :integer

  scope :accepted, where(:state => 1)
  scope :regected, where(:state => 2)
  scope :canceled, where(:state => 3)

  validates :amount,
    :presence => true,
    :numericality => {
      :greater_than => 0,
      :only_integer => true
    }

  validates :state,
    :inclusion => {:in => [0, 1, 2, 3, 4]}

  PENDING  = 0
  ACCEPTED = 1
  REGECTED = 2
  CANCELED = 3
  CLEARED  = 4
end
Transaction.auto_upgrade!

