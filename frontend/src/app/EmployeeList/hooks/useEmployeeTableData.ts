import {useEffect, useState} from "react";
import {Department} from "../../../application-record/models/department.ts";
import {Employee} from "../../../application-record/models/employee.ts";
import {SortingState} from "@tanstack/react-table";

type EmployeeWithDept = Employee & { department?: Department };

export const useEmployeeTableData = (page: number, sorting: SortingState, searchQuery: string, departmentFilter: string) => {
    const [data, setData] = useState<EmployeeWithDept[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [rowCount, setRowCount] = useState(0);
    const [departments, setDepartments] = useState<Department[]>([]);
    const pageSize = 10;

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await Department.all();
                setDepartments(response.data || []);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sortQuery =
                    sorting.reduce<Record<string, 'asc' | 'desc'>>((acc, {id, desc}) => {
                    acc[id] = desc ? 'desc' : 'asc';
                    return acc;
                }, {});

                let query = Employee.includes("department")
                    .page(page)
                    .per(pageSize)
                    .order(sortQuery)
                    .stats({total: "count"});

                if (searchQuery) {
                    query = query.where({first_or_last_name: `${searchQuery}`});
                }

                if (departmentFilter) {
                    query = query.where({department_id: departmentFilter});
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
    }, [page, sorting, searchQuery, departmentFilter]);

    return {data, pageCount, rowCount, departments};
};
