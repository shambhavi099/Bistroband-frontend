/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  User, 
  Mail, 
  Phone, 
  Award, 
  Sparkles, 
  DollarSign, 
  Calendar, 
  Heart, 
  Send, 
  Trash2, 
  Edit, 
  X, 
  Check,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

const getVisitSpendAddition = () => Math.floor(25 + Math.random() * 55);

export default function CustomersView({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(customers?.[0] || null);

  // Form states to add patron
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newTier, setNewTier] = useState('Regular');
  const [newPreferences, setNewPreferences] = useState('');
  const [newFavDishes, setNewFavDishes] = useState('');

  // Quick edit pref states
  const [isEditingPrefs, setIsEditingPrefs] = useState(false);
  const [editedPrefs, setEditedPrefs] = useState('');

  // Promotion feedback states
  const [promoMessage, setPromoMessage] = useState(null);

  // Filters
  const filteredCustomers = customers.filter(cust => {
    if (selectedTier !== 'all' && cust.tier !== selectedTier) return false;
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const inName = cust.name.toLowerCase().includes(q);
      const inEmail = cust.email?.toLowerCase().includes(q);
      const inPhone = cust.phone.includes(q);
      const inPref = cust.preferences?.toLowerCase().includes(q);
      return inName || inEmail || inPhone || inPref;
    }
    return true;
  });

  // Highlight/fallback selected customer if list filter changes
  React.useEffect(() => {
    if (filteredCustomers.length === 0) {
      setTimeout(() => {
        setSelectedCustomer(null);
      }, 0);
      return;
    }

    const exists = filteredCustomers.some(
      c => c.id === selectedCustomer?.id
    );

    if (!exists) {
      setTimeout(() => {
        setSelectedCustomer(filteredCustomers[0]);
      }, 0);
    }
  }, [filteredCustomers, selectedCustomer]);

  // Statistics
  const totalCustomers = customers.length;
  const vipCount = customers.filter(c => c.tier === 'VIP').length;
  const totalLifetimeSpend = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalVisits = customers.reduce((sum, c) => sum + c.totalVisits, 0);
  const avgTicketValue = totalVisits > 0 ? (totalLifetimeSpend / totalVisits).toFixed(2) : '0.00';

  const handleAddNewCustomerField = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-rose-500'];
    const randColor = colors[Math.floor(Math.random() * colors.length)];

    const favoriteDishesArray = newFavDishes
      ? newFavDishes.split(',').map(d => d.trim()).filter(Boolean)
      : ['Truffle Ribeye Steak'];

   const newCustomer = {
    name: newName,
    email: newEmail,
    phone: newPhone,
    tier: newTier,
    totalSpent: 0,
    totalVisits: 0,
    notes: newPreferences,
};

    await onAddCustomer(newCustomer);

    // Reset Form
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewTier('Regular');
    setNewPreferences('');
    setNewFavDishes('');
    setShowAddForm(false);
  };

  const startEditingPrefs = () => {
    if (selectedCustomer) {
      setEditedPrefs(selectedCustomer.preferences);
      setIsEditingPrefs(true);
    }
  };

  const saveEditedPrefs = () => {
    if (selectedCustomer) {
      const updated = {
        ...selectedCustomer,
        preferences: editedPrefs
      };
      onUpdateCustomer(updated);
      setSelectedCustomer(updated);
      setIsEditingPrefs(false);
    }
  };

  const incrementVisits = () => {
    if (!selectedCustomer) return;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }); // e.g. Jun 02, 2026

    // Increment with some representative spending based on favorite dishes, say $45 average
    const spendAddition = getVisitSpendAddition();

    const updated = {
      ...selectedCustomer,
      totalVisits: selectedCustomer.totalVisits + 1,
      totalSpent: selectedCustomer.totalSpent + spendAddition,
      lastVisit: formattedDate
    };

    onUpdateCustomer(updated);
    setSelectedCustomer(updated);

    // Highlight confirmation feedback
    displayPromoFeedback(`Successfully logged high-affinity visit for ${selectedCustomer.name}! Added $${spendAddition} to local spend statistics.`);
  };

  const changeTier = (tier) => {
    if (!selectedCustomer) return;
    const updated = {
      ...selectedCustomer,
      tier
    };
    onUpdateCustomer(updated);
    setSelectedCustomer(updated);
  };

  const triggerCampaign = (type) => {
    if (!selectedCustomer) return;
    let text;
    if (type === 'coupon') {
      text = `Promotional campaign [LOYALTY_TREAT_15%] successfully generated! Coupon text notification transmitted to ${selectedCustomer.email}.`;
    } else if (type === 'birthday') {
      text = `VIP Chef Special Table Reservation invite compiled and dispatched to ${selectedCustomer.phone}.`;
    } else {
      text = `Feedback request notification pushed through standard CRM pipelines for ${selectedCustomer.name}.`;
    }
    displayPromoFeedback(text);
  };

  const displayPromoFeedback = (msg) => {
    setPromoMessage(msg);
    setTimeout(() => {
      setPromoMessage(null);
    }, 4500);
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'VIP':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/25 dark:text-amber-400 border-amber-250 border border-amber-200';
      case 'Regular':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-400 border border-emerald-200';
      case 'New':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/25 dark:text-blue-400 border border-blue-200';
      case 'Local':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/25 dark:text-purple-400 border border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div id="customers-view-parent" className="space-y-6">
      
      {/* Top statistics tiles */}
      <div id="customers-summary-cards" className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border p-4.5 rounded-2xl flex items-center space-x-4 border-slate-100 shadow-sm">
          <div className="p-2.5 bg-indigo-50 rounded-xl">
            <User className="h-5.5 w-5.5 text-indigo-600" />
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-400 font-bold leading-tight">Total Patrons</span>
            <span className="text-lg font-bold font-mono text-slate-900">{totalCustomers} Profiles</span>
          </div>
        </div>

        <div className="bg-white border p-4.5 rounded-2xl flex items-center space-x-4 border-slate-100 shadow-sm">
          <div className="p-2.5 bg-amber-50 rounded-xl">
            <Award className="h-5.5 w-5.5 text-amber-600" />
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-400 font-bold leading-tight">VIP Elite</span>
            <span className="text-lg font-bold font-mono text-slate-900">{vipCount} Customers</span>
          </div>
        </div>

        <div className="bg-white border p-4.5 rounded-2xl flex items-center space-x-4 border-slate-100 shadow-sm">
          <div className="p-2.5 bg-emerald-50 rounded-xl">
            <DollarSign className="h-5.5 w-5.5 text-emerald-600" />
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-400 font-bold leading-tight">Customer Spend</span>
            <span className="text-lg font-bold font-mono text-slate-900">${totalLifetimeSpend.toLocaleString()} Total</span>
          </div>
        </div>

        <div className="bg-white border p-4.5 rounded-2xl flex items-center space-x-4 border-slate-100 shadow-sm">
          <div className="p-2.5 bg-sky-50 rounded-xl">
            <TrendingUp className="h-5.5 w-5.5 text-sky-600" />
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-400 font-bold leading-tight">Avg Spending/Visit</span>
            <span className="text-lg font-bold font-mono text-slate-900">${avgTicketValue} Ticket</span>
          </div>
        </div>
      </div>

      {/* Control bar: Filters, Search, Add */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'all', label: 'All Tiers' },
            { id: 'VIP', label: 'VIP' },
            { id: 'Regular', label: 'Regular' },
            { id: 'Local', label: 'Local' },
            { id: 'New', label: 'New' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedTier(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                selectedTier === f.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:w-56">
            <input
              type="text"
              placeholder="Search patron, phone, diet..."
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
            <Plus className="h-4 w-4" />
            <span>Onboard Patron</span>
          </button>
        </div>
      </div>

      {/* Onboard Patron Form Overlay block */}
      {showAddForm && (
        <form onSubmit={handleAddNewCustomerField} className="bg-slate-50 border border-slate-200 rounded-2xl border-dashed p-5 space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" /> Onboard New Restaurant Patron
            </h4>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Patron Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Richard Hendrix"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-505 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
              <input
                type="email"
                placeholder="richard@hooli-xyz.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 border bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mobile Carrier Phone</label>
              <input
                type="text"
                placeholder="555-0199"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-3 py-2 border bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Loyalty Priority Tier</label>
              <select
                value={newTier}
                onChange={(e) => setNewTier(e.target.value)}
                className="w-full px-3 py-2 border bg-white rounded-lg focus:outline-none"
              >
                <option value="Regular">Regular Patron</option>
                <option value="VIP">VIP Premium Elite</option>
                <option value="Local">Local/Regular Partner</option>
                <option value="New">New Walk-In</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Preferences & Dietary/Allergy Notes</label>
              <textarea
                placeholder="Severe tree nut allergy, prefers wine recommendation matching steak..."
                value={newPreferences}
                onChange={(e) => setNewPreferences(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Favorite Menu Items (Comma-separated)</label>
              <textarea
                placeholder="Truffle Ribeye Steak, Cabernet Sauvignon, Crispy Calamari..."
                value={newFavDishes}
                onChange={(e) => setNewFavDishes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 border bg-white rounded-lg font-semibold text-xs text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
            >
              Create Customer Profile
            </button>
          </div>
        </form>
      )}

      {/* Toast Promotional feedback message */}
      {promoMessage && (
        <div className="bg-emerald-580 bg-emerald-600 border border-emerald-500 text-white p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold animate-slideIn">
          <span className="flex items-center gap-2">
            <Check className="h-4.5 w-4.5 bg-emerald-500/30 rounded-full p-0.5" />
            {promoMessage}
          </span>
          <button onClick={() => setPromoMessage(null)} className="text-white hover:text-emerald-100 ml-2">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main CRM Dossier Split-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Patrons Table List (4 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-50 p-4 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Patron Directory ({filteredCustomers.length})</h3>
          </div>
          
          <div className="divide-y divide-slate-150 divide-slate-100 max-h-[550px] overflow-y-auto">
            {filteredCustomers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No customer profiles match that criteria.
              </div>
            ) : (
              filteredCustomers.map(cust => (
                <div 
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className={`p-4 flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-slate-50/70 border-l-4 ${
                    selectedCustomer?.id === cust.id 
                      ? 'bg-indigo-50/40 border-indigo-600' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className={`h-9 w-9 rounded-full font-bold text-white flex items-center justify-center uppercase shadow-inner shrink-0 ${cust.avatarColor}`}>
                      {cust.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{cust.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{cust.phone}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getTierColor(cust.tier)}`}>
                      {cust.tier}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">
                      ${cust.totalSpent} total
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Luxurious Dossier Card (7 cols) */}
        <div className="lg:col-span-7">
          {selectedCustomer ? (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between h-full">
              
              <div>
                {/* Dossier Header */}
                <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`h-14 w-14 rounded-full font-bold text-white text-lg flex items-center justify-center shadow-inner uppercase shrink-0 ${selectedCustomer.avatarColor}`}>
                      {selectedCustomer.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-bold text-slate-900">{selectedCustomer.name}</h2>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getTierColor(selectedCustomer.tier)}`}>
                          {selectedCustomer.tier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Profile Identification ID: <span className="font-mono font-bold text-slate-600">{selectedCustomer.id}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 mr-1.5">Change Tier:</label>
                    {['VIP', 'Regular', 'Local', 'New'].map(tier => (
                      <button
                        key={tier}
                        onClick={() => changeTier(tier)}
                        className={`px-1.5 py-0.5 rounded font-bold text-[9px] border transition-all ${
                          selectedCustomer.tier === tier
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-500 border-slate-205 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dossier Details Grid */}
                <div className="p-6 space-y-6">
                  
                  {/* Lifespan Metrics Container */}
                  <div className="grid grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                    <div className="text-center border-r border-slate-100">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Lifetime Spend</span>
                      <span className="text-base font-bold font-mono text-slate-800">${selectedCustomer.totalSpent}</span>
                    </div>
                    <div className="text-center border-r border-slate-100">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Total Visits</span>
                      <span className="text-base font-bold font-mono text-slate-800">{selectedCustomer.totalVisits}</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Avg Spend/Visit</span>
                      <span className="text-base font-bold font-mono text-slate-800">
                        ${selectedCustomer.totalVisits > 0 ? (selectedCustomer.totalSpent / selectedCustomer.totalVisits).toFixed(0) : '0'}
                      </span>
                    </div>
                  </div>

                  {/* Core Properties (Contact Info, Last Visit) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-slate-600 pb-2.5 border-b border-slate-50">
                        <span className="flex items-center gap-2 text-slate-400 font-semibold">
                          <Phone className="h-3.5 w-3.5 text-slate-450" /> Contact Phone
                        </span>
                        <span className="font-mono text-slate-705 font-medium">{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 pb-2.5 border-b border-slate-50">
                        <span className="flex items-center gap-2 text-slate-400 font-semibold">
                          <Mail className="h-3.5 w-3.5 text-slate-450" /> Contact Email
                        </span>
                        <span className="font-mono text-slate-705 font-medium truncate max-w-[160px]" title={selectedCustomer.email}>{selectedCustomer.email}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-slate-600 pb-2.5 border-b border-slate-50">
                        <span className="flex items-center gap-2 text-slate-400 font-semibold">
                          <Calendar className="h-3.5 w-3.5 text-slate-450" /> Recorded Last Visit
                        </span>
                        <span className="font-mono text-slate-705 font-medium">{selectedCustomer.lastVisit}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 pb-2.5 border-b border-slate-50">
                        <span className="flex items-center gap-2 text-slate-400 font-semibold">
                          <Sparkles className="h-3.5 w-3.5 text-slate-450 text-indigo-400" /> Active Loyalty status
                        </span>
                        <span className="font-bold text-slate-800 font-medium">Activated</span>
                      </div>
                    </div>
                  </div>

                  {/* Dietary Requirements / Preferences Dossier Section */}
                  <div className="space-y-2 border border-slate-100 rounded-xl p-4.5 bg-indigo-50/10">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-indigo-500" /> Guest Dining Notes & Preferences
                      </h4>
                      {isEditingPrefs ? (
                        <div className="flex items-center space-x-1">
                          <button onClick={saveEditedPrefs} className="px-2 py-0.5 bg-indigo-600 text-white rounded font-bold text-[10px] hover:bg-indigo-700">Save</button>
                          <button onClick={() => setIsEditingPrefs(false)} className="px-2 py-0.5 bg-white border border-slate-202 text-slate-500 rounded font-bold text-[10px] hover:bg-slate-50">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={startEditingPrefs} className="p-1 rounded text-slate-400 hover:text-indigo-650 hover:bg-indigo-50 transition-colors">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {isEditingPrefs ? (
                      <textarea
                        value={editedPrefs}
                        onChange={(e) => setEditedPrefs(e.target.value)}
                        rows={2}
                        className="w-full p-2 border border-slate-205 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-xs text-slate-600 leading-relaxed italic bg-white border border-slate-50 p-2.5 rounded-lg">
                        "{selectedCustomer.preferences}"
                      </p>
                    )}
                  </div>

                  {/* Favorite Dishes Custom Cluster */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Heart className="h-4 w-4 text-rose-500" /> Favorite Dishes / Beverages
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCustomer.favoriteDishes?.length === 0 ? (
                        <span className="text-slate-400 text-xs italic">No favorite dishes registered.</span>
                      ) : (
                        selectedCustomer.favoriteDishes?.map((dish, i) => (
                          <span key={i} className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold border border-rose-100 flex items-center gap-1">
                            <Heart className="h-2.5 w-2.5 fill-rose-500 text-rose-500" /> {dish}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Dossier CRM Action Console (Bottom Footer) */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={incrementVisits}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow-sm transition-all"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Log High-Affinity Visit</span>
                </button>

                <div className="flex items-center space-x-1.5 flex-wrap">
                  <button
                    onClick={() => triggerCampaign('coupon')}
                    className="px-3 py-2 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-650 font-bold rounded-lg text-xs flex items-center gap-1.5 text-indigo-700 font-semibold"
                    title="Send standard coupon offer to patron"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Promo Coupon</span>
                  </button>

                  <button
                    onClick={() => triggerCampaign('birthday')}
                    className="px-3 py-2 bg-amber-50 border border-amber-150 hover:bg-amber-100 text-amber-655 font-bold rounded-lg text-xs flex items-center gap-1.5 text-amber-700 font-semibold"
                    title="Send a specialized invitation"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>VIP Table Invitation</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to permanently terminate ${selectedCustomer.name}'s customer profile dossier?`)) {
                        onDeleteCustomer(selectedCustomer.id);
                      }
                    }}
                    className="p-2 border border-red-200 hover:bg-red-50 text-red-500 rounded-lg"
                    title="Remove CRM patron data permanently"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 text-xs h-full flex flex-col items-center justify-center space-y-3 shadow-sm">
              <User className="h-10 w-10 text-slate-300 stroke-[1.5]" />
              <span>Select a customer from the catalog directory to inspect their dining history dossier.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
