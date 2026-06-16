/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import  { useState } from 'react';
import { 
 
  Search, 
  Users, 
  Star, 
  Phone, 
  Clock, 
  UserPlus, 
 
  Power
} from 'lucide-react';




export default function StaffView({ 
  staffList, 
  onAddStaff, 
  onUpdateStaffStatus, 
  onFireStaff 
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states to add team member
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Server');
  const [newPhone, setNewPhone] = useState('555-0900');
  const [newShift, setNewShift] = useState('Morning (8 AM - 4 PM)');

  // Filter staff members
  const filteredStaff = staffList.filter((stf) => {
    if (activeTab !== 'all' && stf.status !== activeTab) return false;
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const inName = stf.name.toLowerCase().includes(q);
      const inRole = stf.role.toLowerCase().includes(q);
      return inName || inRole;
    }
    return true;
  });

  const getStatusIndicator = (status) => {
    switch (status) {
      case 'active':
      case 'on-duty':
        return 'bg-emerald-500';
      case 'on-break':
        return 'bg-amber-500';
      case 'off-duty':
        return 'bg-slate-350 bg-slate-300';
      default:
        return 'bg-slate-300';
    }
  };

  const handleAddNewStaffMember = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Allocate random avatar color
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
    const randColor = colors[Math.floor(Math.random() * colors.length)];

    const teammate = {
      id: `STF-${Math.floor(10 + Math.random() * 89)}`,
      name: newName,
      role: newRole,
      status: 'on-duty',
      shift: newShift,
      avatarColor: randColor,
      performanceScore: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
      phone: newPhone
    };

    onAddStaff(teammate);

    setNewName('');
    setNewPhone('555-0900');
    setShowAddForm(false);
  };

  return (
    <div id="staff-view-parent" className="space-y-6">
      
      {/* Top summary statistic overview row */}
      <div id="staff-summary-cards" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border p-5 rounded-2xl flex items-center space-x-4 border-slate-100 shadow-sm">
          <div className="p-3 bg-indigo-50 text-indigo-650 rounded-xl">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <span className="block text-xs uppercase text-slate-400 font-bold">Total Staff Recs</span>
            <span className="text-xl font-bold font-mono text-slate-900">{staffList.length} Teammates</span>
          </div>
        </div>
        
        <div className="bg-white border p-5 rounded-2xl flex items-center space-x-4 border-slate-100 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-650 rounded-xl">
            <Clock className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <span className="block text-xs uppercase text-slate-400 font-bold">On Active Duty</span>
            <span className="text-xl font-bold font-mono text-slate-900">
              {staffList.filter(s => s.status === 'active' || s.status === 'on-duty').length} Active
            </span>
          </div>
        </div>

        <div className="bg-white border p-5 rounded-2xl flex items-center space-x-4 border-slate-100 shadow-sm">
          <div className="p-3 bg-amber-50 text-amber-650 rounded-xl">
            <Star className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <span className="block text-xs uppercase text-slate-400 font-bold">Lounge Score Average</span>
            <span className="text-xl font-bold font-mono text-slate-900">4.72 / 5.0 Rating</span>
          </div>
        </div>
      </div>

      {/* Staff directory filtering tools */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'all', label: 'All Teammates' },
            { id: 'on-duty', label: 'On Service' },
            { id: 'active', label: 'Active Active' },
            { id: 'on-break', label: 'On Break' },
            { id: 'off-duty', label: 'Off Shift' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveTab(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === f.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {/* Direct team search */}
          <div className="relative flex-1 md:w-52">
            <input
              type="text"
              placeholder="Search chef, server role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center space-x-1 transition-all shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Onboard Member</span>
          </button>
        </div>
      </div>

      {/* New onboarder form block overlay */}
      {showAddForm && (
        <form onSubmit={handleAddNewStaffMember} className="bg-slate-50 border rounded-2xl border-dashed border-slate-300 p-6 space-y-4 animate-fadeIn">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800">Add Guest Service Teammate</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-550 uppercase text-slate-500 mb-1">Teammate Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Richard Hendricks"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border bg-white rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-550 uppercase text-slate-500 mb-1">Operational Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value )}
                className="w-full px-3 py-2 border bg-white rounded-lg focus:outline-none"
              >
                {['Chef', 'Sous Chef', 'Server', 'Bartender', 'Host'].map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-550 uppercase text-slate-500 mb-1">Assigned Shift Time</label>
              <select
                value={newShift}
                onChange={(e) => setNewShift(e.target.value)}
                className="w-full px-3 py-2 border bg-white rounded-lg focus:outline-none"
              >
                <option value="Morning (8 AM - 4 PM)">Morning (11 AM - 4 PM)</option>
                <option value="Evening (4 PM - Midnight)">Evening (4 PM - Midnight)</option>
                <option value="Culinary Double (11 AM - 10 PM)">Culinary Double (11 AM - 10 PM)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-550 uppercase text-slate-500 mb-1">Phone Number</label>
              <input
                type="text"
                required
                placeholder="555-0100"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-3 py-2 border bg-white rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 border bg-white rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 bg-indigo-600 text-white font-bold rounded-lg"
            >
              Onboard Member
            </button>
          </div>
        </form>
      )}

      {/* Roster list view card grid */}
      <div id="roster-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.map((stf) => (
          <div key={stf.id} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
            
            <div className="space-y-3">
              {/* Card Header row */}
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-slate-400">{stf.id}</span>
                <span className={`h-2.5 w-2.5 rounded-full ${getStatusIndicator(stf.status)}`} title={`State: ${stf.status}`} />
              </div>

              {/* Central Name details */}
              <div className="flex items-center space-x-3.5">
                <div className={`h-11 w-11 rounded-full font-bold text-slate-50 flex items-center justify-center shadow-inner uppercase ${stf.avatarColor}`}>
                  {stf.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{stf.name}</h4>
                  <span className="text-[10px] text-slate-500 font-semibold">{stf.role}</span>
                </div>
              </div>

              {/* Phone, Score metrics */}
              <div className="border-t border-slate-50 pt-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center space-x-1.5 text-slate-400">
                    <Phone className="h-3 w-3" />
                    <span>Contact</span>
                  </span>
                  <span className="font-mono">{stf.phone}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center space-x-1.5 text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>Shift Profile</span>
                  </span>
                  <span className="truncate max-w-44 font-semibold text-slate-700">{stf.shift.split(' ')[0]}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-slate-400">
                    <Star className="h-3 w-3" />
                    <span>Performance</span>
                  </span>
                  <span className="font-bold text-indigo-750 font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded text-[10px]">
                    ★ {stf.performanceScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Change worker status buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-1.5">
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => onUpdateStaffStatus(stf.id, 'on-duty')}
                  className={`px-2 py-1 border text-[10px] font-bold rounded ${
                    stf.status === 'on-duty' ? 'bg-slate-900 border-slate-900 text-white' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  On Duty
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStaffStatus(stf.id, 'on-break')}
                  className={`px-2 py-1 border text-[10px] font-bold rounded ${
                    stf.status === 'on-break' ? 'bg-amber-550 bg-amber-500 border-amber-500 text-white' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  Break
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStaffStatus(stf.id, 'off-duty')}
                  className={`px-2 py-1 border text-[10px] font-bold rounded ${
                    stf.status === 'off-duty' ? 'bg-slate-400 border-slate-400 text-white' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  Off Shift
                </button>
              </div>

              {/* Fire service helper */}
              <button
                type="button"
                onClick={() => onFireStaff(stf.id)}
                className="p-1 rounded text-red-500 hover:bg-red-50"
                title="Remove teammate from team configuration"
              >
                <Power className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
