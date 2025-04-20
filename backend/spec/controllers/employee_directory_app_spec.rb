# frozen_string_literal: true

require_relative '../spec_helper'

RSpec.describe EmployeeDirectoryApp do
  include Rack::Test::Methods

  def app
    EmployeeDirectoryApp
  end

  describe 'GET /api/v1/employees' do
    it 'returns a 200 status' do
      get '/api/v1/employees'
      expect(last_response.status).to eq(200)
    end

    it 'returns employees in JSON:API format' do
      get '/api/v1/employees'
      expect(last_response.headers['Content-Type']).to include('application/vnd.api+json')
    end
  end
end
