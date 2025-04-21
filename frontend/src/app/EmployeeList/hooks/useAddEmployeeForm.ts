import { useState } from "react";
import { Employee } from "../../../application-record/models/employee.ts";

export const useAddEmployeeForm = (onSuccess: () => void) => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        age: "",
        position: "",
        departmentId: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (onClose: () => void) => {
        setError("");
        if (!form.firstName || !form.lastName || !form.age || !form.position || !form.departmentId) {
            setError("All fields are required.");
            return;
        }

        try {
            const employee = new Employee({
                firstName: form.firstName,
                lastName: form.lastName,
                age: Number(form.age),
                position: form.position,
                departmentId: form.departmentId,
            });

            await employee.save();
            onSuccess();
            onClose();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong.");
            }
        }
    };

    return {
        form,
        error,
        handleChange,
        handleSubmit,
    };
};
