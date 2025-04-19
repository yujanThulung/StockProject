import React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/dashboard/NavBar.jsx";
import Sidebar from "../../components/dashboard/Sidebar.jsx";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () =>{
    setIsSidebarOpen(!isSidebarOpen);
  }


    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main content here */}
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex justify-center items-center h-screen">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
