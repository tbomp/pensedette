class Transaction < ActiveRecord::Base
  belongs_to :creditor, :class_name => 'Account'
  belongs_to :borrower, :class_name => 'Account'

  after_save :credit_account

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

  def borrower_uid
    self.borrower.uid
  end

  def creditor_uid
    self.creditor.uid
  end

  def as_json options={}
    super(:except => [:creditor_id, :borrower_id, :credited], :methods => [:borrower_uid, :creditor_uid])
  end

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
Transaction.auto_upgrade!

