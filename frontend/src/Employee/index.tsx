import { useEffect, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import { Department } from "../application-record/models/department";
import { Employee } from "../application-record/models/employee";

type EmployeeWithDept = Employee & { department?: Department };

const columns: ColumnDef<EmployeeWithDept>[] = [
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "age", header: "Age" },
    { accessorKey: "position", header: "Position" },
    {
        header: "Department",
        accessorFn: (row) => row.department?.name || "N/A",
        id: "departmentName",
    },
];


const EmployeeTable = () => {
    const [data, setData] = useState<EmployeeWithDept[]>([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [rowCount, setRowCount] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        const fetchData = async () => {
            const response = await Employee
                .includes("department")
                .page(page)
                .per(pageSize)
                .stats({ total: "count" })
                .all();

            setData(response.data as EmployeeWithDept[]);
            setPageCount(response.meta?.stats.total.count / pageSize || 1);
            setRowCount(response.meta?.stats.total.count || 0);
        };

        fetchData();
    }, [page]);

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
        },
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
            <table className="min-w-full border">
                <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b">
                        {headerGroup.headers.map((header) => (
                            <th key={header.id} className="px-4 py-2 text-left">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b">
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-4 py-2">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-4 flex items-center gap-2">
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Prev
                </button>
                <span>Page {page} of {pageCount}</span>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default EmployeeTable;
