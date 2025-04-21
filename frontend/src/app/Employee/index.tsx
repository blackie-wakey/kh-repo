import { useEffect, useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    SortingState
} from "@tanstack/react-table";
import { Department } from "../../application-record/models/department.ts";
import { Employee } from "../../application-record/models/employee.ts";

type EmployeeWithDept = Employee & { department?: Department };

const EmployeeTable = () => {
    const [data, setData] = useState<EmployeeWithDept[]>([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [rowCount, setRowCount] = useState(0);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const pageSize = 10;

    const columns = useMemo<ColumnDef<EmployeeWithDept>[]>(() => [
        { accessorKey: "firstName", header: "First Name" },
        { accessorKey: "lastName", header: "Last Name" },
        { accessorKey: "age", header: "Age" },
        { accessorKey: "position", header: "Position" },
        {
            header: "Department",
            accessorFn: (row) => row.department?.name || "N/A",
            id: "departmentName",
            enableSorting: false,
        },
    ], []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sortQuery = sorting.reduce<Record<string, 'asc' | 'desc'>>((acc, { id, desc }) => {
                    acc[id] = desc ? 'desc' : 'asc';
                    return acc;
                }, {});

                let query = Employee.includes("department")
                    .page(page)
                    .per(pageSize)
                    .order(sortQuery)
                    .stats({ total: "count" });

                if (searchQuery) {
                    query = query
                        .where({ first_or_last_name: `${searchQuery}` });
                }
                const response = await query.all();

                setData(response.data as EmployeeWithDept[]);
                setPageCount(Math.ceil(response.meta?.stats.total.count / pageSize) || 1);
                setRowCount(response.meta?.stats.total.count || 0);
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };

        fetchData();
    }, [page, pageSize, sorting, searchQuery]);

    const table = useReactTable({
        data,
        columns,
        pageCount,
        rowCount,
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize,
            },
            sorting,
        },
        onSortingChange: setSorting,
        manualSorting: true,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: (updater) => {
            const newState =
                typeof updater === "function" ? updater({ pageIndex: page - 1, pageSize }) : updater;
            setPage(newState.pageIndex + 1);
        },
    });

    return (
        <div className="p-4">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by First or Last Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md w-64"
                />
            </div>

            <table className="min-w-full border border-gray-300 rounded-md shadow-sm">
                <thead className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            const isSortable = header.column.getCanSort();
                            return (
                                <th
                                    key={header.id}
                                    className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-300 cursor-pointer select-none"
                                    onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                                >
                                    <div className="flex items-center gap-1">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {isSortable && (
                                            <span className="text-xs">
                                                {{
                                                    asc: '↑',
                                                    desc: '↓',
                                                }[header.column.getIsSorted() as string] ?? ''}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            );
                        })}

                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                    >
                        {row.getVisibleCells().map((cell) => (
                            <td
                                key={cell.id}
                                className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200"
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-4 flex items-center gap-4 justify-start">
            <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50"
            >
                Prev
            </button>
            <span className="text-sm text-gray-600">
                Page {page} of {Math.ceil(pageCount)}
            </span>
            <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50"
            >
                Next
            </button>
            </div>
        </div>
    );
};

export default EmployeeTable;