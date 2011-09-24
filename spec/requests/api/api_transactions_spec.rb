require 'spec_helper'

describe "ApiTransactions" do
  fixtures :users, :transactions
  
  describe "GET /api_transactions" do
    it "Should list transactions for curent users" do
      # Run the generator again with the --webrat flag if you want to use webrat methods/matchers
      post user_session_path({:user =>
                                {:email => "test@gmail.com", :password => "toto42"}})
      binding.pry
      response.status.should be(200)
      get api_transactions_path
      response.status.should be(200)
    end
  end
end
