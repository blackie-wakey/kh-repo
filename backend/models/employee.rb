# frozen_string_literal: true

# employee.rb
class Employee < ApplicationRecord
  belongs_to :department

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :age, presence: true
  validates :position, presence: true
  validates :department_id, presence: true

  validates :first_name, uniqueness: { scope: :last_name, message: 'and last name combination must be unique' }
end
