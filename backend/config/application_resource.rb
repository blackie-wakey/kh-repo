# frozen_string_literal: true

# ApplicationResource serves as the base class for all Graphiti resources. It configures the ActiveRecord adapter
# and common settings like base URL and namespace for the API.
class ApplicationResource < Graphiti::Resource
  self.abstract_class = true
  self.adapter = Graphiti::Adapters::ActiveRecord
  self.base_url = 'http://localhost:4567'
  self.endpoint_namespace = '/api/v1'
  self.validate_endpoints = false
end
