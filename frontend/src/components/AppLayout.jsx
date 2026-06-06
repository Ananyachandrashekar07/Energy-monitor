import { useState } from 'react';

import { Outlet, useLocation } from 'react-router-dom';

import Sidebar from './Sidebar';

import {
  Menu,
  Bell
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';



const PAGE_TITLES = {

  '/dashboard': 'Dashboard',

  '/buildings': 'Buildings',

  '/rooms': 'Rooms',

  '/devices': 'Devices',

  '/analytics': 'Analytics',

  '/alerts': 'Alerts',

  '/reports': 'Reports',

};



export default function AppLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuth();

  const location = useLocation();



  const pageTitle =
    PAGE_TITLES[location.pathname] ??
    'Energy Monitor';



  return (

    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-100">

      {/* Sidebar */}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />



      {/* Main Area */}

      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">

        {/* Topbar */}

        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm">

          {/* Mobile Menu */}

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-200 text-slate-700 transition-all duration-200"
          >

            <Menu size={18} />

          </button>



          {/* Page Title */}

          <h2 className="font-display text-lg font-semibold text-slate-800 flex-1 ml-3">

            {pageTitle}

          </h2>



          {/* Right Section */}

          <div className="flex items-center gap-3">

            {/* Notification */}

            <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 relative transition-all duration-200">

              <Bell size={18} />

            </button>



            {/* Profile */}

            <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">

              <span className="text-sm font-semibold text-cyan-600">

                {user?.full_name?.charAt(0)?.toUpperCase()}

              </span>

            </div>

          </div>

        </header>



        {/* Page Content */}

        <main className="flex-1 overflow-y-auto p-5 lg:p-6">

          <Outlet />

        </main>

      </div>

    </div>

  );

}