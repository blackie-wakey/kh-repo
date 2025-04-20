# frozen_string_literal: true

require 'rack/test'
require 'rspec'
require 'database_cleaner/active_record'
require_relative '../app'

# Explicitly set RACK_ENV to 'test' before any code is run
ENV['RACK_ENV'] = 'test'

# Set up the test database (this ensures it's created before running tests)
ActiveRecord::Base.establish_connection(
  adapter: 'sqlite3',
  database: 'db/test.sqlite3'
)

# Include Rack::Test methods for simulating HTTP requests
RSpec.configure do |config|
  config.before(:suite) do
    # Ensure that the test database is properly migrated and set up
    ActiveRecord::Base.connection.create_table(:departments, force: true) do |t|
      t.string :name
    end

    ActiveRecord::Base.connection.create_table(:employees, force: true) do |t|
      t.string :first_name
      t.string :last_name
      t.integer :age
      t.string :position
      t.integer :department_id, index: true
    end

    # Ensure DatabaseCleaner is only cleaning the test database
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with(:truncation) # Cleanup before running tests
  end

  config.before(:each) do
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end
end
