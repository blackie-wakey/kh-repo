# frozen_string_literal: true

# EmployeeResource handles JSON:API serialization and querying for Employee models via Graphiti.
# It defines the exposed attributes and relationships, such as the association to Department.
class EmployeeResource < ApplicationResource
  self.model = Employee
  self.type = :employees

  attribute :first_name, :string
  attribute :last_name, :string
  attribute :age, :integer
  attribute :position, :string
  attribute :department_id, :string

  belongs_to :department
end
