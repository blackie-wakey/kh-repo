# frozen_string_literal: true

require_relative '../spec_helper'

RSpec.describe EmployeeResource do
  include Rack::Test::Methods

  def app
    EmployeeDirectoryApp
  end

  let!(:department) { Department.create(name: 'Engineering') }
  let!(:employee1) do
    Employee.create(
      first_name: 'John',
      last_name: 'Doe',
      age: 36,
      position: 'Developer',
      department_id: department.id
    )
  end
  let!(:employee2) do
    Employee.create(
      first_name: 'Jane',
      last_name: 'Smith',
      age: 30,
      position: 'Designer',
      department_id: department.id
    )
  end
  let!(:employee3) do
    Employee.create(
      first_name: 'John',
      last_name: 'Smith',
      age: 40,
      position: 'Manager',
      department_id: department.id
    )
  end

  describe 'EmployeeResource' do
    it 'returns an employee by id' do
      get "/api/v1/employees/#{employee1.id}"

      expect(last_response.status).to eq(200)
      json = JSON.parse(last_response.body)

      expect(json['data']['attributes']['first_name']).to eq('John')
      expect(json['data']['attributes']['last_name']).to eq('Doe')
      expect(json['data']['attributes']['age']).to eq(36)
      expect(json['data']['attributes']['position']).to eq('Developer')
      expect(json['data']['attributes']['department_id'].to_i).to eq(department.id)
    end
  end

  describe 'EmployeesResource' do
    it 'returns a list of employees' do
      get '/api/v1/employees'

      expect(last_response.status).to eq(200)
      json = JSON.parse(last_response.body)

      expect(json['data'].length).to be >= 1

      names = json['data'].map { |e| e['attributes']['first_name'] }
      expect(names).to include('John')
    end

    context 'when searching by first name' do
      it 'returns employees with the matching first name' do
        get '/api/v1/employees', filter: { first_or_last_name: 'John' }

        expect(last_response.status).to eq(200)
        json = JSON.parse(last_response.body)

        names = json['data'].map { |e| e['attributes']['first_name'] }
        expect(names).to include('John')
        expect(names).not_to include('Jane')
      end
    end

    context 'when searching by last name' do
      it 'returns employees with the matching last name' do
        get '/api/v1/employees', filter: { first_or_last_name: 'Smith' }

        expect(last_response.status).to eq(200)
        json = JSON.parse(last_response.body)

        last_names = json['data'].map { |e| e['attributes']['last_name'] }
        expect(last_names).to include('Smith')
        expect(last_names).not_to include('Doe')  # Fix: 'Doe' should not be included
      end
    end

    context 'when searching by both first and last name' do
      it 'returns employees with the matching first or last name' do
        get '/api/v1/employees', filter: { first_or_last_name: 'John Smith' }

        expect(last_response.status).to eq(200)
        json = JSON.parse(last_response.body)

        names = json['data'].map { |e| e['attributes']['first_name'] }
        last_names = json['data'].map { |e| e['attributes']['last_name'] }

        expect(names).to include('John')
        expect(last_names).to include('Smith')
      end
    end

    context 'when no employees match the search term' do
      it 'returns an empty result' do
        get '/api/v1/employees', filter: { first_or_last_name: 'Nonexistent' }

        expect(last_response.status).to eq(200)
        json = JSON.parse(last_response.body)

        expect(json['data']).to be_empty
      end
    end
  end
end
