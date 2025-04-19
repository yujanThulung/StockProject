import React from "react";
import { Bell, Sun, Moon } from "lucide-react";
import logo from "../../assets/logo1.png";
import profile from "../../assets/profile.jpg";

const TopNav = () => {
    return (
        <div className="w-full flex items-center justify-end px-6 py-5 bg-blue-950 shadow-sm">
            {/* Right Section - Icons and Profile */}
            <div className="flex items-center  gap-6 relative">
                {/* Theme Toggle */}
                <div className="flex items-center gap-2">
                    <Moon className="text-gray-200 cursor-pointer" />
                    <Sun className="text-gray-200 cursor-pointer" />
                </div>

                {/* Notification */}
                <Bell className="text-gray-200 cursor-pointer" />
                <span className="absolute top-0 right-32 w-4 h-4  text-white ">2</span>

                {/* Profile */}
                <div className="flex items-center gap-2">
                    <img
                        src={profile}
                        alt="User profile"
                        className="h-10 w-10 rounded-full object-cover  shadow-sm"
                    />
                
                    <div className="text-sm text-white">
                        <div className="font-medium">Nuro stock</div>
                        <div className="text-xs text-gray-200">User</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopNav;
