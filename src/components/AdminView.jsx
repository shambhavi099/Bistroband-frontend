/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import  { useState } from 'react';
import { 
  Settings, 
  Percent, 
  Wrench, 
  History, 
  
  RotateCcw, 
  
  Plus, 
  Check, 
  Trash2, 
  Search, 
 
  Coffee, 
  PackagePlus, 
  AlertCircle, 
  Save, 
 
  Gift,


  Terminal,
  
} from 'lucide-react';


export default function AdminView({
  systemConfig,
  onUpdateSystemConfig,
  promoCampaigns,
  onAddPromoCampaign,
  onTogglePromoCampaignStatus,
  onDeletePromoCampaign,
  auditLogs,
  onClearAuditLogs,
  onAddAuditLog,
  onResetToDefaults,
  onWipeFinancialLedgers,
  onSimulateBusyRush,
  onReplenishStock
}) {
  // Navigation for Admin sublevel tabs
  const [activeSubTab, setActiveSubTab] = useState("config");

  // Success Feedback
  const [saveSuccess, setSaveSuccess] = useState(null);

  // --- TAB 1: CONFIG STATE ---
  const [restName, setRestName] = useState(systemConfig.restaurantName);
  const [taxRate, setTaxRate] = useState(systemConfig.taxRate.toString());
  const [srvCharge, setSrvCharge] = useState(systemConfig.serviceChargeRate.toString());
  const [cleanupTbl, setCleanupTbl] = useState(systemConfig.enableTableCleanup);
  const [prepBuffer, setPrepBuffer] = useState(systemConfig.preparationBuffer.toString());

  // --- TAB 2: PROMOS FORM STATE ---
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoDiscountPct, setPromoDiscountPct] = useState('15');
  const [promoDesc, setPromoDesc] = useState('');

  // --- TAB 4: AUDIT LOGS SEARCH STATE ---
  const [logSearch, setLogSearch] = useState('');
  const [logCategoryFilter, setLogCategoryFilter] = useState('all');
  const [logSeverityFilter, setLogSeverityFilter] = useState('all');

  const triggerFeedback = (message) => {
    setSaveSuccess(message);
    setTimeout(() => {
      setSaveSuccess(null);
    }, 4000);
  };

  // Save Settings Config
  const handleSaveConfig = (e) => {
    e.preventDefault();
    const updated= {
      restaurantName: restName.trim() || 'Bistroboard Gourmet',
      taxRate: parseFloat(taxRate) || 0,
      serviceChargeRate: parseFloat(srvCharge) || 0,
      enableTableCleanup: cleanupTbl,
      preparationBuffer: parseInt(prepBuffer, 10) || 0
    };
    onUpdateSystemConfig(updated);
    onAddAuditLog('CONFIG', `System configurations revised (Tax: ${taxRate}%, Service: ${srvCharge}%)`, 'info');
    triggerFeedback('Operational configurations successfully locked & saved!');
  };

  // Add Promo Campaign
  const handleCreatePromo = (e) => {
    e.preventDefault();
    const code = promoCodeInput.trim().toUpperCase();
    const pct = parseInt(promoDiscountPct, 10);
    
    if (!code) {
      alert('Coupon code cannot be empty.');
      return;
    }
    if (isNaN(pct) || pct < 1 || pct > 100) {
      alert('Discount value must be a percentage between 1 and 100.');
      return;
    }

    // Check duplication
    if (promoCampaigns.some(c => c.code.toUpperCase() === code)) {
      alert('A campaign with this code already exists. Set status or delete it first.');
      return;
    }

    const newCampaign= {
      id: `CAM-${Math.floor(2000 + Math.random() * 8000)}`,
      code,
      discountPct: pct,
      description: promoDesc.trim() || `${pct}% OFF - Loyalty Campaign Promo`,
      isActive: true
    };

    onAddPromoCampaign(newCampaign);
    onAddAuditLog('CAMPAIGN', `Created campaign code ${code} giving ${pct}% off`, 'info');
    triggerFeedback(`Promo Coupon code '${code}' successfully registered!`);

    // Reset Form
    setPromoCodeInput('');
    setPromoDiscountPct('15');
    setPromoDesc('');
  };

  // Filters for Audit Logs
  const filteredLogs = auditLogs.filter(log => {
    if (logCategoryFilter !== 'all' && log.category !== logCategoryFilter) return false;
    if (logSeverityFilter !== 'all' && log.severity !== logSeverityFilter) return false;
    
    if (logSearch.trim()) {
      const q = logSearch.toLowerCase();
      return log.action.toLowerCase().includes(q) || log.user.toLowerCase().includes(q) || log.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div id="admin-view-root" className="space-y-6">
      
      {/* Top operational alert success notice */}
      {saveSuccess && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold animate-slideIn">
          <span className="flex items-center gap-2">
            <Check className="h-4.5 w-4.5 bg-white/20 rounded-full p-0.5 shrink-0 animate-bounce" />
            {saveSuccess}
          </span>
          <button onClick={() => setSaveSuccess(null)} className="text-white hover:text-emerald-100 text-xs font-bold">Dismiss</button>
        </div>
      )}

      {/* Admin Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand: Tab Switches */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 space-y-1.5 select-none">
          <div className="px-3 pb-3 border-b border-slate-50 mb-3">
            <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">System Management</span>
            <span className="text-[11px] text-slate-500 font-medium">Configure operations OS parameters</span>
          </div>

          {[
            { id: 'config', label: 'System Properties', desc: 'Bistro taxes & details', icon: Settings },
            { id: 'promos', label: 'Promotion Campaigns', desc: 'CRM coupons & codes', icon: Percent },
            { id: 'bulk', label: 'State Bulk Tools', desc: 'Diagnostics & default seeds', icon: Wrench },
            { id: 'logs', label: 'Live Audit Log', desc: 'Timestamped transaction feed', icon: History }
          ].map(sb => {
            const SbIcon = sb.icon;
            const isSubActive = activeSubTab === sb.id;
            return (
              <button
                key={sb.id}
                type="button"
                onClick={() => setActiveSubTab(sb.id)}
                className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center space-x-3 border ${
                  isSubActive 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                    : 'bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-100'
                }`}
              >
                <SbIcon className={`h-5 w-5 shrink-0 ${isSubActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <div>
                  <span className="block text-xs font-bold leading-none">{sb.label}</span>
                  <span className={`block text-[9px] mt-1 font-medium ${isSubActive ? 'text-slate-300' : 'text-slate-400'}`}>{sb.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Hand Content panel (9 Cols) */}
        <div className="lg:col-span-9 bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          
          {/* TAB 1: SYSTEM PROPERTIES */}
          {activeSubTab === 'config' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Settings className="h-4.5 w-4.5 text-amber-500" />
                  Gourmet Operations properties
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Fine-tune global tax figures, kitchen thresholds, and automation settings</p>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-medium">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Restaurant Operational Brand Name</label>
                    <input
                      type="text"
                      value={restName}
                      onChange={(e) => setRestName(e.target.value)}
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 font-semibold"
                      placeholder="e.g. Bistroboard Gilded Diner"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Operational Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                      placeholder="8.25"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Automatic Service Gratuity Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={srvCharge}
                      onChange={(e) => setSrvCharge(e.target.value)}
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                      placeholder="10.0"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Default Preparation Padding Buffer (mins)</label>
                    <input
                      type="number"
                      value={prepBuffer}
                      onChange={(e) => setPrepBuffer(e.target.value)}
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                      placeholder="5"
                    />
                  </div>

                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="block text-xs font-bold text-slate-800">Automatic Table Settle Release</span>
                    <span className="block text-[10px] text-slate-500">Upon clearing an invoice at the POS register, immediately release and make associated diners' seats available.</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setCleanupTbl(p => !p)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      cleanupTbl ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      cleanupTbl ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center space-x-2 transition-all shadow-md shadow-indigo-600/15"
                  >
                    <Save className="h-4 w-4" />
                    <span>Lock Properties Config</span>
                  </button>
                </div>
              </form>

              {/* Informational Guidelines Card */}
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start space-x-3 text-xs text-indigo-950">
                <AlertCircle className="h-4.5 w-4.5 text-indigo-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <span className="block font-bold">Admin State Policy</span>
                  <p className="text-[11px] text-indigo-900 leading-relaxed">
                    Configuration settings loaded here directly modify computational percentages in the live POS Register billing sub-panels and automatically control the release process of occupied seating.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PROMO COUPON CAMPAIGNS */}
          {activeSubTab === 'promos' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl -mx-6 -mt-6 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Percent className="h-4.5 w-4.5 text-amber-500" />
                    Marketing Coupons & Active CRM Campaigns
                  </h3>
                  <p className="text-[11px] text-slate-550 mt-0.5">Control live promotional voucher codes applicable during invoice checkout</p>
                </div>
                <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 border border-indigo-200 rounded"> Loyalty OS Active </span>
              </div>

              {/* Grid: Create Form on left, active list on right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Promo Code Factory */}
                <form onSubmit={handleCreatePromo} className="space-y-4 border border-slate-100 p-4.5 rounded-2xl bg-slate-50/50 font-medium text-xs">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5 flex items-center gap-1.5"><Plus className="h-3.5 w-3.5 text-amber-500" /> Spawn campaign code</span>
                  
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Coupon Code Name (Uppercase Only)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. VIPSUMMER25"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="w-full p-2.5 bg-white border rounded-lg focus:outline-none text-slate-800 uppercase font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Discount Amount (%)</label>
                    <input
                      type="number"
                      required
                      placeholder="15"
                      min="1"
                      max="100"
                      value={promoDiscountPct}
                      onChange={(e) => setPromoDiscountPct(e.target.value)}
                      className="w-full p-2.5 bg-white border rounded-lg focus:outline-none font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Campaign Tagline description</label>
                    <input
                      type="text"
                      placeholder="e.g. Elite Patron 15% VIP discount"
                      value={promoDesc}
                      onChange={(e) => setPromoDesc(e.target.value)}
                      className="w-full p-2.5 bg-white border rounded-lg focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Register Campaign Code</span>
                  </button>
                </form>

                {/* Active Campaign Rules listing */}
                <div className="space-y-3.5">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Registered Active Voucher Coupons ({promoCampaigns.length})</span>
                  
                  <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                    {promoCampaigns.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 border border-dashed rounded-xl text-slate-400 text-xs italic">
                        <Gift className="h-6 w-6 text-slate-300 mx-auto mb-1.5" />
                        <span>No custom promos registered. Only standard fallbacks (`HAPPYHOUR`, `WELCOME5`) will respond in POS.</span>
                      </div>
                    ) : (
                      promoCampaigns.map(c => (
                        <div key={c.id} className="p-3 bg-white border border-slate-100 rounded-xl relative hover:border-slate-300 transition-all text-xs flex justify-between items-center group shadow-sm">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 font-mono">{c.code}</span>
                              <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 font-bold text-[9px] rounded font-semibold border border-emerald-100 shrink-0">-{c.discountPct}%</span>
                            </div>
                            <span className="block text-[10px] text-slate-400 font-normal mt-0.5">{c.description}</span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {/* Toggle status */}
                            <button
                              type="button"
                              onClick={() => onTogglePromoCampaignStatus(c.id)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                                c.isActive 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' 
                                  : 'bg-slate-100 text-slate-400 border border-slate-205'
                              }`}
                            >
                              {c.isActive ? 'Active' : 'Disabled'}
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete the coupon campaign campaign code '${c.code}'?`)) {
                                  onDeletePromoCampaign(c.id);
                                  onAddAuditLog('CAMPAIGN', `Deleted promotion campaign coupon rule: ${c.code}`, 'critical');
                                }
                              }}
                              className="p-1 text-slate-450 hover:text-red-500 rounded hover:bg-slate-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: STATE BULK TOOLS */}
          {activeSubTab === 'bulk' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="h-4.5 w-4.5 text-amber-500" />
                  Gourmet Bulk Maintenance & Diagnostic suite
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Diagnostic tools to reset state, simulate diner traffic, and verify reports systems in real-time</p>
              </div>

              {/* Visual Diagnostic Deck Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Box 1: Busy lunch rush traffic */}
                <div className="border border-slate-100 p-4.5 rounded-2xl hover:bg-slate-50/50 transition-all flex justify-between flex-col">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                        <Coffee className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-xs text-slate-800">Simulate Busy Lunch Hour traffic</span>
                    </div>
                    <p className="text-[10px] text-slate-450 leading-relaxed mt-2.5">
                      Fills tables with active spend totals, appends kitchen tickets waiting for dispatch, and registers multiple new CRM customer profiles to simulate a live lunch-hour swarm.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={() => {
                        onSimulateBusyRush();
                        onAddAuditLog('SYSTEM', 'Admin triggered bulk operation: Simulating busy lunch hour swarm traffic', 'warn');
                        triggerFeedback('Swarm Lunch Simulation injected successfully! Tables occupied, tickets created.');
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
                    >
                      Trigger Simulation
                    </button>
                  </div>
                </div>

                {/* Box 2: Fill restock reserves */}
                <div className="border border-slate-100 p-4.5 rounded-2xl hover:bg-slate-50/50 transition-all flex justify-between flex-col">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                        <PackagePlus className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-xs text-slate-800">Replenish Low Stock Inventory</span>
                    </div>
                    <p className="text-[10px] text-slate-450 leading-relaxed mt-2.5">
                      Automatically updates stock measurements for all inventory pantry files to clean up red 'Low Stock' visual alerts. Useful before inspecting high-volume kitchens reports.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={() => {
                        onReplenishStock();
                        onAddAuditLog('INVENTORY', 'Admin triggered bulk stock replenishment (+300 units to low inventory)', 'info');
                        triggerFeedback('Inventory stockpile successfully replenished! All critical stock levels healthy.');
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                    >
                      Restock Reserves
                    </button>
                  </div>
                </div>

                {/* Box 3: Wipe financials ledgers */}
                <div className="border border-rose-100 bg-rose-50/15 p-4.5 rounded-2xl hover:bg-rose-50/30 transition-all flex justify-between flex-col">
                  <div>
                    <div className="flex items-center space-x-2.5 text-rose-800">
                      <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg shrink-0 border border-rose-100">
                        <Trash2 className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-xs">Purge Financial Checkout Ledgers</span>
                    </div>
                    <p className="text-[10px] text-slate-550 leading-relaxed mt-2.5">
                      Erases the historical cash/card transaction payments databases back to scratch. Allows fresh checkout simulations without muddying standard financial graphs reporting tools.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-rose-100/50">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('CRITICAL WARNING: This will permanently erase ALL checkout transaction ledgers history. Continue?')) {
                          onWipeFinancialLedgers();
                          onAddAuditLog('BILLING', 'Admin executed deep purge on historical financial checkout ledgers database', 'critical');
                          triggerFeedback('Historical financial database wiped clean!');
                        }
                      }}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-750 hover:bg-rose-700 text-white font-bold rounded-lg text-xs"
                    >
                      Deep Purge Ledgers
                    </button>
                  </div>
                </div>

                {/* Box 4: Restore factory mock baseline */}
                <div className="border border-slate-200 bg-amber-50/10 p-4.5 rounded-2xl hover:bg-amber-50/25 transition-all flex justify-between flex-col">
                  <div>
                    <div className="flex items-center space-x-2.5 text-amber-800">
                      <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0 border border-amber-100">
                        <RotateCcw className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-xs">Restore Factory baseline Seeding</span>
                    </div>
                    <p className="text-[10px] text-slate-550 leading-relaxed mt-2.5">
                      Reverts all structures, tables, staff credentials, customer profiles, inventories, and tickets back to default pre-loaded mock scenarios. Overwrites custom records created since deployment.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-200/50">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Reset BistroBoard operational OS back to baseline factory state? This clears edits and additions.')) {
                          onResetToDefaults();
                          onAddAuditLog('SYSTEM', 'Hard reset baseline factory restore executed on BistroBoard OS database', 'critical');
                          triggerFeedback('Bistroboard system baseline restored to defaults successfully.');
                        }
                      }}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs"
                    >
                      Baseline HARD Reset
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: LIVE SECURITY & OPERATION AUDIT LOGS */}
          {activeSubTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Terminal className="h-4.5 w-4.5 text-amber-500" />
                    Security & Operational audit trail
                  </h3>
                  <p className="text-[11px] text-slate-500">Real-time ledger recording administrative changes, billing events, and cancellations</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Clear audit session logs feed?')) {
                      onClearAuditLogs();
                      triggerFeedback('Audit log cleared.');
                    }
                  }}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold rounded-lg text-[10px] shrink-0"
                >
                  Clear Feed
                </button>
              </div>

              {/* Logs filter search panel */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    placeholder="Search logs action..."
                    className="w-full text-[11px] pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-550"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>

                {/* Category filter */}
                <select
                  value={logCategoryFilter}
                  onChange={(e) => setLogCategoryFilter(e.target.value)}
                  className="w-full text-[11px] bg-white border border-slate-200 rounded-lg p-1.5 font-semibold focus:outline-none"
                >
                  <option value="all">Check Categories (All)</option>
                  <option value="CONFIG">CONFIG — Setup changes</option>
                  <option value="BILLING">BILLING — Cashiers/POS</option>
                  <option value="ORDER">ORDER — Tickets state</option>
                  <option value="INVENTORY">INVENTORY — Stock</option>
                  <option value="STAFF">STAFF — Human roster</option>
                  <option value="CAMPAIGN">CAMPAIGN — Coupons</option>
                  <option value="SYSTEM">SYSTEM — Infrastructure</option>
                </select>

                {/* Severity filter */}
                <select
                  value={logSeverityFilter}
                  onChange={(e) => setLogSeverityFilter(e.target.value)}
                  className="w-full text-[11px] bg-white border border-slate-200 rounded-lg p-1.5 font-semibold focus:outline-none"
                >
                  <option value="all">Check Severity (All)</option>
                  <option value="info">INFO — Normal updates</option>
                  <option value="warn">WARN — Operations safety</option>
                  <option value="critical">CRITICAL — Hard resets</option>
                </select>

              </div>

              {/* Logs Table Area */}
              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-inner">
                <div className="h-[360px] overflow-y-auto bg-slate-950 p-4.5 font-mono text-[11px] text-slate-300 space-y-1.5">
                  {filteredLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20 text-center">
                      <Terminal className="h-6 w-6 text-slate-650 mb-2" />
                      <span>-- NO AUDIT LOGS MATCH SYSTEM SEARCH parameters --</span>
                    </div>
                  ) : (
                    filteredLogs.map(log => (
                      <div key={log.id} className="flex items-start py-1 border-b border-slate-900 border-dashed hover:bg-slate-900/40 px-1 transition-colors">
                        <span className="text-slate-500 shrink-0 select-none mr-2">[{log.timestamp}]</span>
                        
                        {/* Tag categorizer widget */}
                        <span className={`px-1.5 py-0.2 uppercase rounded-[3px] font-bold text-[9px] mr-2 text-slate-900 shrink-0 ${
                          log.category === 'CONFIG' ? 'bg-indigo-300' :
                          log.category === 'BILLING' ? 'bg-emerald-300' :
                          log.category === 'ORDER' ? 'bg-amber-300' :
                          log.category === 'INVENTORY' ? 'bg-pink-300' :
                          log.category === 'STAFF' ? 'bg-indigo-300/80 bg-blue-300' :
                          log.category === 'CAMPAIGN' ? 'bg-purple-300' :
                          'bg-red-300'
                        }`}>
                          {log.category}
                        </span>

                        <span className="flex-1 text-slate-200">
                          {log.action}
                        </span>

                        <div className="flex items-center space-x-1 ml-2 shrink-0">
                          <span className={`text-[9px] font-extrabold uppercase font-semibold text-[8px] ${
                            log.severity === 'critical' ? 'text-red-400' :
                            log.severity === 'warn' ? 'text-amber-400' :
                            'text-slate-400'
                          }`}>
                            {log.severity}
                          </span>
                          <span className="text-slate-500 select-none">•</span>
                          <span className="text-slate-450">{log.user}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
