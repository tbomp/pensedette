class AccountSerializer < ActiveModel::Serializer
  attributes :id, :uid, :name, :total

  has_many :transactions

  def transactions
    account.all_transactions
  end

  embed :ids, :include => true
end
