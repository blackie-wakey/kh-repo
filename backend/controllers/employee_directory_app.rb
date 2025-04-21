# frozen_string_literal: true

# API routes for departments and employees using Graphiti resources.
class EmployeeDirectoryApp < Sinatra::Application
  configure do
    mime_type :jsonapi, 'application/vnd.api+json'
  end

  before do
    content_type :jsonapi
  end

  after do
    ActiveRecord::Base.connection_handler.clear_active_connections!
  end

  get '/api/v1/departments' do
    departments = DepartmentResource.all(params)
    departments.to_jsonapi
  end

  get '/api/v1/departments/:id' do
    departments = DepartmentResource.find(params)
    departments.to_jsonapi
  end

  get '/api/v1/employees' do
    employees = EmployeeResource.all(params)
    employees.to_jsonapi
  end

  get '/api/v1/employees/:id' do
    employees = EmployeeResource.find(params)
    employees.to_jsonapi
  end

  post '/api/v1/employees' do
    request_payload = JSON.parse(request.body.read)
    attributes = request_payload.dig('data', 'attributes') || {}

    employee = Employee.new(
      first_name: attributes['first_name'],
      last_name: attributes['last_name'],
      age: attributes['age'],
      position: attributes['position'],
      department_id: attributes['department_id']
    )

    if employee.save
      status 201
      EmployeeResource.find(id: employee.id).to_jsonapi
    else
      status 422
      {
        errors: employee.errors.map do |message|
          {
            detail: message
          }
        end
      }.to_json
    end
  end
end
