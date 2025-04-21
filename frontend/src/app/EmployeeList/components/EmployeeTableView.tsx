import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnDef,
    SortingState,
    OnChangeFn,
} from "@tanstack/react-table";
import {useMemo} from "react";
import {Employee} from "../../../application-record/models/employee.ts";
import {Department} from "../../../application-record/models/department.ts";

type Props = {
    data: EmployeeWithDept[];
    pageCount: number;
    rowCount: number;
    page: number;
    setPage: (page: number) => void;
    sorting: SortingState;
    setSorting: OnChangeFn<SortingState>;
};

type EmployeeWithDept = Employee & { department?: Department };

export function EmployeeTableView(
    {
        data,
        pageCount,
        rowCount,
        page,
        setPage,
        sorting,
        setSorting,
    }: Props) {
    const pageSize = 10;

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
                typeof updater === "function"
                    ? updater({pageIndex: page - 1, pageSize})
                    : updater;
            setPage(newState.pageIndex + 1);
        },
    });

    return (
        <>
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
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-150">
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-4 py-2 text-sm text-gray-800 border-b border-gray-300">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-4 flex items-center gap-2 justify-start">
                <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 shadow-md"
                >
                    First
                </button>

                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 shadow-md"
                >
                    Prev
                </button>

                <span className="text-sm text-gray-600">
                    Page {page} of {Math.ceil(pageCount)}
                </span>

                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 shadow-md"
                >
                    Next
                </button>

                <button
                    onClick={() => setPage(Math.ceil(pageCount))}
                    disabled={page === Math.ceil(pageCount)}
                    className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 shadow-md"
                >
                    Last
                </button>
            </div>

        </>
    );
}
