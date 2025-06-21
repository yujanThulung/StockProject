import { Link, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    LineChart,
    TrendingUp,
    HistoryIcon,
    List,
    Bell,
    Menu,
    LogOut, 
} from "lucide-react";
import logo from "../../assets/logo1.png";

import { useAuthStore } from "../../../store/authentication.store";

// Define items outside the component
const sidebarNavItems = [
    { icon: <LayoutDashboard size={20} />, text: "Overview", path: "/dashboard/overview" },
    { icon: <LineChart size={20} />, text: "Stock Prediction", path: "/dashboard/stock-prediction" },
    { icon: <TrendingUp size={20} />, text: "Analytics", path: "/dashboard/analytics" },
    { icon: <HistoryIcon size={20} />, text: "History", path: "/dashboard/history" },
    { icon: <List size={20} />, text: "Watch List", path: "/dashboard/watch-list" },
    { icon: <Bell size={20} />, text: "Notifications", path: "/dashboard/notifications" },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {

    const navigate = useNavigate();
    const logout = useAuthStore((state)=> state.logout);


    const handleLogout = async()=>{
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
    return (
        <div
            className={`bg-white  shadow-lg transition-all duration-300 ease-in-out ${
                isSidebarOpen ? "w-64" : "w-20"
            } relative h-screen flex flex-col`}
        >
            {/* Header */}
            <div
                className={`flex items-center ${
                    isSidebarOpen ? "justify-between px-6" : "justify-center"
                } h-20 border-b border-gray-200 bg-blue-950`}
            >
                {isSidebarOpen && (
                    <Link to="/">
                        <img src={logo} alt="logo" className="h-16 w-auto" />
                    </Link>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2 overflow-y-auto">
                <ul className="space-y-2">
                    {sidebarNavItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                to={item.path}
                                className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 group ${
                                    isSidebarOpen ? "" : "justify-center"
                                }`}
                                title={!isSidebarOpen ? item.text : ""}
                            >
                                <div className="flex-shrink-0">{item.icon}</div>
                                <span
                                    className={`ml-3 transition-opacity duration-200 ease-in-out ${
                                        isSidebarOpen
                                            ? "opacity-100"
                                            : "opacity-0 w-0 h-0 overflow-hidden absolute"
                                    }`}
                                >
                                    {item.text}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout section */}
            <div className="mt-auto border-t border-gray-200 p-4">
                <button
                    onClick={handleLogout}
                    className={`flex items-center w-full text-gray-700 hover:text-gray-800 ${
                        isSidebarOpen ? "" : "justify-center"
                    }`}
                    title={!isSidebarOpen ? "Logout" : ""}
                >
                    <LogOut size={20} />
                    <span
                        className={`ml-3 transition-opacity duration-200 ease-in-out ${
                            isSidebarOpen
                                ? "opacity-100"
                                : "opacity-0 w-0 h-0 overflow-hidden absolute"
                        }`}
                    >
                        Logout
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
