import { useState, useEffect } from "react";
import { Bell, Sun, Moon, ChevronDown, ChevronUp, LogOut, AlertTriangle } from "lucide-react";
import profile from "../../assets/person.jpg";
import { useAuthStore } from "../../../store/authentication.store";
import { useNavigate } from "react-router-dom";
import ProfileDetails from "./ProfileDetails";
import useNotificationStore from "../../../store/notification.store";

const LogoutModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    />
    {/* Dialog */}
    <div className="relative bg-white rounded-xl shadow-xl border border-gray-100 p-6 w-80 mx-4">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Sign out?</p>
          <p className="text-xs text-gray-400 mt-1">You'll need to log in again to access your dashboard.</p>
        </div>
      </div>
      <div className="flex gap-2 mt-5">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-blue-950 hover:bg-blue-900 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  </div>
);

const TopNav = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
      listenForAlerts(user._id); 
    }
  }, [user?._id]);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    navigate("/login");
  };

  const handleBellClick = () => {
    useNotificationStore.setState({ triggeredCount: 0 });
    navigate("/dashboard/alert");
  };

  return (
    <div className="w-full flex items-center justify-end px-6 py-5 bg-blue-950 shadow-sm relative">
      {showLogoutConfirm && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
      <div className="flex items-center gap-6">

        {/* Theme Toggle
        // <div className="flex items-center gap-2">
        //   {darkMode ? (
        //     <Sun
        //       className="text-gray-200 cursor-pointer"
        //       onClick={() => setDarkMode(false)}
        //     />
        //   ) : (
        //     <Moon
        //       className="text-gray-200 cursor-pointer"
        //       onClick={() => setDarkMode(true)}
        //     />
        //   )}
        // </div> */}

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
                onClick={() => { setIsProfileOpen(false); setShowLogoutConfirm(true); }}
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
