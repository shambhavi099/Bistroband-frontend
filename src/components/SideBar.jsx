/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Grid, // used for Tables mapping
  CookingPot, 
  Package, 
  Users, 
  TrendingUp,
  Clock,
  ShieldCheck,
 
  Contact,
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react';


export default function Sidebar({ activeTab, setActiveTab, pendingCount, lowStockCount, currentUser, onLogout }) {
  const menuItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: "orders", 
      label: "Orders", 
      icon: ClipboardList,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: "bg-amber-100 text-amber-800"
    },
    { 
      id: "tables", 
      label: "Tables", 
      icon: Grid,
      badge: null
    },
    { 
      id: "menu", 
      label: "Menu Item", 
      icon: CookingPot,
      badge: null
    },
    { 
      id: "inventory", 
      label: "Inventory", 
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: "bg-red-100 text-red-800 animate-pulse"
    },
    { 
      id: "staff", 
      label: "Staff", 
      icon: Users,
      badge: null
    },
    { 
      id: "customers", 
      label: "Customers", 
      icon: Contact,
      badge: null
    },
    { 
      id: "payments", 
      label: "Payments", 
      icon: CreditCard,
      badge: null
    },
    { 
      id: "reports", 
      label: "Reports", 
      icon: TrendingUp,
      badge: null
    },
    { 
      id: "admin", 
      label: "Admin Controls", 
      icon: Settings,
      badge: null
    }
  ].filter(item => {
    if (!currentUser) return true;
    const role = currentUser.role;
    if (role === 'Server') {
      return item.id !== 'reports' && item.id !== 'admin';
    }
    if (role === 'Chef') {
      return item.id !== 'reports' && item.id !== 'admin' && item.id !== 'payments';
    }
    return true;
  });

  return (
    <aside id="sidebar-container" className="w-68 bg-slate-900 border-r border-slate-800 flex flex-col text-slate-300 select-none shrink-0">
      {/* Brand Header */}
      <div id="sidebar-header" className="p-6 border-b border-slate-850 flex items-center space-x-3 bg-slate-950/45">
        <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
          <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-wide leading-none">BISTROBOARD</h1>
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block mt-1">Operational OS</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav id="sidebar-navigation" className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all group ${
                isActive 
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-4 w-4 shrink-0 transition-transform ${
                  isActive ? 'scale-110 stroke-[2.2]' : 'text-slate-500 group-hover:text-slate-300'
                }`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-slate-950 text-amber-400' : item.badgeColor
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Terminal Metadata Bar - No sci-fi, just clean, useful metadata */}
      <div id="sidebar-clock-info" className="p-4 mx-4 mb-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col space-y-2">
        <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
          <Clock className="h-3 w-3 text-amber-500 shrink-0" />
          <span>SERVER TIME: 08:19 UTC</span>
        </div>
        <div className="text-[11px] text-slate-400 font-sans flex items-center space-x-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 animate-ping" />
          <span className="font-mono text-[10px]">MAIN KITCHEN LINK: ONLINE</span>
        </div>
      </div>

      {/* Profile Footer */}
      <div id="sidebar-footer" className="p-4 border-t border-slate-850 flex items-center justify-between bg-slate-950/30 gap-1 overflow-hidden">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 font-bold text-slate-950 text-xs flex items-center justify-center uppercase shadow-inner shrink-0">
            {currentUser ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate leading-none mb-1">
              {currentUser ? currentUser.name : 'Vedanshi'}
            </p>
            <span className="inline-block text-[9px] font-mono leading-none tracking-wider text-slate-400 bg-slate-850 px-1 py-0.5 rounded border border-slate-800">
              {currentUser ? currentUser.role.toUpperCase() : 'STAFF'}
            </span>
          </div>
        </div>
        
        {/* Logout button */}
        <button
          type="button"
          onClick={onLogout}
          title="Sign Out of Terminal"
          className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800/40 rounded-lg transition-all shrink-0 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
