import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Briefcase,
  User,
  LogOut,
  Award,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";
import { useUser } from "../../context/UserContext";

const Sidebar: React.FC = () => {
  const { user, logout } = useUser();

  return (
    <div className="fixed top-0 left-0 flex flex-col w-64 h-screen text-white shadow-lg bg-slate-900">
      <div className="flex items-center p-4 space-x-2 border-b border-slate-700">
        <img
          src={"/BountyChain-logo.svg"}
          alt="BountyChain"
          className="w-8 h-8"
        />
        <span className="text-xl font-bold tracking-tight">BountyChain</span>
      </div>

      <div className="p-4 border-b border-slate-700">
        {user ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-2 overflow-hidden rounded-full">
              <img
                src={
                  user.avatarUrl ||
                  "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                }
                alt={user.name}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="w-full mt-1 text-xs text-center truncate text-slate-400">
              {user.walletAddress.substring(0, 6)}...
              {user.walletAddress.substring(user.walletAddress.length - 4)}
            </p>
            <div className="flex items-center mt-2">
              <Award className="w-4 h-4 mr-1 text-yellow-400" />
              <span className="text-sm">{user.reputation.toFixed(1)}</span>
            </div>
          </div>
        ) : (
          <button className="flex items-center justify-center w-full px-4 py-2 transition-colors bg-blue-600 rounded hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            <span>Connect Wallet</span>
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="px-2 space-y-1">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Home className="w-5 h-5 mr-3" />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bounties"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Briefcase className="w-5 h-5 mr-3" />
              <span>Bounties</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <User className="w-5 h-5 mr-3" />
              <span>Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {user && (
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => logout()}
            className="flex items-center justify-center w-full px-4 py-2 transition-colors rounded text-slate-300 hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Disconnect</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
