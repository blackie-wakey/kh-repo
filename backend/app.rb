require 'faker'
require 'active_record'
require 'kaminari'
require 'sinatra/base'
require 'graphiti'
require 'graphiti/adapters/active_record'

require_relative './seeds'
require_relative './config/application_resource'
require_relative './resources/department_resource'
require_relative './resources/employee_resource'
require_relative './controllers/employee_directory_app'

Graphiti.setup!
