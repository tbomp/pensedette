class Account < ActiveRecord::Base
  validates :total,
    :numericality => {
      :only_integer => true
    }

  has_many :transactions
  has_many :foreign_transactions, :class_name => 'Transaction', :foreign_key => 'foreign_account_id'

  def all_transactions
    transactions
    #(transactions + foreign_transactions).uniq
    #Transaction.where('foreign_account_id = ? OR account_id = ?', id, id)
  end

end
