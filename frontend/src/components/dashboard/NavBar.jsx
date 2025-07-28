// import React, { useState, useEffect } from "react";
// import { Bell, Sun, Moon, ChevronDown, ChevronUp, LogOut } from "lucide-react";
// import profile from "../../assets/profile.jpg";
// import { useAuthStore } from "../../../store/authentication.store";
// import { useNavigate } from "react-router-dom";
// import ProfileDetails from "./ProfileDetails";
// import useNotificationStore from "../../../store/notification.store";

// const TopNav = () => {
//     const [isProfileOpen, setIsProfileOpen] = useState(false);
//     const [darkMode, setDarkMode] = useState(false);

//     const { triggeredCount, fetchNotifications } = useNotificationStore();
//     const setTriggeredCount = useNotificationStore((state) => state.set); 
//     const { user, logout } = useAuthStore();
//     const navigate = useNavigate();

//     const handleLogout = async () => {
//         await logout();
//         navigate("/login");
//     };

//     // ✅ fetch only triggered alerts initially
//     useEffect(() => {
//         fetchNotifications(true);
//     }, []);

//     // ✅ define this correctly
//     const handleBellClick = () => {
//         useNotificationStore.setState({ triggeredCount: 0 }); // ✅ resets badge
//         navigate("/dashboard/alert");
//     };

//     return (
//         <div className="w-full flex items-center justify-end px-6 py-5 bg-blue-950 shadow-sm relative">
//             <div className="flex items-center gap-6">
//                 {/* Theme Toggle */}
//                 <div className="flex items-center gap-2">
//                     {darkMode ? (
//                         <Sun
//                             className="text-gray-200 cursor-pointer"
//                             onClick={() => setDarkMode(false)}
//                         />
//                     ) : (
//                         <Moon
//                             className="text-gray-200 cursor-pointer"
//                             onClick={() => setDarkMode(true)}
//                         />
//                     )}
//                 </div>

//                 {/* Notification Bell */}
//                 <div className="relative">
//                     <Bell
//                         className="text-gray-200 cursor-pointer"
//                         onClick={handleBellClick}
//                     />
//                     {triggeredCount > 0 && (
//                         <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
//                             {triggeredCount > 99 ? "99+" : triggeredCount}
//                         </span>
//                     )}
//                 </div>

//                 {/* Profile Dropdown */}
//                 <div className="relative">
//                     <div
//                         className="flex items-center gap-2 cursor-pointer"
//                         onClick={() => setIsProfileOpen(!isProfileOpen)}
//                     >
//                         <img
//                             src={profile}
//                             alt="User profile"
//                             className="h-10 w-10 rounded-full object-cover shadow-sm"
//                         />
//                         <div className="text-sm text-white">
//                             <div className="font-medium">{user?.name || "User"}</div>
//                             <div className="text-xs text-gray-200">{user?.role || "Role"}</div>
//                         </div>
//                         {isProfileOpen ? (
//                             <ChevronUp className="text-gray-200" size={16} />
//                         ) : (
//                             <ChevronDown className="text-gray-200" size={16} />
//                         )}
//                     </div>

//                     {isProfileOpen && (
//                         <div className="absolute right-22 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
//                             <ProfileDetails user={user} onClose={() => setIsProfileOpen(false)} />
//                             <button
//                                 onClick={handleLogout}
//                                 className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                             >
//                                 <LogOut className="mr-2" size={16} />
//                                 Sign out
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TopNav;






import React, { useState, useEffect } from "react";
import { Bell, Sun, Moon, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import profile from "../../assets/profile.jpg";
import { useAuthStore } from "../../../store/authentication.store";
import { useNavigate } from "react-router-dom";
import ProfileDetails from "./ProfileDetails";
import useNotificationStore from "../../../store/notification.store";

const TopNav = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const {
    triggeredCount,
    fetchNotifications,
    listenForAlerts,
  } = useNotificationStore();

  // ✅ Initial fetch + Realtime listener
  useEffect(() => {
    if (user?._id) {
      fetchNotifications(true);
      listenForAlerts(user._id); // 🔥 Setup realtime alert listener
    }
  }, [user?._id]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleBellClick = () => {
    useNotificationStore.setState({ triggeredCount: 0 });
    navigate("/dashboard/alert");
  };

  return (
    <div className="w-full flex items-center justify-end px-6 py-5 bg-blue-950 shadow-sm relative">
      <div className="flex items-center gap-6">

        {/* Theme Toggle */}
        <div className="flex items-center gap-2">
          {darkMode ? (
            <Sun
              className="text-gray-200 cursor-pointer"
              onClick={() => setDarkMode(false)}
            />
          ) : (
            <Moon
              className="text-gray-200 cursor-pointer"
              onClick={() => setDarkMode(true)}
            />
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <Bell
            className="text-gray-200 cursor-pointer"
            onClick={handleBellClick}
          />
          {triggeredCount > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              {triggeredCount > 99 ? "99+" : triggeredCount}
            </span>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <img
              src={profile}
              alt="User profile"
              className="h-10 w-10 rounded-full object-cover shadow-sm"
            />
            <div className="text-sm text-white">
              <div className="font-medium">{user?.name || "User"}</div>
              <div className="text-xs text-gray-200">{user?.role || "Role"}</div>
            </div>
            {isProfileOpen ? (
              <ChevronUp className="text-gray-200" size={16} />
            ) : (
              <ChevronDown className="text-gray-200" size={16} />
            )}
          </div>

          {isProfileOpen && (
            <div className="absolute right-22 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
              <ProfileDetails user={user} onClose={() => setIsProfileOpen(false)} />
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-2" size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
