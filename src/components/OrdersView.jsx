/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import  { useState } from 'react';
import { 
  Search, 
  Plus, 

  Utensils, 
 
  CheckCircle, 
  
  X,
  AlertCircle,
  CreditCard,
  Check
} from 'lucide-react';


export default function OrdersView({ 
  orders, 
  menuItems, 
  onAddOrder, 
  onUpdateOrderStatus,
  onCancelOrder,
  onTriggerPOSCheckout,
  payments
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(orders?.[0]?.id || null);

  // New Order Form states
  const [showDraftForm, setShowDraftForm] = useState(false);
  const [draftCustomer, setDraftCustomer] = useState('');
  const [draftTableNum, setDraftTableNum] = useState('T1');
  const [draftItems, setDraftItems] = useState([]);
  const [draftType, setDraftType] = useState('dine-in');
  const [draftNotes, setDraftNotes] = useState('');

  // Selected Order logic
  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders?.[0] || null;

  // Filter orders
  const filteredOrders = orders.filter(o => {
    // Type Filter
    if (activeFilter === 'dine-in' && o.type !== 'dine-in') return false;
    if (activeFilter === 'takeaway' && o.type !== 'takeaway') return false;
    if (activeFilter === 'delivery' && o.type !== 'delivery') return false;
    if (activeFilter === 'pending' && (o.status !== 'pending' && o.status !== 'preparing')) return false;

    // Search Term Filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const inId = o.id.toLowerCase().includes(term);
      const inCust = o.customerName.toLowerCase().includes(term);
      const inTable = o.tableNumber && o.tableNumber.toLowerCase().includes(term);
      return inId || inCust || inTable;
    }
    return true;
  });

  const handleAddDraftDish = (menuItem) => {
    const existing = draftItems.find(it => it.id === menuItem.id);
    if (existing) {
      setDraftItems(draftItems.map(it => 
        it.id === menuItem.id ? { ...it, quantity: it.quantity + 1 } : it
      ));
    } else {
      setDraftItems([...draftItems, { id: menuItem.id, name: menuItem.name, quantity: 1, price: menuItem.price }]);
    }
  };

  const handleRemoveDraftDish = (itemId) => {
    setDraftItems(draftItems.filter(it => it.id !== itemId));
  };

  const handleSubmitDraftOrder = (e) => {
    e.preventDefault();
    if (!draftCustomer.trim()) return;
    if (draftItems.length === 0) {
      alert("Please add at least one menu dish first.");
      return;
    }

    const priceSum = draftItems.reduce((acc, current) => acc + (current.price * current.quantity), 0);
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newOrder= {
      id: newId,
      customerName: draftCustomer,
      tableId: draftType === 'dine-in' ? draftTableNum : undefined,
      tableNumber: draftType === 'dine-in' ? draftTableNum : undefined,
      items: draftItems,
      status: 'pending',
      type: draftType,
      timestamp: nowStr,
      createdAtDate: '2026-06-02',
      total: priceSum,
      notes: draftNotes.trim() || undefined
    };

    onAddOrder(newOrder);
    setSelectedOrderId(newId);

    // Reset Form
    setDraftCustomer('');
    setDraftTableNum('T1');
    setDraftItems([]);
    setDraftNotes('');
    setShowDraftForm(false);
  };

  return (
    <div id="orders-parent" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Search and List Side panel */}
      <div id="tickets-list-layout" className="xl:col-span-2 space-y-4">
        
        {/* Top Operational Controls */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'pending', label: 'Active Kitchen' },
              { id: 'dine-in', label: 'Dine-In' },
              { id: 'takeaway', label: 'Takeaway' },
              { id: 'delivery', label: 'Courier Delivery' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeFilter === f.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {/* Search Input */}
            <div className="relative flex-1 md:w-56">
              <input
                type="text"
                placeholder="Search ticket, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Spawn Ticket trigger */}
            <button
              onClick={() => setShowDraftForm(!showDraftForm)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow-sm transition-all shrink-0"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Dine-In Draft</span>
            </button>
          </div>
        </div>

        {/* Draft Custom Ticket Modal Overlay / Expandable Panel */}
        {showDraftForm && (
          <form 
            id="draft-ticket-form" 
            onSubmit={handleSubmitDraftOrder} 
            className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-5 space-y-4 animate-fadeIn"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center space-x-1.5">
                <Utensils className="h-4 w-4 text-indigo-600" />
                <span>Configure Live Dining Ticket</span>
              </h4>
              <button 
                type="button" 
                onClick={() => setShowDraftForm(false)}
                className="p-1 rounded hover:bg-slate-200 text-slate-450"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Customer / Party Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Richard Hendricks"
                  value={draftCustomer}
                  onChange={(e) => setDraftCustomer(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Order Channel Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDraftType('dine-in')}
                    className={`py-2 text-xs font-semibold rounded-lg border ${
                      draftType === 'dine-in' 
                        ? 'bg-slate-900 border-slate-900 text-white' 
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Dine-In Table
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftType('takeaway')}
                    className={`py-2 text-xs font-semibold rounded-lg border ${
                      draftType === 'takeaway' 
                        ? 'bg-slate-900 border-slate-900 text-white' 
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Takeaway Bag
                  </button>
                </div>
              </div>

              {draftType === 'dine-in' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Assign Table Location</label>
                  <select
                    value={draftTableNum}
                    onChange={(e) => setDraftTableNum(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"
                  >
                    {['T1', 'T2', 'T3', 'T4', 'T5', 'T7', 'T8', 'T10', 'T11', 'T12'].map((tbl) => (
                      <option key={tbl} value={tbl}>Table {tbl}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Quick Menu Selection */}
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Select Dishes To Add:</span>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1 bg-white rounded-lg border border-slate-100">
                {menuItems.filter(m => m.isAvailable).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAddDraftDish(item)}
                    className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700 flex items-center space-x-1.5"
                  >
                    <span>{item.name}</span>
                    <span className="text-indigo-650 font-bold font-mono">${item.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Added Items List */}
            {draftItems.length > 0 && (
              <div className="bg-slate-100 rounded-lg p-3 space-y-1">
                <span className="block text-[9px] font-bold text-slate-500 uppercase">Selected Items Draft:</span>
                <div className="divide-y divide-slate-200">
                  {draftItems.map((item) => (
                    <div key={item.id} className="py-1.5 flex items-center justify-between text-xs">
                      <span className="text-slate-850 font-medium">{item.name} × {item.quantity}</span>
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-slate-700">${item.price * item.quantity}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveDraftDish(item.id)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Customer Meal Notes / Allergens</label>
              <input
                type="text"
                placeholder="No onions, extra hot butter, allergy checks..."
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowDraftForm(false)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-855 text-white rounded-lg text-xs font-bold"
              >
                Launch Ticket
              </button>
            </div>
          </form>
        )}

        {/* Tickets Grid list */}
        <div id="tickets-list-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-100">
              <AlertCircle className="h-7 w-7 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No active tickets found</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting state filters or search search queries.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isSelected = order.id === selectedOrderId;
              
              // Status Badge Styles
              let cardStatusColor = 'bg-slate-100 border-slate-200';
              if (order.status === 'pending') cardStatusColor = 'border-amber-400 bg-amber-50/20';
              if (order.status === 'preparing') cardStatusColor = 'border-indigo-400 bg-indigo-50/20';
              if (order.status === 'ready') cardStatusColor = 'border-teal-400 bg-teal-50/20';
              if (order.status === 'served') cardStatusColor = 'border-emerald-400 bg-emerald-50/10';

              const itemSummary = order.items.map(it => `${it.name} (${it.quantity}x)`).join(', ');

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-indigo-500 bg-white shadow-md' : 'bg-white hover:bg-slate-50'
                  } ${cardStatusColor}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{order.id}</span>
                      {order.type === 'dine-in' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
                          Table {order.tableNumber}
                        </span>
                      ) : order.type === 'takeaway' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-100">
                          Takeaway
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-750 font-bold border border-orange-100">
                          Delivery
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-[10px] font-medium">{order.timestamp}</span>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs font-bold text-slate-800">{order.customerName}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-1 leading-relaxed">{itemSummary}</p>
                  </div>

                  {order.notes && (
                    <div className="mt-2 text-[10px] text-slate-500 italic bg-slate-50 p-1.5 rounded flex items-center space-x-1 border border-slate-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="truncate">{order.notes}</span>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-100/70 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      Total: <span className="font-mono font-bold text-slate-900">${order.total}</span>
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'preparing' ? 'bg-indigo-100 text-indigo-800' :
                        order.status === 'ready' ? 'bg-teal-100 text-teal-800' :
                        order.status === 'served' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {order.status}
                      </span>

                      {/* POS Payment Status Badge */}
                      {order.paymentStatus === 'Paid' ? (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold uppercase flex items-center gap-0.5">
                          <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                          Paid
                        </span>
                      ) : (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-150 font-bold uppercase flex items-center gap-0.5 animate-fadeIn">
                          <span className="h-1 w-1 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                          Unpaid
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Ticket Details/Action Sidebar card inspector */}
      <div id="ticket-action-panel">
        {selectedOrder ? (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 sticky top-6 space-y-5">
            {/* Ticket Header card */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Active Inspector</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Ticket Details</h3>
              </div>
              <span className="text-sm font-bold text-slate-800 font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                #{selectedOrder.id.split('-')[1]}
              </span>
            </div>

            {/* Meta Table Details */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Host</span>
                <span className="font-bold text-slate-800">{selectedOrder.customerName}</span>
              </div>
              {selectedOrder.tableNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Lounge</span>
                  <span className="font-bold text-slate-800">Dining Table {selectedOrder.tableNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Service Line</span>
                <span className="font-bold text-slate-800 uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                  {selectedOrder.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Created At</span>
                <span className="font-semibold text-slate-700">{selectedOrder.timestamp}</span>
              </div>
            </div>

            {/* Inner Cart list */}
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Receipt Billing</span>
              <div className="divide-y divide-slate-150 text-xs">
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800">{it.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Quantity: {it.quantity} @ ${it.price}</p>
                    </div>
                    <span className="font-mono font-bold text-slate-700">${it.quantity * it.price}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-800">Grand Total</span>
                <span className="font-mono text-indigo-750 text-base">${selectedOrder.total}</span>
              </div>
            </div>

            {/* Kitchen Message Notes block */}
            {selectedOrder.notes && (
              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg space-y-1">
                <span className="inline-flex items-center space-x-1.5 text-[9px] font-bold text-amber-700 uppercase tracking-wider">
                  <AlertCircle className="h-3 w-3 stroke-[2.5]" />
                  <span>SPECIAL ORDER NOTES:</span>
                </span>
                <p className="text-[11px] text-slate-750 leading-relaxed font-sans">{selectedOrder.notes}</p>
              </div>
            )}

            {/* Quick Operational Commands */}
            <div className="space-y-2 pt-2">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Change Ticket State</span>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={selectedOrder.status === 'preparing'}
                  onClick={() => onUpdateOrderStatus(selectedOrder.id, 'preparing')}
                  className={`py-2 px-3 border text-center text-xs font-bold rounded-lg transition-colors ${
                    selectedOrder.status === 'preparing'
                      ? 'bg-indigo-500 border-indigo-500 text-white shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-750 border-slate-200'
                  }`}
                >
                  Cooking
                </button>
                <button
                  type="button"
                  disabled={selectedOrder.status === 'ready'}
                  onClick={() => onUpdateOrderStatus(selectedOrder.id, 'ready')}
                  className={`py-2 px-3 border text-center text-xs font-bold rounded-lg transition-colors ${
                    selectedOrder.status === 'ready'
                      ? 'bg-teal-500 border-teal-500 text-white shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-750 border-slate-200'
                  }`}
                >
                  Ready / Pack
                </button>
              </div>

              <button
                type="button"
                onClick={() => onUpdateOrderStatus(selectedOrder.id, 'served')}
                className={`w-full py-2.5 text-center text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                  selectedOrder.status === 'served'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Mark as Out / Served</span>
              </button>

              {/* Void order button */}
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'served' && (
                <button
                  type="button"
                  onClick={() => onCancelOrder(selectedOrder.id)}
                  className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-lg text-xs transition-colors border border-rose-100"
                >
                  Void/Cancel Ticket
                </button>
              )}

              {/* POS & Billing Live Linkage Panel */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">POS Register linkage</span>
                
                {selectedOrder.paymentStatus === 'Paid' ? (
                  (() => {
                    const matchedPayment = payments.find(p => p.orderId === selectedOrder.id);
                    return (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Check className="h-4 w-4 text-emerald-600 bg-emerald-100 rounded-full p-0.5" />
                          <span>Fully Paid & Settled</span>
                        </div>
                        <p className="text-[10px] text-emerald-700 block mt-0.5">
                          Invoice settled via <b>{matchedPayment?.method || 'POS Card / Cash'}</b> on {matchedPayment?.timestamp || 'terminal'}. Total paid: <b>${matchedPayment?.total || selectedOrder.total}</b>.
                        </p>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-3 bg-rose-50 border border-slate-200/50 rounded-xl space-y-3 text-xs text-rose-800">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertCircle className="h-4 w-4 text-rose-600 font-semibold" />
                        <span>Awaiting POS Payment</span>
                      </div>
                      <p className="text-[10px] text-rose-600 mt-1">
                        The kitchen has calculated a sum of <b>${selectedOrder.total}</b>. Order is waiting to be processed at the register.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onTriggerPOSCheckout(selectedOrder.id)}
                      className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>🔗 Settle/Collect Bill in POS</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400">
            Select a ticket from the left column to view receipts.
          </div>
        )}
      </div>

    </div>
  );
}
