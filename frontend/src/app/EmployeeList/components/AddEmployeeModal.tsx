import {useAddEmployeeForm} from "../hooks/useAddEmployeeForm";
import {Department} from "../../../application-record/models/department.ts";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onEmployeeAdded: () => void;
    departments: Department[];
};

export const AddEmployeeModal = ({isOpen, onClose, departments, onEmployeeAdded}: Props) => {
    const {form, error, handleChange, handleSubmit} = useAddEmployeeForm(onEmployeeAdded);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg relative">
                <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
                <div className="space-y-3">
                    <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange}
                            autoComplete="off" className="w-full border p-2 rounded"/>
                    <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange}
                            autoComplete="off" className="w-full border p-2 rounded"/>
                    <input name="age" placeholder="Age" type="number" value={form.age} onChange={handleChange}
                            autoComplete="off" className="w-full border p-2 rounded"/>
                    <input name="position" placeholder="Position" value={form.position} onChange={handleChange}
                            autoComplete="off" className="w-full border p-2 rounded"/>
                    <select name="departmentId" value={form.departmentId} onChange={handleChange}
                            autoComplete="off" className="w-full border p-2 rounded">
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                    {error && <div className="text-red-800 text-sm">{error}</div>}
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={onClose} className="px-3 py-1 border rounded hover:bg-gray-100">Cancel</button>
                        <button onClick={() => handleSubmit(onClose)}
                                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
