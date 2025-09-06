"use client";
import React, { useState, useRef, useEffect } from "react";
import { 
  MdNotifications, 
  MdAccountCircle, 
  MdExpandMore, 
  MdSettings,
  MdDashboard,
  MdSecurity,
  MdBusiness,
  MdRefresh
} from "react-icons/md";
import { SignOut } from "@/component";

interface SuperAdminHeaderProps {
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
}

export const SuperAdminHeader = ({ user }: SuperAdminHeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);
  
  return (
    <header className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Super Admin Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <MdSecurity className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Super Admin Panel
                </h1>
                <p className="text-sm text-red-100">
                  RCS Platform Management
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Actions and User */}
          <div className="flex items-center gap-4">
            {/* Refresh System */}
            <button
              className="relative p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 group"
              title="Refresh System"
            >
              <MdRefresh className="text-xl text-white" />
            </button>

            {/* System Settings */}
            <button
              className="relative p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 group"
              title="System Settings"
            >
              <MdSettings className="text-xl text-white" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="relative p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 group">
                <MdNotifications className="text-xl text-white" />
                {/* Critical Alerts Badge */}
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                  5
                </span>
              </button>
            </div>

            {/* Super Admin User Info */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">
                    {user?.name || "Super Admin"}
                  </p>
                  <p className="text-xs text-red-100 opacity-80">
                    {user?.role || "Platform Administrator"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <MdAccountCircle className="text-2xl text-white" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <MdExpandMore className={`text-white transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Super Admin User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || "Super Admin"}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Super Administrator
                      </span>
                    </div>
                  </div>
                  <div className="px-2 py-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <MdSettings className="text-lg text-gray-400" />
                      Admin Settings
                    </button>
                    <SignOut />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
