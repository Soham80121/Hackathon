import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SidebarProvider } from "./context/SidebarContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Policies from "./pages/Policies";
import Employees from "./pages/Employees";
import AIAssistant from "./pages/AIAssistant";
import Settings from "./pages/Settings";
import LeaveManagement from "./pages/LeaveManagement";
import ChangePassword from "./pages/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Reports from "./pages/Reports";

import { useEffect } from "react";

function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <SidebarProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/change-password" element={<ChangePassword />} />
            
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/policies" element={<Policies />} />
              
              {/* Role Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'hr']} />}>
                <Route path="/employees" element={<Employees />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
                <Route path="/employee/my-leave" element={<LeaveManagement viewType="my" />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['hr']} />}>
                <Route path="/hr/my-leave" element={<LeaveManagement viewType="my" />} />
                <Route path="/hr/leave-approvals" element={<LeaveManagement viewType="approvals" />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/leave-approvals" element={<LeaveManagement viewType="approvals" />} />
                <Route path="/reports" element={<Reports />} />
              </Route>
              
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;
