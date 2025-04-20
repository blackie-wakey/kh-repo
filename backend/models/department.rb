# frozen_string_literal: true

# department.rb
class Department < ApplicationRecord
  has_many :employees
end
