require 'faker'
require 'active_record'
require 'kaminari'
require 'sinatra/base'
require 'graphiti'
require 'graphiti/adapters/active_record'

# Set the environment (defaults to development)
env = ENV['RACK_ENV'] || 'development'

# Determine the database file based on the environment
db_path = env == 'test' ? 'db/test.sqlite3' : 'db/employee-directory.sqlite3'

# Establish the database connection
ActiveRecord::Base.establish_connection(
  adapter: 'sqlite3',
  database: db_path
)

# Include the necessary models, resources, and controllers
require_relative './models/application_record'
require_relative './models/department'
require_relative './models/employee'
require_relative './config/application_resource'
require_relative './resources/department_resource'
require_relative './resources/employee_resource'
require_relative './controllers/employee_directory_app'

# Seed the database only if it's in development and not already seeded
require_relative './seeds' if env == 'development'

# Setup Graphiti framework
Graphiti.setup!
