import {useMemo, useState} from "react";
import {ColumnDef, SortingState} from "@tanstack/react-table";
import {Department} from "../../application-record/models/department.ts";
import {Employee} from "../../application-record/models/employee.ts";
import {useEmployeeTableData} from "./hooks/useEmployeeTableData";
import {EmployeeTableView} from "./EmployeeTableView";

type EmployeeWithDept = Employee & { department?: Department };

const EmployeeList = () => {
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");

    const {data, pageCount, rowCount, departments} = useEmployeeTableData(
        page,
        sorting,
        searchQuery,
        departmentFilter
    );

    const columns = useMemo<ColumnDef<EmployeeWithDept>[]>(() => [
        {accessorKey: "firstName", header: "First Name"},
        {accessorKey: "lastName", header: "Last Name"},
        {accessorKey: "age", header: "Age"},
        {accessorKey: "position", header: "Position"},
        {
            header: "Department",
            accessorFn: (row) => row.department?.name || "N/A",
            id: "departmentName",
            enableSorting: false,
        },
    ], []);

    return (
        <div className="p-4">
            <div className="mb-4 flex gap-4">
                <input
                    type="text"
                    placeholder="Search by First or Last Name"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md w-64 shadow-sm"
                />

                <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="pr-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer"
                >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                    ))}
                </select>
            </div>

            <EmployeeTableView
                data={data}
                columns={columns}
                pageCount={pageCount}
                rowCount={rowCount}
                page={page}
                setPage={setPage}
                sorting={sorting}
                setSorting={setSorting}
            />
        </div>
    );
};

export default EmployeeList;
