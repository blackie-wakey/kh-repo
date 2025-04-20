# frozen_string_literal: true

require_relative '../spec_helper'

RSpec.describe EmployeeResource do
  include Rack::Test::Methods

  def app
    EmployeeDirectoryApp
  end

  let!(:department) { Department.create(name: 'Engineering') }
  let!(:employee) do
    Employee.create(
      first_name: 'John',
      last_name: 'Doe',
      age: 36,
      position: 'Developer',
      department_id: department.id
    )
  end

  describe 'EmployeeResource' do
    it 'returns an employee by id' do
      get "/api/v1/employees/#{employee.id}"

      expect(last_response.status).to eq(200)
      json = JSON.parse(last_response.body)

      expect(json['data']['attributes']['first_name']).to eq('John')
      expect(json['data']['attributes']['last_name']).to eq('Doe')
      expect(json['data']['attributes']['age']).to eq(36)
      expect(json['data']['attributes']['position']).to eq('Developer')
      expect(json['data']['attributes']['department_id'].to_i).to eq(department.id)
    end
  end

  describe 'EmployeeResource' do
    it 'returns a list of employees' do
      get '/api/v1/employees'

      expect(last_response.status).to eq(200)
      json = JSON.parse(last_response.body)

      expect(json['data'].length).to be >= 1

      names = json['data'].map { |e| e['attributes']['first_name'] }
      expect(names).to include('John')
    end
  end
end
