import {
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import EmployeeModal from "./EmployeeModal";
import TempPasswordModal from "./TempPasswordModal";
import toast from "react-hot-toast";
import SearchBar from "./SearchBar";
import api from "../services/api";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempPasswordData, setTempPasswordData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user.role === "admin";
  const isHR = user.role === "hr";

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/api/employees");
      setEmployees(response.data);
    } catch (error) {
      toast.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async () => {
    if (employeeToDelete) {
      try {
        await api.delete(`/api/employees/${employeeToDelete._id}`);
        toast.success("Employee deleted successfully");
        setEmployeeToDelete(null);
        fetchEmployees();
      } catch (error) {
        toast.error("Failed to delete employee");
      }
    }
  };

  const handleSaveEmployee = async (formData) => {
    try {
      if (employeeToEdit) {
        await api.put(`/api/employees/${employeeToEdit._id}`, formData);
        toast.success("Employee updated successfully");
      } else {
        const response = await api.post("/api/employees", formData);
        toast.success("Employee added successfully");
        if (response.data.tempPassword) {
          setTempPasswordData(response.data);
        }
      }
      setIsModalOpen(false);
      setEmployeeToEdit(null);
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save employee");
    }
  };

  const handleEditClick = (emp) => {
    setEmployeeToEdit(emp);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEmployeeToEdit(null);
    setIsModalOpen(true);
  };

  return(

<div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-8">

<div className="flex justify-between items-center mb-8">

<div>

<h2 className="text-3xl font-bold">

Employees

</h2>

<p className="text-gray-500 dark:text-darktext-muted mt-2">

Manage your organization's employees.

</p>

</div>

<button
  onClick={handleAddClick}
  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
>
+ Add Employee
</button>

</div>

<SearchBar 
  placeholder="Search Employee..." 
  className="mb-8" 
  onChange={(e) => setSearchQuery(e.target.value)} 
/>

<div className="overflow-x-auto">
<table className="w-full min-w-[1000px] text-left">
<thead>
<tr className="border-b">
<th className="py-4 px-4 font-semibold text-gray-600 dark:text-darktext-muted whitespace-nowrap">Employee</th>
<th className="py-4 px-4 font-semibold text-gray-600 dark:text-darktext-muted whitespace-nowrap">Email</th>
<th className="py-4 px-4 font-semibold text-gray-600 dark:text-darktext-muted whitespace-nowrap">Role</th>
<th className="py-4 px-4 font-semibold text-gray-600 dark:text-darktext-muted whitespace-nowrap">Designation</th>
<th className="py-4 px-4 font-semibold text-gray-600 dark:text-darktext-muted whitespace-nowrap">Department</th>
<th className="py-4 px-4 font-semibold text-gray-600 dark:text-darktext-muted whitespace-nowrap">Joining Date</th>
<th className="py-4 px-4 font-semibold text-gray-600 dark:text-darktext-muted whitespace-nowrap">Created By</th>
<th className="py-4 px-4 font-semibold text-gray-600 dark:text-darktext-muted whitespace-nowrap text-center">Status</th>
<th className="py-4 px-4 font-semibold text-gray-600 dark:text-darktext-muted whitespace-nowrap text-right">Actions</th>
</tr>
</thead>

<tbody>

{
employees.filter(emp => 
  emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
  emp.designation.toLowerCase().includes(searchQuery.toLowerCase())
).map(emp=>(
<tr

key={emp._id}

className="border-b hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"

>

<td className="py-5 px-4 whitespace-nowrap">
<div className="flex items-center gap-4">
<div className="bg-blue-100 rounded-full p-2 shrink-0">
<UserCircleIcon className="w-10 h-10 text-blue-600"/>
</div>
<div>
<p className="font-semibold text-gray-900 dark:text-darktext-primary truncate max-w-[150px]">{emp.name}</p>
</div>
</div>
</td>
<td className="px-4 text-gray-600 dark:text-darktext-muted truncate max-w-[180px]">{emp.email}</td>
<td className="px-4 capitalize text-gray-600 dark:text-darktext-muted whitespace-nowrap">{emp.role}</td>
<td className="px-4 text-gray-600 dark:text-darktext-muted truncate max-w-[150px]">{emp.designation}</td>
<td className="px-4 text-gray-600 dark:text-darktext-muted truncate max-w-[150px]">{emp.department}</td>
<td className="px-4 text-gray-600 dark:text-darktext-muted whitespace-nowrap">{emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : "-"}</td>
<td className="px-4 text-gray-600 dark:text-darktext-muted whitespace-nowrap">{emp.createdByName || "-"}</td>
<td className="px-4 text-center whitespace-nowrap">
<span
className={`px-3 py-1 rounded-full text-sm font-medium
${emp.status === "Active" ? "bg-green-100 text-green-700" : 
  emp.status === "Pending" ? "bg-yellow-100 text-yellow-700" : 
  "bg-red-100 text-red-700"}
`}
>
{emp.status}
</span>
</td>
<td className="px-4 whitespace-nowrap">
<div className="flex justify-end gap-4">
<button onClick={() => handleEditClick(emp)} className="hover:bg-blue-50 p-1 rounded transition">
<PencilSquareIcon className="w-6 h-6 text-blue-600"/>
</button>
<button onClick={() => setEmployeeToDelete(emp)} className="hover:bg-red-50 p-1 rounded transition">
<TrashIcon className="w-6 h-6 text-red-600"/>
</button>
</div>
</td>

</tr>

))

}

</tbody>

</table>
</div>

<ConfirmModal
  isOpen={!!employeeToDelete}
  title="Delete Employee"
  message={`Are you sure you want to delete ${employeeToDelete?.name}? This action cannot be undone.`}
  onConfirm={handleDelete}
  onCancel={() => setEmployeeToDelete(null)}
  confirmText="Delete"
/>

<EmployeeModal 
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSave={handleSaveEmployee}
  initialData={employeeToEdit}
/>

<TempPasswordModal 
  isOpen={!!tempPasswordData}
  onClose={() => setTempPasswordData(null)}
  userData={tempPasswordData}
/>

</div>

)

}
