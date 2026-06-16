/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import  { useState } from 'react';
import { 
 
  Users, 
  DollarSign, 

  UserCheck,
  AlertTriangle
} from 'lucide-react';


export default function TablesView({ 
  tables, 
  staffList, 
  onUpdateTableStatus, 
  onClearTable 
}) {
  const [selectedTableId, setSelectedTableId] = useState(tables[0]?.id || null);
  const selectedTable = tables.find(t => t.id === selectedTableId) || tables[0] || null;

  // Floor layout filter
  const [floorArea, setFloorArea] = useState('all');

  const filteredTables = tables.filter(t => {
    const tableNumber = String(t.number ?? t.tableNumber ?? "");
    const tableNumVal = parseInt(
      tableNumber.replace(/\D/g, ""),
      10
    );
    if (floorArea === 'indoor' && tableNumVal > 8) return false;
    if (floorArea === 'deck' && tableNumVal <= 8) return false;
    return true;
  });

  // Table Status helper details
  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-50 text-emerald-800 border-emerald-100 ring-2 ring-emerald-500/10 hover:ring-emerald-500/30';
      case 'reserved':
        return 'bg-pink-50 text-pink-800 border-pink-100 ring-2 ring-pink-500/10 hover:ring-pink-500/30';
      case 'occupied':
        return 'bg-amber-50 text-amber-800 border-amber-100 ring-2 ring-amber-500/20 hover:ring-amber-500/40';
      case 'billing':
        return 'bg-rose-50 text-rose-800 border-rose-100 ring-2 ring-rose-500/20 hover:ring-rose-500/40 animate-pulse';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  // State controls for Seating / Reserving
  const [seatGuestName, setSeatGuestName] = useState('');
  const [seatStaffName, setSeatStaffName] = useState(staffList[0]?.name || 'Jessica Lee');
  const [seatSpend, setSeatSpend] = useState('45');

  const handleSeatGuestsSubmit = (e) => {
    e.preventDefault();
    if (!selectedTableId) return;
    
    // We update to occupied with spend and staff
    onUpdateTableStatus(
      selectedTableId, 
      'occupied', 
      seatStaffName, 
      parseFloat(seatSpend) || 0
    );
    // Reset form fields
    setSeatGuestName('');
  };

  return (
    <div id="tables-parent" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Floorplan Layout Grid representation */}
      <div id="floorplan-layout-grid" className="lg:col-span-2 space-y-6">
        
        {/* Workspace filtering control */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Virtual Room Floorplan</h3>
            <p className="text-xs text-slate-500">Live graphical layout of standard dining salon and garden deck</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {[
              { id: 'all', label: 'All Zones' },
              { id: 'indoor', label: 'Main Salon (T1-T8)' },
              { id: 'deck', label: 'Garden Deck (T9-T12)' }
            ].map(zone => (
              <button
                key={zone.id}
                onClick={() => setFloorArea(zone.id )}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  floorArea === zone.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-505 hover:text-slate-800 text-slate-500'
                }`}
              >
                {zone.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tables visual map container */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
          {filteredTables.map((tbl) => {
            const isSelected = tbl.id === selectedTableId;
            const statusConfig = getStatusBadgeStyles(tbl.status);

            return (
              <div
                key={tbl.id}
                onClick={() => setSelectedTableId(tbl.id)}
                className={`aspect-square p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none relative ${
                  isSelected ? 'scale-[1.02] shadow-md border-indigo-550 ring-2 ring-indigo-500/20' : 'bg-white hover:bg-slate-50'
                } ${statusConfig}`}
              >
                {/* Table ID Row */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-extrabold">{tbl.number}</span>
                  <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-500 font-semibold">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>{tbl.capacity} Pax</span>
                  </div>
                </div>

                {/* Table Shape Center */}
                <div className="my-auto flex flex-col items-center justify-center p-2 text-center">
                  <div className={`h-11 w-11 rounded-full border-2 flex items-center justify-center text-xs font-bold leading-none shadow-sm ${
                    tbl.status === 'available' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                    tbl.status === 'reserved' ? 'bg-pink-50 border-pink-300 text-pink-800' :
                    tbl.status === 'occupied' ? 'bg-amber-100 border-amber-300 text-amber-800' :
                    'bg-rose-100 border-rose-300 text-rose-800'
                  }`}>
                    {tbl.status.substring(0, 3).toUpperCase()}
                  </div>
                  {tbl.assignedStaffName && (
                    <span className="text-[9px] text-slate-500 font-semibold truncate max-w-full block mt-1.5">
                      👤 {tbl.assignedStaffName.split(' ')[0]}
                    </span>
                  )}
                </div>

                {/* Footer values: spend Amount */}
                <div className="flex items-center justify-between text-[11px] font-semibold border-t border-slate-100/50 pt-1.5 mt-1">
                  <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wide">Bills</span>
                  <span className="font-mono text-slate-900 font-bold">
                    {tbl.spendAmount ? `$${tbl.spendAmount}` : '--'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Service Help Box */}
        <div className="bg-slate-50 border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3 text-xs text-slate-650 max-w-xl">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 stroke-[2.5]" />
            <div>
              <p className="font-semibold text-slate-800">Operational Guidelines</p>
              <p className="text-slate-500 mt-1">T9 to T12 are located outdoors on the deck. Change status values to trigger order preparation routing. Cleaned tables should be set back to "Available" status immediately to increase seat turn times.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Editor sidebar controls */}
      <div id="table-details-panel">
        {selectedTable ? (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-5 sticky top-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Interactive Inspector</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Table {selectedTable.number} Overview</h3>
            </div>

            {/* Status overview cards */}
            <div className="p-4 rounded-xl border space-y-3 bg-slate-50/70 border-slate-100">
              <span className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">Active State metrics</span>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Maximum Capacity</span>
                  <span className="font-bold text-slate-800">{selectedTable.capacity} Seats</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Floor Section</span>
                  <span className="font-bold text-slate-800">
                    {Number(selectedTable.tableNumber ?? selectedTable.number) <= 8
                      ? "Indoor Salon"
                      : "Garden Deck"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Current Status</span>
                  <span className="font-bold text-indigo-750 uppercase text-[10px] bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                    {selectedTable.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Operating Cost</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {selectedTable.spendAmount ? `$${selectedTable.spendAmount}` : '$0.00'}
                  </span>
                </div>
              </div>
            </div>

            {/* State Form triggers */}
            <div className="space-y-4 pt-1">
              {selectedTable.status === 'available' ? (
                <form id="seat-table-form" onSubmit={handleSeatGuestsSubmit} className="space-y-3">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assign & Seat Guests</span>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Host Guest Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Richard Hendricks"
                      value={seatGuestName}
                      onChange={(e) => setSeatGuestName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Assign Waiter</label>
                      <select
                        value={seatStaffName}
                        onChange={(e) => setSeatStaffName(e.target.value)}
                        className="w-full p-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                      >
                        {staffList.filter(s => s.role === 'Server').map(stf => (
                          <option key={stf.id} value={stf.name}>{stf.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Opening Bill ($)</label>
                      <input
                        type="number"
                        value={seatSpend}
                        onChange={(e) => setSeatSpend(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs shadow-sm transition-colors"
                  >
                    Confirm Guests Seating
                  </button>
                </form>
              ) : (
                <div className="space-y-3 bg-indigo-50/20 p-4 border rounded-xl border-dashed">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">Operational Status</span>
                  <div className="flex items-center space-x-2.5 text-xs text-slate-750">
                    <UserCheck className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
                    <span>Table currently handled by: <b>{selectedTable.assignedStaffName || 'None Assigned'}</b></span>
                  </div>
                  {selectedTable.spendAmount && (
                    <div className="flex items-center space-x-2.5 text-xs text-slate-750">
                      <DollarSign className="h-4 w-4 text-amber-600 stroke-[2.5]" />
                      <span>Current Cumulative Spending: <b className="font-mono text-amber-700">${selectedTable.spendAmount}</b></span>
                    </div>
                  )}

                  <div className="pt-3 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => onUpdateTableStatus(selectedTable.id, 'billing')}
                      className="flex-1 py-1.5 border border-rose-200 text-rose-700 font-bold bg-white hover:bg-rose-50 text-[11px] rounded uppercase"
                    >
                      Ask for Bill (Checkout)
                    </button>
                    <button
                      type="button"
                      onClick={() => onClearTable(selectedTable.id)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded uppercase"
                    >
                      Clear & Free Table
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex flex-col space-y-1.5">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Set State Manually</span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => onUpdateTableStatus(selectedTable.id, 'available')}
                    className="py-1 border border-slate-200 hover:bg-slate-50 rounded text-center text-slate-700"
                  >
                    Set Available
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateTableStatus(selectedTable.id, 'reserved', 'Host Tom', 0)}
                    className="py-1 border border-slate-200 hover:bg-slate-50 rounded text-center text-slate-700"
                  >
                    Set Reserved
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400">
            Select standard salon tables on the map to oversee orders status.
          </div>
        )}
      </div>

    </div>
  );
}
