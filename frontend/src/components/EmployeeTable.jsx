import {
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function EmployeeTable() {

  const employees = [

    {
      id:1,
      name:"Soham",
      department:"Engineering",
      role:"Admin",
      status:"Active"
    },

    {
      id:2,
      name:"Rahul",
      department:"HR",
      role:"Employee",
      status:"Active"
    },

    {
      id:3,
      name:"Priya",
      department:"Finance",
      role:"Manager",
      status:"On Leave"
    }

  ];

  return(

<div className="bg-white rounded-3xl shadow-lg p-8">

<div className="flex justify-between items-center mb-8">

<div>

<h2 className="text-3xl font-bold">

Employees

</h2>

<p className="text-gray-500 mt-2">

Manage your organization's employees.

</p>

</div>

<button

className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"

>

+ Add Employee

</button>

</div>

<input

placeholder="Search Employee..."

className="w-full border rounded-xl px-5 py-3 mb-8"

/>

<table className="w-full">

<thead>

<tr className="border-b">

<th className="text-left py-4">

Employee

</th>

<th>

Department

</th>

<th>

Role

</th>

<th>

Status

</th>

<th>

Actions

</th>

</tr>

</thead>

<tbody>

{

employees.map(emp=>(

<tr

key={emp.id}

className="border-b hover:bg-slate-50"

>

<td className="py-5">

<div className="flex items-center gap-4">

<div className="bg-blue-100 rounded-full p-2">

<UserCircleIcon className="w-10 h-10 text-blue-600"/>

</div>

<div>

<p className="font-semibold">

{emp.name}

</p>

</div>

</div>

</td>

<td>{emp.department}</td>

<td>{emp.role}</td>

<td>

<span

className={`px-3 py-1 rounded-full text-sm

${emp.status==="Active"

?"bg-green-100 text-green-700"

:"bg-orange-100 text-orange-700"

}

`}

>

{emp.status}

</span>

</td>

<td>

<div className="flex justify-center gap-4">

<button>

<PencilSquareIcon className="w-6 h-6 text-blue-600"/>

</button>

<button>

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

)

}