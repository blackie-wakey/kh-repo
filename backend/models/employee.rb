# frozen_string_literal: true

# employee.rb
class Employee < ApplicationRecord
  belongs_to :department
end
