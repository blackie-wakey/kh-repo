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

  filter :first_or_last_name, :string do
    eq do |scope, value|
      search_term = value.is_a?(Array) ? value.first : value

      if search_term.present?
        words = search_term.downcase.split(' ')
        conditions = []
        values = []

        words.each do |word|
          conditions.push('(LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ?)')
          values.push("%#{word}%", "%#{word}%")
        end

        scope.where(conditions.join(' AND '), *values)
      else
        scope
      end
    end
  end
end
