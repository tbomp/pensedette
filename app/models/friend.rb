class Friend
  include ActiveAttr::Model

  attribute :id
  attribute :name
  attribute :source, :default => 'facebook'
end
