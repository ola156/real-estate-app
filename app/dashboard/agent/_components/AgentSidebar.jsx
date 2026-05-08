"use client";
import React from "react";
import { 
  LayoutDashboard, 
  ListPlus, 
  Home, 
  History, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { name: "Listings", icon: <Home size={18} /> },
  { name: "Add New", icon: <ListPlus size={18} /> },
  { name: "Payments", icon: <History size={18} /> },
];

export default function AgentSidebar({ isCollapsed, setIsCollapsed, activeTab, setActiveTab }) {
  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white transition-all duration-300 z-50 border-r border-white/5 ${isCollapsed ? "w-20" : "w-64"}`}>
      {/* Brand - Sharp & Colored */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
          <span className="text-white font-bold text-sm">I</span>
        </div>
        {!isCollapsed && <span className="ml-3 font-bold text-white tracking-tight text-lg">Instrict</span>}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3 space-y-1.5">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              activeTab === item.name 
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
              : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            {!isCollapsed && <span className="text-sm font-semibold tracking-wide">{item.name}</span>}
          </button>
        ))}
      </nav>

      {/* Logout / Toggle */}
      <div className="absolute bottom-6 w-full px-3 space-y-2">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-3 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-xl"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}