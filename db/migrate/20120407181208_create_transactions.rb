class CreateTransactions < ActiveRecord::Migration
  def up
    create_table(:transactions) do |t|
      t.references :account, :foreign_account
      t.integer :amount
      t.string :label
      t.integer :state, :default => 0
      t.boolean :credited
    end
  end

  def down
  end
end
