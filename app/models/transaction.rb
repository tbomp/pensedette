class Transaction < ActiveRecord::Base
  belongs_to :account
  belongs_to :foreign_account, :class_name => 'Account'

  after_save :credit_account

  scope :pending, where(:state => 0)
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

  protected

  def credit_account
    if self.state == 1 && !self.credited
      borrower.update_attributes :total => (borrower.total + self.amount)
      creditor.update_attributes :total => (creditor.total - self.amount)
      self.update_attributes :credited => true
    elsif self.state == 2 && self.credited
      borrower.update_attributes :total => (borrower.total - self.amount)
      creditor.update_attributes :total => (creditor.total + self.amount)
      self.update_attributes :credited => false
    end
  end

end
