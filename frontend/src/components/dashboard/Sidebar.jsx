import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Banknote,
  List,
  Bell,
  Menu,
  Users,
  Sparkles,
} from 'lucide-react';
import logo from '../../assets/logo1.png';
import { useAuthStore } from '../../../store/authentication.store';

const navItems = [
  { icon: <LayoutDashboard size={20} />, text: 'Overview',    path: '/dashboard/overview' },
  { icon: <Sparkles size={20} />,        text: 'AI Insights', path: '/dashboard/ai-insights' },
  { icon: <Banknote size={20} />,        text: 'Financial',   path: '/dashboard/financial' },
  { icon: <List size={20} />,            text: 'Watch List',  path: '/dashboard/watch-list' },
  { icon: <Bell size={20} />,            text: 'Notifications', path: '/dashboard/notifications' },
];

const adminItem = {
  icon: <Users size={20} />,
  text: 'User Management',
  path: '/dashboard/admin',
};

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  const allItems = isAdmin ? [...navItems, adminItem] : navItems;

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'
        } relative h-screen flex flex-col`}
    >
      {/* Header */}
      <div
        className={`flex items-center ${isSidebarOpen ? 'justify-between px-6' : 'justify-center'
          } h-20 border-b border-gray-200 bg-blue-950`}
      >
        {isSidebarOpen && (
          <Link to="/dashboard/overview">
            <img src={logo} alt="logo" className="h-16 w-auto" />
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="space-y-2">
          {allItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 ${isSidebarOpen ? '' : 'justify-center'
                  }`}
                title={!isSidebarOpen ? item.text : ''}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span
                  className={`ml-3 transition-opacity duration-200 ease-in-out ${isSidebarOpen
                      ? 'opacity-100'
                      : 'opacity-0 w-0 h-0 overflow-hidden absolute'
                    }`}
                >
                  {item.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
