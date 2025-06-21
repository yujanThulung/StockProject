import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/dashboard/NavBar.jsx";
import Sidebar from "../../components/dashboard/Sidebar.jsx";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-4"> 
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
