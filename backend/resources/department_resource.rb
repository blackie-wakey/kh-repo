# frozen_string_literal: true

# DepartmentResource handles JSON:API serialization and query logic for Department models using Graphiti.
# It exposes attributes and relationships to be used by the API.
class DepartmentResource < ApplicationResource
  self.model = Department
  self.type = :departments

  attribute :name, :string
end
