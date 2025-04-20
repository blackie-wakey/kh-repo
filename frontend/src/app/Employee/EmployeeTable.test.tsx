import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeTable from './index';

// Mock the Employee model's data fetching
jest.mock('../../application-record/models/employee.ts', () => ({
    Employee: {
        includes: jest.fn().mockReturnThis(),
        page: jest.fn().mockReturnThis(),
        per: jest.fn().mockReturnThis(),
        stats: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        all: jest.fn().mockResolvedValue({
            data: [
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
            ],
            meta: { stats: { total: { count: 12 } } }, // Total 12 records (2 pages with pageSize 10)
        }),
    },
}));

describe('EmployeeTable with TanStack React Table', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Pagination Tests', () => {
        it('should render employee table and paginate correctly', async () => {
            render(<EmployeeTable />);

            // Wait for the first page data to load
            await waitFor(() => screen.getByText('John'));
            expect(screen.getByText('Doe')).toBeInTheDocument();
            expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();

            // Find the "Next" button
            const nextPageButton = screen.getByRole('button', { name: /Next/i });
            expect(nextPageButton).toBeEnabled();

            // Click "Next"
            await userEvent.click(nextPageButton);
            await waitFor(() => screen.getByText('Henry'));
            expect(screen.getByText('Orange')).toBeInTheDocument();
            expect(screen.getByText(/Page 2 of 2/i)).toBeInTheDocument();
            expect(nextPageButton).toBeDisabled();

            // Find the "Prev" button
            const prevPageButton = screen.getByRole('button', { name: /Prev/i });
            expect(prevPageButton).toBeEnabled();

            // Click "Prev" button
            await userEvent.click(prevPageButton);
            await waitFor(() => screen.getByText('John'));
            expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();
            expect(prevPageButton).toBeDisabled();
        });
    });

    describe('Employee Data Rendering', () => {
        it('should render the correct employee data in the table', async () => {
            render(<EmployeeTable />);

            await waitFor(() => screen.getByText('John'));
            const johnCell = screen.getByText('John');
            const doeCell = johnCell.closest('tr')?.querySelector('td:nth-child(2)');

            expect(doeCell).toHaveTextContent('Doe');
        });

        it('should render employee details correctly for "Bob Green"', async () => {
            render(<EmployeeTable />);

            await waitFor(() => screen.getByText('Bob'));
            const bobCell = screen.getByText('Bob');
            const greenCell = bobCell.closest('tr')?.querySelector('td:nth-child(2)');

            expect(greenCell).toHaveTextContent('Green');
        });

        it('should correctly render the position and department for "John Doe"', async () => {
            render(<EmployeeTable />);

            await waitFor(() => screen.getByText('John'));
            const johnRow = screen.getByText('John').closest('tr');

            expect(johnRow).toHaveTextContent('Developer');
            expect(johnRow).toHaveTextContent('Engineering');
        });
    });

    describe('Sorting Tests', () => {
        it('should sort by first name in ascending order when clicked once', async () => {
            render(<EmployeeTable />);

            await waitFor(() => screen.getByText('John'));

            const firstNameHeader = screen.getByText('First Name');
            await userEvent.click(firstNameHeader);

            await waitFor(() => screen.getByText('Alice'));

            const firstRow = screen.getByText('Alice').closest('tr');
            const secondRow = firstRow?.nextElementSibling;
            expect(firstRow?.textContent).toContain('Alice');
            expect(secondRow?.textContent).toContain('Bob');
        });

        it('should sort by age in descending order when clicked twice', async () => {
            render(<EmployeeTable />);

            await waitFor(() => screen.getByText('John'));
            const ageHeader = screen.getByText('Age');
            await userEvent.click(ageHeader);
            await userEvent.click(ageHeader);

            await waitFor(() => screen.getByText('Ivy'));
            const firstRow = screen.getByText('Ivy').closest('tr');
            const secondRow = firstRow?.nextElementSibling;
            expect(secondRow?.textContent).toContain('Henry');
        });

        it('should not sort by department', async () => {
            render(<EmployeeTable />);

            await waitFor(() => screen.getByText('John'));

            const departmentHeader = screen.getByText('Department');
            expect(departmentHeader).toBeInTheDocument();

            expect(departmentHeader).not.toHaveClass('cursor-pointer');
            const firstRow = screen.getByText('John').closest('tr');
            expect(firstRow?.textContent).toContain('Engineering');
        });
    });
});
