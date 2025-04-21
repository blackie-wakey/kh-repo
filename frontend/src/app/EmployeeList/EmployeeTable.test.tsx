import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeTable from './index';

const mockEmployeeData = [
    { firstName: 'John', lastName: 'Doe', age: 21, position: 'Developer', department: { name: 'Engineering' } },
    { firstName: 'Jane', lastName: 'Smith', age: 22, position: 'Designer', department: { name: 'Design' } },
    { firstName: 'Peter', lastName: 'Jones', age: 23, position: 'Manager', department: { name: 'Management' } },
    { firstName: 'Alice', lastName: 'Brown', age: 24, position: 'Analyst', department: { name: 'Analytics' } },
    { firstName: 'Bob', lastName: 'Green', age: 25, position: 'Architect', department: { name: 'Engineering' } },
    { firstName: 'Charlie', lastName: 'White', age: 26, position: 'Tester', department: { name: 'Quality Assurance' } },
    { firstName: 'David', lastName: 'Black', age: 27, position: 'Support', department: { name: 'Support' } },
    { firstName: 'Eve', lastName: 'Gray', age: 28, position: 'Sales', department: { name: 'Sales' } },
    { firstName: 'Frank', lastName: 'Purple', age: 29, position: 'Marketing', department: { name: 'Marketing' } },
    { firstName: 'Grace', lastName: 'Yellow', age: 30, position: 'HR', department: { name: 'Human Resources' } },
    { firstName: 'Henry', lastName: 'Orange', age: 31, position: 'Developer', department: { name: 'Engineering' } },
    { firstName: 'Ivy', lastName: 'Silver', age: 32, position: 'Designer', department: { name: 'Design' } },
];

const mockDepartmentData = [
    { id: '1', type: 'departments', attributes: { name: 'Engineering' } },
    { id: '2', type: 'departments', attributes: { name: 'Design' } },
    { id: '3', type: 'departments', attributes: { name: 'Management' } },
    { id: '4', type: 'departments', attributes: { name: 'Analytics' } },
    { id: '5', type: 'departments', attributes: { name: 'Engineering' } },
    { id: '6', type: 'departments', attributes: { name: 'Quality Assurance' } },
    { id: '7', type: 'departments', attributes: { name: 'Support' } },
    { id: '8', type: 'departments', attributes: { name: 'Sales' } },
    { id: '9', type: 'departments', attributes: { name: 'Marketing' } },
    { id: '10', type: 'departments', attributes: { name: 'Human Resources' } },
];

const mockEmployeeQuery = {
    page: jest.fn().mockReturnThis(),
    per: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    stats: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    all: jest.fn().mockResolvedValue({
        data: mockEmployeeData,
        meta: { stats: { total: { count: 12 } } },
    }),
};

const mockDepartmentQuery = {
    all: jest.fn().mockResolvedValue({
        data: mockDepartmentData,
        meta: {},
    }),
};

jest.mock('../../application-record/models/employee.ts', () => ({
    Employee: {
        includes: jest.fn(() => mockEmployeeQuery),
    },
}));

jest.mock('../../application-record/models/department.ts', () => ({
    Department: {
        includes: jest.fn(() => mockDepartmentQuery),
    },
}));

