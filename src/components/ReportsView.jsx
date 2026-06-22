/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  FileSpreadsheet,
  Flame,
  Award,
} from "lucide-react";

  export default function ReportsView({
    orders,
    menuItems,
    reportSummary,
    popularSellers,
  }) {

  const [reportRange, setReportRange] = useState("today");

  const totalRevenue = reportSummary?.totalRevenue || 0;

  const count = reportSummary?.count || 0;

  const averageTicketValue =
    reportSummary?.averageTicketValue || 0;

  const mockExportCSV = () => {
    alert(
      "Compiling transaction ledgers...\n\nCSV File 'BistroBoard_Ledger_2026-06-02.csv' successfully downloaded to cloud workspace."
    );
  };


  return (
    <div id="reports-view-parent" className="space-y-6">
      
      {/* Upper options filter header */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-sans">Business Intelligence Hub</h3>
          <p className="text-xs text-slate-505 text-slate-500 mt-0.5">Filter dining metrics, peak hours, and check food cost percentages</p>
        </div>

        <div className="flex items-center space-x-3 text-xs shrink-0">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {[
              { id: 'today', label: 'Today (Live)' },
              { id: 'weekly', label: '7-Day Loop' },
              { id: 'monthly', label: '30-Day Cycle' }
            ].map(range => (
              <button
                key={range.id}
                onClick={() => setReportRange(range.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  reportRange === range.id
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <button
            onClick={mockExportCSV}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Generate Ledger</span>
          </button>
        </div>
      </div>

      {/* Grid of financial metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gross Sales Receipt</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">${totalRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-slate-450 text-emerald-600 font-sans mt-1 block">Live cumulative amount</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-905 text-slate-900 mt-2">{count}</p>
          <span className="text-[11px] text-indigo-600 font-sans mt-1 block">Excluding void/cancelled tickets</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ticket Size Average</span>
            <TrendingUp className="h-4 w-4 text-pink-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">${averageTicketValue}</p>
          <span className="text-[11px] text-pink-600 font-sans mt-1 block">Basket index metrics</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kitchen Cook Time</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">14.2 Mins</p>
          <span className="text-[11px] text-amber-600 font-sans mt-1 block">Ideal target &lt; 18 mins</span>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Popular sellers board layout */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 col-span-2">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Top Culinary Performers</h4>
              <p className="text-xs text-slate-500">Most ordered items based on actual tickets</p>
            </div>
            <Award className="h-5 w-5 text-indigo-600" />
          </div>

          <div className="space-y-3.5">
            {popularSellers.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Publish active tickets to register food performance numbers.</p>
            ) : (
              popularSellers.map((item, index) => {
                const ranks = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

                return (
                  <div key={item.name} className="flex items-center justify-between text-xs py-1.5 hover:bg-slate-50/50 rounded-lg px-2 transition-colors">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <span className="text-sm font-mono shrink-0">{ranks[index] || '⭐️'}</span>
                      <div className="overflow-hidden">
                        <span className="font-semibold text-slate-900 block truncate">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{item.category}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-right shrink-0">
                      <div>
                        <span className="text-[10px] text-slate-450 block font-medium">Qty Sold</span>
                        <span className="font-bold font-mono text-slate-805">{item.quantitySold}x</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-455 block font-medium">Revenues</span>
                        <span className="font-bold font-mono text-indigo-700">${item.revenue}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Operating efficiencies widget column */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Operating Efficiencies</h4>
            <p className="text-xs text-slate-500">Resource health gauges</p>
          </div>

          <div className="space-y-4 pt-1">
            {/* Efficiency metric 1 */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-655 text-slate-600 font-semibold">Table Turnaround Rate</span>
                <span className="font-bold text-slate-900">1.8 hr / table</span>
              </div>
              <div className="h-1.5 w-full bg-slate-150 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Efficiency metric 2 */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-655 text-slate-600 font-semibold">Food Waste/Spoil Factor</span>
                <span className="font-bold text-slate-900">2.1% total cost</span>
              </div>
              <div className="h-1.5 w-full bg-slate-150 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            {/* Efficiency metric 3 */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-655 text-slate-600 font-semibold">Shift Sched. Cost Share</span>
                <span className="font-bold text-slate-900">28.4% gross sales</span>
              </div>
              <div className="h-1.5 w-full bg-slate-150 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full" style={{ width: '74%' }} />
              </div>
            </div>
          </div>

          {/* Quick promotion simulation block */}
          <div className="mt-4 p-4 border border-indigo-100 rounded-xl bg-indigo-50/40 text-xs flex flex-col gap-2">
            <span className="font-bold text-indigo-900 flex items-center space-x-1.5 uppercase tracking-widest text-[9px]">
              <Flame className="h-3.5 w-3.5 text-indigo-600" />
              <span>Simulate Promo Event</span>
            </span>
            <p className="text-slate-600 mt-0.5">Activate a mock Happy Hour discount to see potential client flow boost during evenings.</p>
            <button
              onClick={() => alert("Simulation Configured: BistroBoard has applied a -15% mock discount code to all draft Dine-In bills between 4 PM - 7 PM.")}
              className="mt-1 py-1.5 bg-indigo-650 hover:bg-indigo-700 bg-indigo-600 text-white font-bold rounded text-[10px] uppercase shadow-sm"
            >
              Simulate 15% Off Hour
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
