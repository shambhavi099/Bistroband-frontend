/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import  { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Grid, 
  Clock, 

  ArrowUpRight, 
  ChefHat, 
  Utensils, 
  Pizza,
  Wine,
  CupSoda
} from 'lucide-react';



export default function DashboardView({
  orders,
  tables,
  currentUser,
  salesTrend,
  categoryBreakdown,
  onNavigate,
  onUpdateOrderStatus
}) {
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

// Compute stats on current states
const totalRevenue = orders
  .filter(o => o.status !== "cancelled")
  .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);


  const totalOrdersCount = orders.length;
  
  const activeTablesCount = tables.filter(t => t.status === 'occupied' || t.status === 'billing').length;
  
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;

  const averageBasketValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount).toFixed(2) : "0.00";

  // Filter 4 most recent orders
  const recentOrders = [...orders]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 4);

  // SVG Chart Dimensions
  const chartHeight = 200;
  const chartWidth = 560;
  const padding = 30;
  
  // Find max value in salesTrend for scaling
  const maxRevenue = Math.max(...salesTrend.map(d => d.revenue), 1000);

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Top Banner Alert / Greeting */}
      <div id="dashboard-hero-banner" className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl shadow-slate-950/10 flex flex-col md:flex-row items-start md:items-center justify-between border border-slate-800">
        <div className="space-y-1">
          <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase font-mono">BistroBoard Control Panel</span>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome Back, {currentUser?.name || "Manager"}
          </h2>
           <p className="text-indigo-200 text-sm max-w-lg">
              Currently managing {activeTablesCount} active tables.
              {pendingOrdersCount} orders are awaiting preparation or service.
              Total orders today: {orders.length}.
            </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3 shrink-0">
          <button 
            id="quick-tables-btn"
            onClick={() => onNavigate('tables')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700"
          >
            Monitor Tables ({activeTablesCount})
          </button>
          <button 
            id="quick-orders-btn"
            onClick={() => onNavigate('orders')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            Dine-In Tickets ({pendingOrdersCount})
          </button>
        </div>
      </div>

      {/* Grid of Key Numerical Core Metrics */}
      <div id="metric-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Revenue */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Today's Revenue</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-100 transition-colors">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 font-mono">${totalRevenue.toLocaleString()}</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5] mr-1" />
              <span>+18.4% from last week</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-rose-500 opacity-20 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Total Orders</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 font-mono">{totalOrdersCount}</h3>
            <p className="text-xs text-indigo-600 font-medium flex items-center mt-1">
              <span>Avg Basket Value: </span>
              <span className="font-semibold font-mono ml-1">${averageBasketValue}</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Card 3: Active Tables */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Active Tables</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition-colors">
              <Grid className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 font-mono">{activeTablesCount} / {tables.length}</h3>
            <p className="text-xs text-rose-500 font-medium flex items-center mt-1">
              <span>Occupancy rate: </span>
              <span className="font-semibold ml-1">{Math.round((activeTablesCount / tables.length) * 100)}%</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500 opacity-20 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Card 4: Pending / Preparing */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Kitchen Load</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg group-hover:bg-teal-100 transition-colors">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 font-mono">{pendingOrdersCount} Tickets</h3>
            <p className="text-xs text-teal-600 font-medium flex items-center mt-1">
              <span>Avg prep delay: </span>
              <span className="font-semibold ml-1">14.5 mins</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-500 opacity-20 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Main Charts area */}
      <div id="dashboard-charts-layout" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Bar Chart (Custom High Quality SVG) */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Weekly Revenue Breakdown</h4>
              <p className="text-xs text-slate-500">Track current daily performance compared to last 6 business cycles</p>
            </div>
            <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">Auto-Updating</span>
            </div>
          </div>

          {/* Interactive Custom SVG Chart */}
          <div className="relative h-60 w-full flex items-end justify-center select-none pt-4">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const yVal = padding + (chartHeight - padding * 2) * (1 - ratio);
                return (
                  <g key={index}>
                    <line 
                      x1={padding} 
                      y1={yVal} 
                      x2={chartWidth - padding} 
                      y2={yVal} 
                      stroke="#f1f5f9" 
                      strokeWidth="1.5" 
                    />
                    <text 
                      x={padding - 5} 
                      y={yVal + 3} 
                      fontSize="9" 
                      fill="#94a3b8" 
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      ${Math.round(maxRevenue * ratio)}
                    </text>
                  </g>
                );
              })}

              {/* Chart Bars */}
              {salesTrend.map((data, index) => {
                const barSpacing = (chartWidth - padding * 2) / salesTrend.length;
                const barWidth = 32;
                const xVal = padding + index * barSpacing + (barSpacing - barWidth) / 2;
                
                // Scale height
                const barVal = (data.revenue / maxRevenue) * (chartHeight - padding * 2);
                const yVal = chartHeight - padding - barVal;

                const isHovered = hoveredBarIndex === index;
                const isToday = index === salesTrend.length - 1;

                return (
                  <g key={index} className="cursor-pointer">
                    {/* Hover Trigger background */}
                    <rect
                      x={padding + index * barSpacing}
                      y={padding}
                      width={barSpacing}
                      height={chartHeight - padding * 2}
                      fill="transparent"
                      onMouseEnter={() => setHoveredBarIndex(index)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    />

                    {/* Gradient definition for bars */}
                    <defs>
                      <linearGradient id={`barGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isToday ? "#f59e0b" : "#4f46e5"} stopOpacity={isHovered ? 1 : 0.85} />
                        <stop offset="100%" stopColor={isToday ? "#d97706" : "#6366f1"} stopOpacity={0.4} />
                      </linearGradient>
                    </defs>

                    {/* Styled rounded bar */}
                    <rect
                      x={xVal}
                      y={yVal}
                      width={barWidth}
                      height={Math.max(barVal, 4)}
                      rx="6"
                      fill={`url(#barGrad-${index})`}
                      stroke={isHovered ? (isToday ? "#d97706" : "#4338ca") : "none"}
                      strokeWidth="1.5"
                      className="transition-all duration-300"
                    />

                    {/* Selected state overlay details */}
                    {isHovered && (
                      <g>
                        <rect
                          x={xVal - 18}
                          y={yVal - 32}
                          width={68}
                          height={24}
                          rx="4"
                          fill="#0f172a"
                          shadow="lg"
                        />
                        <text
                          x={xVal + 16}
                          y={yVal - 17}
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          ${data.revenue}
                        </text>
                        {/* Little indicator tooltip pointer */}
                        <polygon
                          points={`${xVal + 12},${yVal - 8} ${xVal + 20},${yVal - 8} ${xVal + 16},${yVal - 4}`}
                          fill="#0f172a"
                        />
                      </g>
                    )}

                    {/* X Axis Labels */}
                    <text
                      x={xVal + barWidth / 2}
                      y={chartHeight - 12}
                      fontSize="9"
                      fill={isHovered ? "#0f172a" : (isToday ? "#d97706" : "#64748b")}
                      fontWeight={isToday || isHovered ? "bold" : "normal"}
                      textAnchor="middle"
                    >
                      {data.day.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 mt-2 pt-2 border-t border-slate-50 font-medium">
            <span>Graph shows daily sales volume.</span>
            <span>Hover bars for actual numbers.</span>
          </div>
        </div>

        {/* Category Share & Key Indicators */}
        <div id="category-distribution-box" className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="mb-5">
            <h4 className="text-sm font-bold text-slate-900 font-sans">Revenue by Category</h4>
            <p className="text-xs text-slate-500">Distribution across food/beverage groups</p>
          </div>

          {/* Visual Category Blocks */}
          <div className="space-y-4">
            {categoryBreakdown.map((item, idx) => {
              // Custom category badges
              let CategoryIcon = Pizza;
              if (item.category === 'Appetizers') CategoryIcon = ChefHat;
              if (item.category === 'Beverages') CategoryIcon = Wine;
              if (item.category === 'Desserts') CategoryIcon = CupSoda;
              if (item.category === 'Sides') CategoryIcon = Utensils;

              const blockBadgeColors = 
                item.category === 'Mains' ? 'bg-amber-100 text-amber-700' :
                item.category === 'Appetizers' ? 'bg-emerald-100 text-emerald-700' :
                item.category === 'Beverages' ? 'bg-blue-100 text-blue-700' :
                item.category === 'Desserts' ? 'bg-purple-100 text-purple-700' :
                'bg-pink-100 text-pink-700';

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center space-x-2">
                      <span className={`p-1 rounded ${blockBadgeColors}`}>
                        <CategoryIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-slate-700">{item.category}</span>
                    </div>
                    <span className="text-slate-900 font-mono">{item.percentage}%</span>
                  </div>
                  {/* Gauge Bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.category === 'Mains' ? 'bg-amber-500' :
                        item.category === 'Appetizers' ? 'bg-emerald-550' :
                        item.category === 'Beverages' ? 'bg-blue-500' :
                        item.category === 'Desserts' ? 'bg-purple-500' :
                        'bg-pink-500'
                      }`} 
                      style={{ width: `${item.percentage}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Core Service Quality Gauge */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <span className="block text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-0.5">Kitchen Score</span>
              <span className="text-lg font-extrabold text-indigo-950 font-mono">98.2%</span>
            </div>
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
              <span className="block text-[10px] text-amber-700 font-bold uppercase tracking-wider mb-0.5">Rating Avg</span>
              <span className="text-lg font-extrabold text-amber-950 font-mono">4.82 ★</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders List with quick status updater */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-slate-500">Pending Orders</p>
          <h3 className="text-xl font-bold">{pendingOrdersCount}</h3>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-slate-500">Occupied Tables</p>
          <h3 className="text-xl font-bold">{activeTablesCount}</h3>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-slate-500">Available Tables</p>
          <h3 className="text-xl font-bold">
            {tables.length - activeTablesCount}
          </h3>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-slate-500">Revenue</p>
          <h3 className="text-xl font-bold">
            ₹{totalRevenue.toLocaleString()}
          </h3>
        </div>
      </div>

      <div id="recent-orders-feed" className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <div id="recent-orders-header" className="flex items-center justify-between mb-5">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Live Active Orders Monitor</h4>
            <p className="text-xs text-slate-500">Real-time status of dine-in, takeaway, and digital deliveries</p>
          </div>
          <button 
            id="view-all-orders-lnk"
            onClick={() => onNavigate('orders')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center space-x-1"
          >
            <span>View Ticket Board</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto relative">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold">
                <th className="py-3 px-4 rounded-l-lg">ID</th>
                <th className="py-3 px-4">Customer/Table</th>
                <th className="py-3 px-4">Basket Overview</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right rounded-r-lg">Live Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => {
                // Determine order status labels
                const orderLabelStyles = 
                  order.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                  order.status === 'preparing' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                  order.status === 'ready' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                  order.status === 'served' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 animate-pulse' :
                  'bg-slate-50 text-slate-500 border border-slate-100';

                // Determine Order Type Labels
                const deliveryBadgeColors = 
                  order.type === 'dine-in' ? 'bg-blue-50 text-blue-800' :
                  order.type === 'takeaway' ? 'bg-purple-50 text-purple-800' :
                  'bg-orange-50 text-orange-850';

                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{order.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{order.customerName}</div>
                      <div className="mt-0.5 flex items-center space-x-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${deliveryBadgeColors}`}>
                          {order.type}
                        </span>
                        {order.tableNumber && (
                          <span className="text-[10px] text-slate-500 font-semibold">Table {order.tableNumber}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {order.items?.map(item =>
                          `${item.itemName} (${item.quantity}x)`
                        ).join(', ') || "No Items"
                      }
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">${order.totalAmount}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">{order.timestamp}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${orderLabelStyles}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded text-[10px] uppercase shadow-sm transition-colors"
                        >
                          Prepare Cook
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                          className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded text-[10px] uppercase shadow-sm transition-colors"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'served')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] uppercase shadow-sm transition-colors"
                        >
                          Deliver / Serve
                        </button>
                      )}
                      {order.status === 'served' && (
                        <span className="text-[10px] text-slate-400 font-semibold italic">Completing bill</span>
                      )}
                      {order.status === 'cancelled' && (
                        <span className="text-[10px] text-red-500 font-semibold">Void Ticket</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
