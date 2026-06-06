import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import {
  LayoutDashboard,
  Building2,
  DoorOpen,
  Cpu,
  LineChart,
  Bell,
  FileBarChart2,
  LogOut,
  Zap,
  User,
} from 'lucide-react';


const navItems = [

  {
    to: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard'
  },

  {
    to: '/buildings',
    icon: Building2,
    label: 'Buildings'
  },

  {
    to: '/rooms',
    icon: DoorOpen,
    label: 'Rooms'
  },

  {
    to: '/devices',
    icon: Cpu,
    label: 'Devices'
  },

  {
    to: '/analytics',
    icon: LineChart,
    label: 'Analytics'
  },

  {
    to: '/alerts',
    icon: Bell,
    label: 'Alerts'
  },

  {
    to: '/reports',
    icon: FileBarChart2,
    label: 'Reports'
  },

];


export default function Sidebar({
  open,
  onClose
}) {

  const { user, logout } = useAuth();

  const navigate = useNavigate();


  const handleLogout = () => {

    logout();

    navigate('/login');

  };


  return (

    <>

      {/* Mobile Backdrop */}

      {open && (

        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={onClose}
        />

      )}


      <aside
        className={`
          fixed top-0 left-0 h-full w-64
          bg-white border-r border-slate-200
          z-30 flex flex-col
          shadow-sm
          transition-transform duration-300 ease-in-out
          ${open
            ? 'translate-x-0'
            : '-translate-x-full'
          }
          lg:translate-x-0
        `}
      >

        {/* Logo */}

        <div className="px-6 py-5 border-b border-slate-200">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">

              <Zap
                size={18}
                className="text-blue-600"
              />

            </div>

            <div>

              <p className="text-lg font-bold text-slate-900 leading-none">

               Energy Monitor

              </p>

              <p className="text-xs text-slate-500 mt-1">

                Smart Energy Monitoring

              </p>

            </div>

          </div>

        </div>


        {/* Navigation */}

        <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-1">

          {navItems.map(({
            to,
            icon: Icon,
            label
          }) => (

            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `

                flex items-center gap-3
                px-4 py-3
                rounded-xl
                text-sm font-medium
                transition-all duration-150

                ${isActive

                  ? `
                    bg-blue-100
                    text-blue-700
                    shadow-sm
                  `

                  : `
                    text-slate-600
                    hover:bg-slate-100
                    hover:text-slate-900
                  `
                }

              `}
            >

              {({ isActive }) => (

                <>

                  <Icon
                    size={18}
                    className={
                      isActive
                        ? 'text-blue-600'
                        : ''
                    }
                  />

                  {label}

                </>

              )}

            </NavLink>

          ))}

        </nav>


        {/* User Footer */}

        <div className="px-3 py-4 border-t border-slate-200">

          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50">

            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">

              <User
                size={16}
                className="text-blue-600"
              />

            </div>

            <div className="flex-1 min-w-0">

              <p className="text-sm font-semibold text-slate-900 truncate">

                {user?.full_name || 'Admin User'}

              </p>

              <p className="text-xs text-slate-500 capitalize">

                {user?.role || 'Administrator'}

              </p>

            </div>

          </div>


          <button
            onClick={handleLogout}
            className="
              w-full mt-3
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-sm font-medium
              text-slate-600
              hover:bg-red-50
              hover:text-red-600
              transition-all duration-150
            "
          >

            <LogOut size={17} />

            Sign Out

          </button>

        </div>

      </aside>

    </>

  );

}