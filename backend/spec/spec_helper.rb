# frozen_string_literal: true

# spec/spec_helper.rb

require 'rack/test'
require 'rspec'

# Setup for Sinatra application
ENV['RACK_ENV'] = 'test'

require_relative '../app'

# Include Rack::Test methods for simulating HTTP requests


RSpec.configure do |config|
  config.before(:suite) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with(:truncation)
  end

  config.before(:each) do
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end
end
