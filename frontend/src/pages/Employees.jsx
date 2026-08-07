import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import EmployeeTable from "../components/EmployeeTable";

export default function Employees(){

return(

<div className="flex h-screen bg-slate-100">

<Sidebar/>

<div className="flex-1 overflow-y-auto">

<DashboardNavbar/>

<main className="p-8">

<EmployeeTable/>

</main>

</div>

</div>

)

}