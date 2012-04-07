class TransactionSerializer < ActiveModel::Serializer
  attributes :id, :amount, :label, :state

  has_one :foreign_account, :key => :account

  embed :ids, :include => true
end
