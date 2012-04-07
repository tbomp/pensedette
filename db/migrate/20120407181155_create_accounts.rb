class CreateAccounts < ActiveRecord::Migration
  def up
    create_table(:accounts) do |t|
      t.string :uid
      t.string :name
      t.integer :total, :default => 0
    end
  end

  def down
  end
end
