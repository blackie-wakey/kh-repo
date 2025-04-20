# frozen_string_literal: true

# spec/factories/employees.rb
FactoryBot.define do
  factory :employee do
    first_name { 'John' }
    last_name  { 'Doe' }
    age        { 36 }
    position   { 'Developer' }
    department
  end
end
