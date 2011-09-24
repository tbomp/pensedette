require 'spec_helper'

describe "ApiTransactions" do
  fixtures :users, :transactions
  
  before (:each) do
    post user_session_path(
      :user => {
        :email => "test@gmail.com",
        :password => "toto42"
        })
  end
  
  describe "GET /api_transactions" do
    
    it "should list transactions for curent users" do
      # Run the generator again with the --webrat flag if you want to use webrat methods/matchers
      get api_transactions_path
      response.status.should be(200)
      response.body.should have_json_size(2)
    end
  end
    
  describe "POST /api/1.0/transactions" do
  
    it "should create a new transaction in state pending" do
      post api_transactions_path, {
          :borrower_id => 2,
          :creditor_id => 3,
          :amount => 560,
          :state => 0
          }
      response.status.should be(201)
      response.body.should have_json_path('id')
    end
  end
  
end
