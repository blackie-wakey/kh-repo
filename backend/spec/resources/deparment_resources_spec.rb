# frozen_string_literal: true

require_relative '../spec_helper'
RSpec.describe DepartmentResource do
  include Rack::Test::Methods

  def app
    EmployeeDirectoryApp
  end

  let!(:department) { Department.create(name: 'HR') }

  describe 'DepartmentResource' do
    it 'returns a department by id' do
      get "/api/v1/departments/#{department.id}"

      expect(last_response.status).to eq(200)
      json = JSON.parse(last_response.body)
      expect(json['data']['attributes']['name']).to eq('HR')
    end

    it 'returns a list of departments' do
      get '/api/v1/departments'

      expect(last_response.status).to eq(200)
      json = JSON.parse(last_response.body)

      expect(json['data'].length).to be >= 1

      names = json['data'].map { |e| e['attributes']['name'] }
      expect(names).to include('HR')
    end
  end
end
