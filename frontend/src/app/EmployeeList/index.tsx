import {useState} from "react";
import {SortingState} from "@tanstack/react-table";
import {useEmployeeTableData} from "./hooks/useEmployeeTableData";
import {EmployeeTableView} from "./components/EmployeeTableView.tsx";
import {AddEmployeeModal} from "./components/AddEmployeeModal.tsx";

const EmployeeList = () => {
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const {data, pageCount, rowCount, departments} = useEmployeeTableData(
        page,
        sorting,
        searchQuery,
        departmentFilter,
        refreshKey
    );

    const refetchTrigger = () => {
        setRefreshKey((prev) => prev + 1);
        setPage(pageCount);
    };

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
                    onChange={(e) => {
                        setDepartmentFilter(e.target.value);
                        setPage(1);
                    }}
                    className="pr-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer"
                >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => setShowModal(true)}
                    className="px-3 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 shadow-md"
                >
                    Add Employee
                </button>
            </div>

            <EmployeeTableView
                data={data}
                pageCount={pageCount}
                rowCount={rowCount}
                page={page}
                setPage={setPage}
                sorting={sorting}
                setSorting={setSorting}
            />

            <AddEmployeeModal
                key={refreshKey}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                departments={departments}
                onEmployeeAdded={refetchTrigger}/>
        </div>
    );
};

export default EmployeeList;
