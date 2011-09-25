class Transaction < ActiveRecord::Base
  belongs_to :creditor, :class_name => 'Account'
  belongs_to :borrower, :class_name => 'Account'

  col :creditor, :as => :references
  col :borrower, :as => :references
  col :amount, :as => :integer
  col :label
  col :state, :as => :integer, :default => 0
  col :credited, :as => :boolean

  scope :accepted, where(:state => 1)
  scope :regected, where(:state => 2)

  validates :amount,
    :presence => true,
    :numericality => {
      :greater_than => 0,
      :only_integer => true
    }

  validates :state,
    :inclusion => {:in => [0, 1, 2]}

  PENDING  = 0
  ACCEPTED = 1
  REGECTED = 2

  after_save :credit_account

  def credit_account
    if self.state == 1 && !self.credited
      borrower.total += self.amount
      creditor.total -= self.amount
      self.borrower.save
      self.creditor.save
      self.update_attributes :credited => true
    end
    if self.state == 2 && self.credited
      borrower.total -= self.amount
      creditor.total += self.amount
      self.borrower.save
      self.creditor.save
      self.update_attributes :credited => false
    end
  end

end
Transaction.auto_upgrade!