describe('EmployeeTable with React Table', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        render(<EmployeeTable />);
    });

    describe('EmployeeList Data Rendering', () => {
        it('should render the correct employee data in the table', async () => {
            await waitFor(() => screen.getByText('John'));
            const johnCell = screen.getByText('John');
            const doeCell = johnCell.closest('tr')?.querySelector('td:nth-child(2)');

            expect(doeCell).toHaveTextContent('Doe');
        });

        it('should render employee details correctly for "Bob Green"', async () => {
            await waitFor(() => screen.getByText('Bob'));
            const bobCell = screen.getByText('Bob');
            const greenCell = bobCell.closest('tr')?.querySelector('td:nth-child(2)');

            expect(greenCell).toHaveTextContent('Green');
        });

        it('should correctly render the position and department for "John Doe"', async () => {
            await waitFor(() => screen.getByText('John'));
            const johnRow = screen.getByText('John').closest('tr');

            expect(johnRow).toHaveTextContent('Developer');
            expect(johnRow).toHaveTextContent('Engineering');
        });
    });

    describe('Pagination Query Tests', () => {
        it('should generate the correct query when going to the next page', async () => {
            await waitFor(() => {
                expect(mockEmployeeQuery.page).toHaveBeenCalledWith(1);
            });

            const nextPageButton = screen.getByRole('button', { name: /Next/i });
            await userEvent.click(nextPageButton);

            await waitFor(() => {
                expect(mockEmployeeQuery.page).toHaveBeenCalledWith(2);
            });
        });

        it('should generate the correct query when going to the previous page', async () => {
            await waitFor(() => {
                expect(mockEmployeeQuery.page).toHaveBeenCalledWith(1);
            });

            const nextPageButton = screen.getByRole('button', { name: /Next/i });
            await userEvent.click(nextPageButton);

            await waitFor(() => {
                expect(mockEmployeeQuery.page).toHaveBeenCalledWith(2);
            });

            const prevPageButton = screen.getByRole('button', { name: /Prev/i });
            await userEvent.click(prevPageButton);

            await waitFor(() => {
                expect(mockEmployeeQuery.page).toHaveBeenCalledWith(1);
            });
        });

        it('should generate the correct query with the correct page size', async () => {
            await waitFor(() => {
                expect(mockEmployeeQuery.per).toHaveBeenCalledWith(10);
            });
        });
    });

    describe('EmployeeTable Query Generation', () => {
        it('should generate the correct query when changing page', async () => {
            const nextPageButton = screen.getByRole('button', { name: /Next/i });
            await userEvent.click(nextPageButton);

            expect(mockEmployeeQuery.page).toHaveBeenCalledWith(2);
        });

        it('should generate the correct query when sorting by age', async () => {
            const ageHeader = screen.getByText('Age');
            await userEvent.click(ageHeader);

            expect(mockEmployeeQuery.order).toHaveBeenCalledWith({ age: 'desc' });

            await userEvent.click(ageHeader);
            expect(mockEmployeeQuery.order).toHaveBeenCalledWith({ age: 'asc' });
        });

        it('should generate the correct query when filtering by name', async () => {
            const searchInput = screen.getByPlaceholderText('Search by First or Last Name');
            await userEvent.type(searchInput, 'John');

            expect(mockEmployeeQuery.where).toHaveBeenCalledWith({
                first_or_last_name: 'John',
            });
        });

        it('should generate the correct query when filtering by department', async () => {
            await waitFor(() => {
                expect(screen.getByRole('combobox')).toBeInTheDocument();
            });

            const departmentSelect = screen.getByRole('combobox');
            const options = departmentSelect.querySelectorAll('option');
            expect(options.length).toBeGreaterThan(0);

            await userEvent.selectOptions(departmentSelect, mockDepartmentData[5].attributes.name);

            expect(mockEmployeeQuery.where).toHaveBeenCalledWith({
                department_id: mockDepartmentData[5].id,
            });
        });


        it('should generate the correct query with pagination and sorting', async () => {
            expect(mockEmployeeQuery.page).toHaveBeenCalledWith(1);
            expect(mockEmployeeQuery.per).toHaveBeenCalledWith(10);

            const ageHeader = screen.getByText('Age');
            await userEvent.click(ageHeader);

            expect(mockEmployeeQuery.order).toHaveBeenCalledWith({ age: 'desc' });

            const nextPageButton = screen.getByRole('button', { name: /Next/i });
            await userEvent.click(nextPageButton);

            expect(mockEmployeeQuery.page).toHaveBeenCalledWith(2);

            expect(mockEmployeeQuery.order).toHaveBeenCalledWith({ age: 'desc' });
        });
    });
});
