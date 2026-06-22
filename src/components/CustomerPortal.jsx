/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  
  CheckCircle, 
  Clock, 
  Calendar, 
  
  CreditCard, 
  History, 
  LogOut, 
  Sparkles, 
  Ticket, 
  Check, 
  ChevronRight, 
  Plus, 
  Minus,
  UtensilsCrossed, 
  Smile, 
  User, 
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';


export default function CustomerPortal({
  menuItems,
  tables,
  orders,
  systemConfig,
  promoCampaigns,
  onAddOrder,
  onUpdateTableStatus,
  onSettleOrderAndTable,
  currentUser,
  onLogout
}) {
  const [activePortalTab, setActivePortalTab] = useState('menu');

  // Customer detailed state onboarding - syncs with currentUser or customizes
  const [custName, setCustName] = useState(currentUser.name);
  const [custPhone, setCustPhone] = useState('555-0199');
  const [selectedTableNum, setSelectedTableNum] = useState(''); // For Dine-In

  // --- TAB 1: MENU & CART STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [customNotes, setCustomNotes] = useState('');
  const [orderType, setOrderType] = useState('dine-in');

  // Success Feedback Toast info
  const [toastMessage, setToastMessage] = useState<(null);

  // --- TAB 2: RESERVATION STATES ---
  const [reserveTableId, setReserveTableId] = useState('');
  const [reservePartySize, setReservePartySize] = useState('2');
  const [reserveNotes, setReserveNotes] = useState('');
  const [reservationSuccessCode, setReservationSuccessCode] = useState(null);

  // --- TAB 3: ORDER STATUS & BILL SETTLE STATE ---
  const [selectedPayingOrderId, setSelectedPayingOrderId] = useState(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [appliedDiscountPct, setAppliedDiscountPct] = useState(0);
  const [billingPromoError, setBillingPromoError] = useState(null);
  const [billingPromoSuccess, setBillingPromoSuccess] = useState(null);

  // CC Input Form State
  const [ccNumber, setCcNumber] = useState('');
  const [ccExpiry, setCcExpiry] = useState('');
  const [ccCvv, setCcCvv] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [checkoutIsPaying, setCheckoutIsPaying] = useState(false);

  // Local Order History (tracking orders completed/settled by this guest)
  const [localCompletedOrders, setLocalCompletedOrders] = useState([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Filter and search menu
  const filteredMenu = useMemo(() => {
    return menuItems.filter(item => {
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [menuItems, selectedCategory, searchTerm]);

  // Cart operations
  const addToCart = (item) => {
    if (!item.isAvailable) {
      alert("This dish is temporarily sold out today!");
      return;
    }
    setCart(prev => {
      const existing = prev.find(entry => entry.menuItem.id === item.id);
      if (existing) {
        return prev.map(entry => entry.menuItem.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry);
      }
      return [...prev, { menuItem: item, qty: 1 }];
    });
    showToast(`Added ${item.name} to order bag!`);
  };

  const updateCartQty = (itemId, increment) => {
    setCart(prev => prev.map(entry => {
      if (entry.menuItem.id === itemId) {
        const newQty = increment ? entry.qty + 1 : entry.qty - 1;
        return newQty > 0 ? { ...entry, qty: newQty } : null;
      }
      return entry;
    }).filter(Boolean));
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(entry => entry.menuItem.id !== itemId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, entry) => sum + (entry.menuItem.price * entry.qty), 0);
  }, [cart]);

  // Submit Order Order
  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your order bag is empty.");
      return;
    }
    if (orderType === 'dine-in' && !selectedTableNum) {
      alert("Please specify your current Table Number for food service!");
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const generatedId = `ORD-${Math.floor(8000 + Math.random() * 1999)}`;

    const orderItemsList= cart.map(entry => ({
      id: entry.menuItem.id,
      name: entry.menuItem.name,
      quantity: entry.qty,
      price: entry.menuItem.price
    }));

    const finalOrder = {
      id: generatedId,
      tableNumber: orderType === 'dine-in' ? selectedTableNum : undefined,
      customerName: custName.trim() || 'Guest Patron',
      items: orderItemsList,
      status: 'pending',
      type: orderType,
      timestamp: timeStr,
      createdAtDate: todayStr,
      total: cartTotal,
      notes: customNotes.trim() ? customNotes.trim() : undefined,
      paymentStatus: 'Unpaid'
    };

    onAddOrder(finalOrder);
    setCart([]);
    setCustomNotes('');
    showToast(`Order ${generatedId} sent directly to the chefs' display! Tap 'Track Status' page to monitor!`);
    
    // Auto shift to track status tab
    setActivePortalTab('status');
  };

  // Handle reserve table
  const handleReserveTableSubmit = (e) => {
    e.preventDefault();
    if (!reserveTableId) {
      alert("Please select a dining table.");
      return;
    }

    const t = tables.find(tbl => tbl.id === reserveTableId);
    if (!t) return;

    if (t.status !== 'available') {
      alert("This table is currently reserved or occupied. Please select an available green table.");
      return;
    }

    onUpdateTableStatus(reserveTableId, 'reserved', 'Host Hostess', 0);
    const code = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    setReservationSuccessCode(code);
    showToast(`Table ${t.number} reserved for ${custName}! Code: ${code}`);

    // Update state to occupy table number in dine-in selection
    setSelectedTableNum(t.number);
  };

  // Dynamic calculations for Active Billing Order Checkout
  const activeUnpaidOrders = useMemo(() => {
    return orders.filter(o => {
      const matchName = o.customerName.toLowerCase() === custName.toLowerCase();
      const matchUnpaid = o.paymentStatus !== 'Paid';
      const matchNotCancelled = o.status !== 'cancelled';
      return matchName && matchUnpaid && matchNotCancelled;
    });
  }, [orders, custName]);

  const currentlyPayingOrder = useMemo(() => {
    if (!selectedPayingOrderId) {
      return activeUnpaidOrders[0] || null;
    }
    return activeUnpaidOrders.find(o => o.id === selectedPayingOrderId) || activeUnpaidOrders[0] || null;
  }, [activeUnpaidOrders, selectedPayingOrderId]);

  // Settle calculations
  const billingCalculations = useMemo(() => {
    if (!currentlyPayingOrder) return { subtotal: 0, tax: 0, service: 0, discount: 0, finalTotal: 0 };
    
    const subtotal = currentlyPayingOrder.total;
    const discount = parseFloat(((subtotal * appliedDiscountPct) / 100).toFixed(2));
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = parseFloat(((taxableAmount * systemConfig.taxRate) / 100).toFixed(2));
    const service = parseFloat(((subtotal * systemConfig.serviceChargeRate) / 100).toFixed(2));
    const finalTotal = parseFloat((taxableAmount + tax + service).toFixed(2));

    return { subtotal, tax, service, discount, finalTotal };
  }, [currentlyPayingOrder, appliedDiscountPct, systemConfig]);

  // Apply Coupon
  const handleApplyBillingPromo = () => {
    setBillingPromoError(null);
    setBillingPromoSuccess(null);
    const code = appliedPromoCode.trim().toUpperCase();

    if (!code) return;

    // Check custom campaigns
    const customCampaign = promoCampaigns.find(c => c.code.toUpperCase() === code && c.isActive);
    if (customCampaign) {
      setAppliedDiscountPct(customCampaign.discountPct);
      setBillingPromoSuccess(`Successfully applied campaign: ${customCampaign.description} (-${customCampaign.discountPct}%)`);
      return;
    }

    // Static default checks
    if (code === 'HAPPYHOUR') {
      setAppliedDiscountPct(10);
      setBillingPromoSuccess("Happy Hour Code Accepted! -10% discount on food!");
    } else if (code === 'WELCOME5') {
      setAppliedDiscountPct(5);
      setBillingPromoSuccess("Welcome treating voucher applied. -5% discount!");
    } else if (code === 'LOYALTY_TREAT_15') {
      setAppliedDiscountPct(15);
      setBillingPromoSuccess("Patrons special treaty coupon loaded! -15% off!");
    } else {
      setBillingPromoError("Voucher tag expired or invalid code. Please check Admin Configured Promos.");
      setAppliedDiscountPct(0);
    }
  };

  // Settle & checkout
  const handleCheckoutPaymentSubmit = (e) => {
    e.preventDefault();
    if (!currentlyPayingOrder) return;

    setCheckoutIsPaying(true);

    setTimeout(() => {
      const { subtotal,discount, finalTotal } = billingCalculations;
      
      const newPayment= {
        id: `TXN-${Math.floor(4000 + Math.random() * 5999)}`,
        orderId: currentlyPayingOrder.id,
        tableNumber: currentlyPayingOrder.tableNumber,
        customerName: currentlyPayingOrder.customerName,
        subtotal,
        tip: 0,
        discount,
        total: finalTotal,
        method: paymentMethod,
        status: 'Settled',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      // Call outer controller
      onSettleOrderAndTable(
        newPayment,
        currentlyPayingOrder.id,
        currentlyPayingOrder.tableNumber,
        newPayment.customerId
      );

      // Save locally in history list
      setLocalCompletedOrders(prev => [currentlyPayingOrder, ...prev]);

      // Reset
      setCheckoutIsPaying(false);
      setAppliedPromoCode('');
      setAppliedDiscountPct(0);
      setBillingPromoSuccess(null);
      setSelectedPayingOrderId(null);
      setCcNumber('');
      setCcExpiry('');
      setCcCvv('');

      showToast(`Settled Order ${currentlyPayingOrder.id} successfully! Receipt catalogued.`);
    }, 1200);
  };

  // Completed receipts list
  const receiptHistoryList = useMemo(() => {
    const historicalPays = localCompletedOrders;
    const globalPaidOrders = orders.filter(o => 
      o.customerName.toLowerCase() === custName.toLowerCase() && 
      o.paymentStatus === 'Paid'
    );
    
    // Combine and unique
    const maps = new Map();
    [...historicalPays, ...globalPaidOrders].forEach(o => {
      maps.set(o.id, o);
    });
    return Array.from(maps.values());
  }, [localCompletedOrders, orders, custName]);

  return (
    <div id="customer-portal-root" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased overflow-hidden select-none w-screen">
      
      {/* Toast Notification message */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white rounded-xl py-3 px-5 shadow-2xl border border-slate-700/50 flex items-center space-x-2.5 text-xs font-semibold animate-slideIn">
          <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shadow-sm shrink-0">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-amber-500 text-slate-950 font-extrabold rounded-lg flex items-center justify-center shadow">
            <UtensilsCrossed className="h-4.5 w-4.5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">BISTROBOARD SELF-SERVE</h1>
            <span className="block text-[9px] text-slate-400 font-mono tracking-widest uppercase">Gastronomy Patron Console</span>
          </div>
        </div>

        {/* Dynamic customer details inputs */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center space-x-1.5 bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-350">
            <User className="h-3.5 w-3.5 text-amber-500" />
            <input 
              type="text" 
              value={custName}
              onChange={(e) => setCustName(e.target.value)}
              placeholder="Your Name..."
              className="bg-transparent border-none font-bold text-slate-200 outline-none w-28 focus:w-36 transition-all focus:text-white"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-350">
            <span className="text-[10px] font-bold text-slate-400">TABLE:</span>
            <select
              value={selectedTableNum}
              onChange={(e) => setSelectedTableNum(e.target.value)}
              className="bg-transparent font-semibold border-none text-slate-200 outline-none focus:text-white cursor-pointer"
            >
              <option value="" className="text-slate-900 bg-white">None (Takeaway)</option>
              {tables.map(t => (
                <option key={t.id} value={t.number} className="text-slate-900 bg-white">
                  {t.number} {t.status === 'reserved' && t.spendAmount === 0 ? '(My Reserved)' : ''} (Cap: {t.capacity})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exit portal button */}
        <button
          onClick={onLogout}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5 text-slate-400" />
          <span>Exit to Register</span>
        </button>
      </header>

      {/* Mobiles Only Customer Profile banner */}
      <div className="block md:hidden bg-indigo-50 border-b border-indigo-150 p-3 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-indigo-600" />
            <span className="font-bold text-indigo-900">Patron:</span>
            <input 
              type="text" 
              value={custName}
              onChange={(e) => setCustName(e.target.value)}
              placeholder="Your Name..."
              className="bg-transparent border-b border-indigo-200 font-bold text-indigo-950 outline-none w-28 focus:border-indigo-600 focus:text-indigo-950"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold uppercase text-indigo-700">Seat/Table:</span>
            <select
              value={selectedTableNum}
              onChange={(e) => setSelectedTableNum(e.target.value)}
              className="bg-white border text-slate-800 font-bold rounded p-0.5 outline-none font-sans cursor-pointer text-[11px]"
            >
              <option value="">Takeaway</option>
              {tables.map(t => (
                <option key={t.id} value={t.number}>
                  {t.number} (Cap: {t.capacity})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tab Switch Controls */}
      <div className="bg-white border-b border-slate-200 shadow-sm shrink-0 select-none flex">
        {[
          { id: 'menu', label: 'Browse Gourmet Menu', count: cart.length, icon: UtensilsCrossed },
          { id: 'reserve', label: 'Seat Booking Reservation', icon: Calendar },
          { id: 'status', label: 'Order Status & Pay bill', count: activeUnpaidOrders.length, icon: Clock },
          { id: 'history', label: 'My Receipt History', count: receiptHistoryList.length, icon: History }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isActive = activePortalTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActivePortalTab(tab.id);
                setReservationSuccessCode(null);
              }}
              className={`flex-1 py-3.5 px-2 text-center text-xs font-bold transition-all border-b-2 flex items-center justify-center space-x-1.5 focus:outline-none cursor-pointer ${
                isActive 
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/20' 
                  : 'border-transparent text-slate-550 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <TabIcon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{tab.label}</span>
              {Object.prototype.hasOwnProperty.call(tab, 'count') && tab.count && (
                <span className={`px-1.5 py-0.2 min-w-4 text-[9px] rounded-full font-mono text-center font-bold leading-none ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-650 font-bold border border-slate-250'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Workspace Layout */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-slate-50">
        
        {/* TAB 1: GOURMET MENU SCREEN */}
        {activePortalTab === 'menu' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            
            {/* Menu Browse & Search Column */}
            <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
              
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                
                {/* Search Menu Bar */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search gourmet courses, fresh ingredients, appetizers..."
                    className="w-full text-xs p-2.5 pl-9 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-550 focus:border-indigo-550 font-medium text-slate-800"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>

                {/* Categories Scrollable switches */}
                <div className="flex overflow-x-auto space-x-1.5 py-1.5 scrollbar-thin select-none max-w-full shrink-0">
                  {['All', 'Appetizers', 'Mains', 'Desserts', 'Beverages', 'Sides'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-white border text-slate-650 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

              </div>

              {/* Menu listings grid */}
              <div className="flex-1 overflow-y-auto pr-1">
                {filteredMenu.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-dashed rounded-xl p-8 text-xs text-slate-400 italic">
                    <UtensilsCrossed className="h-8 w-8 text-slate-350 mx-auto mb-2" />
                    <span>No matching gourmet dishes found for "{searchTerm}". Try a different keyword.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMenu.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => addToCart(item)}
                        className={`bg-white border rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-400 cursor-pointer transition-all hover:shadow-md select-none relative ${
                          !item.isAvailable ? 'opacity-65' : ''
                        }`}
                      >
                        <div>
                          {/* Badges container */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                            {item.isPopular && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded uppercase">
                                <Sparkles className="h-2.5 w-2.5" /> Popular
                              </span>
                            )}
                          </div>

                          <span className="block text-xs font-bold text-slate-900 line-clamp-1">{item.name}</span>
                          <p className="text-[10px] text-slate-450 leading-relaxed mt-1.5 line-clamp-2">{item.description}</p>
                        </div>

                        {/* Bottom metrics */}
                        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                          <span className="font-mono text-xs font-extrabold text-slate-850">${item.price.toFixed(2)}</span>
                          
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono font-bold uppercase">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span>{item.preparationTime} mins</span>
                          </div>

                          <div>
                            {item.isAvailable ? (
                              <span className="h-6 w-6 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold transition-colors">
                                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[9px] bg-red-50 border border-red-100 text-red-700 font-bold">
                                Sold Out
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Cart Side panel column */}
            <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col overflow-hidden max-h-[350px] md:max-h-full shrink-0">
              <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShoppingBag className="h-4.5 w-4.5 text-indigo-600" />
                  Your Bag Order ({cart.reduce((s, c) => s + c.qty, 0)})
                </span>
                {cart.length > 0 && (
                  <button 
                    onClick={() => {
                      if (confirm("Reset current order cart bag?")) setCart([]);
                    }}
                    className="text-[10px] text-rose-500 font-bold hover:text-rose-700 hover:underline cursor-pointer"
                  >
                    Clear Bag
                  </button>
                )}
              </div>

              {/* Cart List Items scroll */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center py-10 text-center text-slate-400 text-xs italic">
                    <ShoppingBag className="h-8 w-8 text-slate-350 mb-2 stroke-[1.5]" />
                    <span>Your cart bag is empty.<br />Click standard menu dishes on the left to add courses.</span>
                  </div>
                ) : (
                  cart.map(entry => (
                    <div key={entry.menuItem.id} className="p-2.5 bg-slate-55 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1.5 hover:border-slate-300">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-800 leading-tight block truncate pr-2 flex-1">{entry.menuItem.name}</span>
                        <span className="font-mono font-bold text-slate-650 shrink-0">${(entry.menuItem.price * entry.qty).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-500">
                        <span className="font-mono text-slate-450">${entry.menuItem.price.toFixed(2)} each</span>
                        
                        {/* Adjust qty buttons */}
                        <div className="flex items-center space-x-1 border border-slate-200 bg-white rounded-md overflow-hidden p-0.5 shadow-sm">
                          <button 
                            type="button"
                            onClick={() => updateCartQty(entry.menuItem.id, false)}
                            className="p-1 hover:bg-slate-50 text-slate-600 cursor-pointer"
                          >
                            <Minus className="h-2.5 w-2.5 stroke-[2.5]" />
                          </button>
                          <span className="px-1.5 font-bold font-mono text-slate-800 text-[10px]">{entry.qty}</span>
                          <button 
                            type="button"
                            onClick={() => updateCartQty(entry.menuItem.id, true)}
                            className="p-1 hover:bg-slate-50 text-slate-600 cursor-pointer"
                          >
                            <Plus className="h-2.5 w-2.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Placement Form settings */}
              {cart.length > 0 && (
                <form onSubmit={handlePlaceOrderSubmit} className="p-4 border-t border-slate-100 bg-slate-50 space-y-3.5 text-xs font-semibold">
                  
                  {/* Delivery mode */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white border border-slate-220 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setOrderType('dine-in')}
                      className={`py-1 rounded font-bold text-[10px] uppercase transition-all flex items-center justify-center gap-1.5 ${
                        orderType === 'dine-in' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <UtensilsCrossed className="h-3 w-3" />
                      Dine-In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOrderType('takeaway');
                        setSelectedTableNum(''); // no table
                      }}
                      className={`py-1 rounded font-bold text-[10px] uppercase transition-all flex items-center justify-center gap-1.5 ${
                        orderType === 'takeaway' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <ShoppingBag className="h-3 w-3" />
                      Takeaway
                    </button>
                  </div>

                  {/* Cooking comment notes */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Special cooking preparations</label>
                    <input
                      type="text"
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="e.g. Mild spill, allergy warnings..."
                      className="w-full text-[11px] p-2 bg-white border border-slate-205 rounded outline-none font-medium"
                    />
                  </div>

                  {/* Calculations total */}
                  <div className="space-y-1 pt-1 font-sans text-xs">
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Food items Subtotal:</span>
                      <span className="font-mono text-slate-700">${cartTotal.toFixed(2)}</span>
                    </div>
                    {orderType === 'dine-in' && selectedTableNum && (
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Table Assignment:</span>
                        <span className="font-mono font-bold text-slate-600">{selectedTableNum}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-900 border-t border-slate-200 border-dashed pt-2 font-bold text-sm">
                      <span>Estimate Total Bill:</span>
                      <span className="font-mono text-indigo-700">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-750 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1 shadow-md shadow-indigo-600/15 cursor-pointer"
                  >
                    <span>Send Order to Kitchen</span>
                    <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                </form>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: SEAT BOOKING RESERVATION */}
        {activePortalTab === 'reserve' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto space-y-6">
            
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Bistroboard Seat Seating Reservation
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">Book an available table salon spot below. Live bookings synchronize directly to the waitstaff hostess terminal.</p>
              </div>

              {/* Success confirmation */}
              {reservationSuccessCode && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start space-x-3.5">
                  <span className="h-5 w-5 bg-emerald-600 text-white rounded-full p-0.5 justify-center items-center flex shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <div className="space-y-1">
                    <span className="block font-bold">Reservation Confirmed! Code: {reservationSuccessCode}</span>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      We've reserved the dining slot at the gourmet room salon. When putting in cart orders, Table size selection will default to this table.
                    </p>
                  </div>
                </div>
              )}

              {/* Reservation Selector configuration form */}
              <form onSubmit={handleReserveTableSubmit} className="space-y-4 text-xs font-semibold">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-extrabold">Patron Booking Name</label>
                    <input
                      type="text"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-extrabold">Contact Phone Contact</label>
                    <input
                      type="tel"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-extrabold">Assigned Party guests counts</label>
                    <select
                      value={reservePartySize}
                      onChange={(e) => setReservePartySize(e.target.value)}
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                    >
                      <option value="1">1 Person (Solo diner)</option>
                      <option value="2">2 Persons (Couple standard)</option>
                      <option value="4">4 Persons (Standard booth family)</option>
                      <option value="6">6 Persons (Premium banquet slot)</option>
                      <option value="8">8+ Large gathering reservations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-extrabold">Preferred salon spot (Select Dining Table)</label>
                    <select
                      value={reserveTableId}
                      onChange={(e) => setReserveTableId(e.target.value)}
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer bg-white text-slate-800"
                    >
                      <option value="">-- Choose available salon table spot --</option>
                      {tables.map(tbl => {
                        const cap = tbl.capacity;
                        const statusStr = tbl.status === 'available' ? '🟢 Available' : '🔴 Fully Booked';
                        const isAvailable = tbl.status === 'available';
                        return (
                          <option 
                            key={tbl.id} 
                            value={tbl.id} 
                            disabled={!isAvailable}
                          >
                            Table {tbl.number} - Size Capacity {cap} people ({statusStr})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-extrabold">Special Requests notes (window preference, booster seat, vegan setup)</label>
                  <input
                    type="text"
                    value={reserveNotes}
                    onChange={(e) => setReserveNotes(e.target.value)}
                    placeholder="e.g. VIP guest celebration setup, quiet back booth..."
                    className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-750 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center space-x-2 transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
                  >
                    <Calendar className="h-4.5 w-4.5" />
                    <span>Lock Table Reservation Booking</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Render direct seating layout cards */}
            <div className="space-y-3">
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">Live Dining Salon Floorplan status</span>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {tables.map(tbl => {
                  const isReservable = tbl.status === 'available';
                  return (
                    <div 
                      key={tbl.id} 
                      onClick={() => isReservable && setReserveTableId(tbl.id)}
                      className={`p-3.5 border rounded-2xl cursor-pointer text-xs select-none transition-all ${
                        tbl.status === 'available' 
                          ? 'bg-emerald-50 border-emerald-150 text-emerald-800 hover:scale-[1.02] hover:shadow-sm' 
                          : tbl.status === 'reserved' 
                          ? 'bg-pink-55 bg-pink-50 border-pink-150 text-pink-700 opacity-80 cursor-not-allowed'
                          : 'bg-slate-100 border-slate-200 text-slate-500 opacity-65 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold font-mono text-sm">Table {tbl.number}</span>
                        {tbl.status === 'available' ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        ) : null}
                      </div>
                      <span className="block text-[10px] text-slate-500">Cap: {tbl.capacity} People</span>
                      <span className={`block text-[9px] font-bold uppercase tracking-wider mt-2 ${
                        tbl.status === 'available' ? 'text-emerald-700' :
                        tbl.status === 'reserved' ? 'text-pink-600' : 'text-slate-500'
                      }`}>
                        {tbl.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ORDER STATUS & PAY BILL */}
        {activePortalTab === 'status' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto space-y-6">
            
            {activeUnpaidOrders.length === 0 ? (
              <div className="p-8 text-center bg-white border border-dashed rounded-xl py-16 text-slate-400 text-xs italic space-y-3">
                <Smile className="h-10 w-10 text-indigo-500/80 mx-auto animate-bounce" />
                <div>
                  <span className="block font-bold text-slate-700 not-italic">No active culinary orders placed for patron name "{custName}"</span>
                  <span className="block text-[10.5px] text-slate-450 mt-1">Place an order first inside 'Browse Gourmet Menu' screen!</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Active Orders Tracker (Left col) */}
                <div className="lg:col-span-7 space-y-4">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">Interactive Kitchen Dispatch Monitor ({activeUnpaidOrders.length})</span>
                  
                  {activeUnpaidOrders.map(order => {
                    const isSelected = currentlyPayingOrder?.id === order.id;
                    return (
                      <div 
                        key={order.id} 
                        onClick={() => setSelectedPayingOrderId(order.id)}
                        className={`p-4 bg-white border rounded-2xl cursor-pointer hover:border-slate-350 transition-all text-xs relative ${
                          isSelected ? 'ring-2 ring-indigo-500/25 border-indigo-400' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900 text-sm">{order.id}</span>
                              <span className={`px-1.5 py-0.2 bg-indigo-50 text-indigo-700 font-extrabold text-[9px] rounded uppercase ${
                                order.type === 'takeaway' ? 'bg-amber-50 text-amber-700' : ''
                              }`}>
                                {order.type} {order.tableNumber ? `• ${order.tableNumber}` : ''}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{order.timestamp} today</span>
                          </div>

                          <div className="text-right">
                            <span className="block text-xs font-extrabold text-slate-800 font-mono">${order.total.toFixed(2)}</span>
                            <span className="text-[9px] text-slate-400 block font-bold">Unpaid Billing status</span>
                          </div>
                   -     </div>

                        {/* Line items mini table */}
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 space-y-1 my-3">
                          {order.items.map(entry => (
                            <div key={entry.id} className="flex justify-between text-[11px] text-slate-600 font-medium">
                              <span>{entry.name} <span className="text-[10px] text-slate-400 font-mono">x{entry.quantity}</span></span>
                              <span className="font-mono font-bold text-slate-700">${(entry.price * entry.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Unified Stepper preparation tracking UI */}
                        <div className="pt-2 border-t border-slate-50">
                          <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-extrabold mb-3 select-none">Chefs Dispatch Progress</span>
                          
                          <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                            {[
                              { label: 'Pending Queue', active: true, done: order.status !== 'pending' },
                              { label: 'Cooking Prep', active: order.status === 'preparing' || order.status === 'ready' || order.status === 'served', done: order.status === 'ready' || order.status === 'served' },
                              { label: 'Kitchen Ready', active: order.status === 'ready' || order.status === 'served', done: order.status === 'served' },
                              { label: 'Served / Settle', active: order.status === 'served', done: false }
                            ].map((step, idx) => {
                              return (
                                <div key={idx} className="space-y-1.5">
                                  <div className={`h-1.5 rounded-full transition-colors ${
                                    step.done 
                                      ? 'bg-emerald-500' 
                                      : step.active 
                                      ? 'bg-indigo-500 animate-pulse' 
                                      : 'bg-slate-200'
                                  }`} />
                                  <span className={`block font-semibold leading-none truncate text-[9px] ${
                                    step.done ? 'text-emerald-600' : step.active ? 'text-indigo-600' : 'text-slate-400'
                                  }`}>{step.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Settle and Place Payment Panel (Right col) */}
                <div className="lg:col-span-5 bg-white border border-slate-150 rounded-2xl shadow p-5 space-y-4">
                  
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <CreditCard className="h-4.5 w-4.5 text-indigo-600" />
                      Digital checkout & secure online payment
                    </h4>
                    <p className="text-[11px] text-slate-550 mt-1">Complete your contactless cashier clearance. Directly settle diner totals.</p>
                  </div>

                  {currentlyPayingOrder ? (
                    <div className="space-y-4">
                      
                      {/* Active Order Reference info */}
                      <div className="p-3 bg-indigo-50/55 rounded-xl border border-indigo-100 flex justify-between items-center text-xs">
                        <div>
                          <span className="block font-bold text-slate-800">Selected Ticket: <span className="font-mono text-indigo-700">{currentlyPayingOrder.id}</span></span>
                          <span className="block text-[10px] text-slate-450 mt-0.5">Dine-in floor seat {currentlyPayingOrder.tableNumber || 'Takeout'}</span>
                        </div>
                        <span className="font-mono font-bold text-indigo-800 bg-white border border-indigo-200 px-2.5 py-1 rounded-md text-xs shadow-sm">${currentlyPayingOrder.total.toFixed(2)}</span>
                      </div>

                      {/* Promo voucher application code input */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">Active CRM promotional voucher code</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={appliedPromoCode}
                            onChange={(e) => setAppliedPromoCode(e.target.value.toUpperCase())}
                            placeholder="Try 'WELCOME5', 'HAPPYHOUR', or custom promos"
                            className="w-full text-xs p-2 border border-slate-205 rounded outline-none uppercase font-bold"
                          />
                          <button
                            type="button"
                            onClick={handleApplyBillingPromo}
                            className="bg-slate-905 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs px-3.5 transition-all cursor-pointer shadow-sm text-center"
                          >
                            Apply
                          </button>
                        </div>
                        
                        {billingPromoError && (
                          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            <span>{billingPromoError}</span>
                          </div>
                        )}
                        {billingPromoSuccess && (
                          <div className="p-2.5 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-lg text-xs flex items-start gap-1.5 font-bold">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600" />
                            <span>{billingPromoSuccess}</span>
                          </div>
                        )}
                      </div>

                      {/* Receipt Invoice total breakdown */}
                      <div className="border border-slate-100 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700 select-all font-medium">
                        
                        <div className="flex justify-between">
                          <span>Culinary Items Subtotal:</span>
                          <span className="font-mono text-slate-800">${billingCalculations.subtotal.toFixed(2)}</span>
                        </div>
                        
                        {billingCalculations.discount > 0 && (
                          <div className="flex justify-between text-emerald-600 font-bold">
                            <span>Voucher applied Discount:</span>
                            <span className="font-mono">-${billingCalculations.discount.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span>Federal VAT Tax fee ({systemConfig.taxRate}%):</span>
                          <span className="font-mono text-slate-800">${billingCalculations.tax.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Automatic Service Gratuity ({systemConfig.serviceChargeRate}%):</span>
                          <span className="font-mono text-slate-800">${billingCalculations.service.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-slate-950 font-bold text-[13px] border-t border-slate-200/60 border-dashed pt-2.5 mt-2 select-all">
                          <span>Grand Total settled Billing:</span>
                          <span className="font-mono text-indigo-700">${billingCalculations.finalTotal.toFixed(2)}</span>
                        </div>

                      </div>

                      {/* Online Payment form */}
                      <form onSubmit={handleCheckoutPaymentSubmit} className="space-y-3.5 text-xs font-semibold">
                        
                        {/* Selector Payment Mode */}
                        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-50 border border-slate-205 rounded-lg select-none">
                          {[
                            { id: 'Card', label: 'Swipe CC' },
                            { id: 'Mobile', label: 'Wallet NFC' },
                            { id: 'Points', label: 'Loyalty Pt' }
                          ].map(mode => (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => setPaymentMethod(mode.id)}
                              className={`py-1 rounded font-bold text-[10px] uppercase transition-all ${
                                paymentMethod === mode.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              {mode.label}
                            </button>
                          ))}
                        </div>

                        {paymentMethod === 'Card' && (
                          <div className="space-y-2.5">
                            <div>
                              <label className="block text-[9px] uppercase tracking-widest text-slate-400 font-extrabold mb-1">Contactless Credit Card Number</label>
                              <input
                                type="text"
                                required
                                value={ccNumber}
                                onChange={(e) => setCcNumber(e.target.value)}
                                placeholder="4000 1234 5678 9010"
                                className="w-full text-xs p-2 bg-white border border-slate-205 rounded outline-none font-mono"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-slate-400 font-extrabold mb-1">Expiration date</label>
                                <input
                                  type="text"
                                  required
                                  value={ccExpiry}
                                  onChange={(e) => setCcExpiry(e.target.value)}
                                  placeholder="09 / 28"
                                  className="w-full text-xs p-2 bg-white border border-slate-205 rounded outline-none font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-widest text-slate-400 font-extrabold mb-1">Security code CVV</label>
                                <input
                                  type="password"
                                  required
                                  value={ccCvv}
                                  onChange={(e) => setCcCvv(e.target.value)}
                                  maxLength={4}
                                  placeholder="•••"
                                  className="w-full text-xs p-2 bg-white border border-slate-205 rounded outline-none font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'Mobile' && (
                          <div className="p-3 bg-amber-50 text-amber-950 font-bold rounded-xl flex items-start gap-2 border border-amber-100">
                            <Smartphone className="h-4.5 w-4.5 shrink-0 text-amber-600 animate-bounce" />
                            <p className="text-[10.5px] leading-relaxed">
                              Apple Pay / Google Pay Contactless Ready link configured. Placing order checkout automatically sends NFC token keys.
                            </p>
                          </div>
                        )}

                        {paymentMethod === 'Points' && (
                          <div className="p-3 bg-emerald-55 bg-emerald-50 text-emerald-950 font-bold rounded-xl flex items-start gap-2 border border-emerald-110">
                            <Ticket className="h-4.5 w-4.5 shrink-0 text-emerald-600 animate-pulse" />
                            <p className="text-[10.5px] leading-relaxed">
                              Points balance verified: <span className="font-mono text-emerald-700">3,450 treatment points</span> available. Checkout uses 1 Point = $0.10.
                            </p>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={checkoutIsPaying}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-755 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/15 cursor-pointer disabled:opacity-70"
                        >
                          {checkoutIsPaying ? (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                              Processing online gateway transaction...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4.5 w-4.5" />
                              <span>Authorize Contactless Settle Pay (${billingCalculations.finalTotal.toFixed(2)})</span>
                            </>
                          )}
                        </button>
                      </form>

                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 italic">
                      Choose an unpaid culinary order ticket reference on the left to initialize digital payment billing totals.
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 4: MY RECEIPT HISTORY */}
        {activePortalTab === 'history' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-600" />
                Diner receipt ledgers history
              </h3>
              <p className="text-xs text-slate-500">Secure record of completed cashier clearances, paid totals, and dynamic dine-in table release receipts.</p>
            </div>

            {receiptHistoryList.length === 0 ? (
              <div className="p-8 text-center bg-white border border-dashed rounded-xl py-12 text-slate-400 text-xs italic">
                No archived paid invoices catalogued for patron name "{custName}" yet. Make online payments to log bills.
              </div>
            ) : (
              <div className="space-y-3.5 pt-2">
                {receiptHistoryList.map(receipt => (
                  <div key={receipt.id} className="bg-white border rounded-2xl p-4.5 text-xs text-slate-700 space-y-3 hover:border-slate-350 transition-all shadow-sm">
                    
                    <div className="flex justify-between items-start border-b border-slate-50 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono">Invoice Receipt ID: {receipt.id}</span>
                          <span className="px-2 py-0.2 bg-emerald-50 text-emerald-700 font-bold text-[9px] rounded uppercase border border-emerald-100 flex items-center gap-0.5">
                            <Check className="h-3 w-3 stroke-[2.5]" /> Settle Paid
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Placed on {receipt.createdAtDate || new Date().toISOString().slice(0, 10)}</span>
                      </div>

                      <div className="text-right">
                        <span className="block font-bold font-mono text-slate-900 text-xs">${receipt.total.toFixed(2)}</span>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mt-0.5">{receipt.tableNumber ? `Dine-In • Table ${receipt.tableNumber}` : 'Takeout Clearance'}</span>
                      </div>
                    </div>

                    {/* Receipt breakdown listings */}
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-slate-650">
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1 border-b pb-1">Line-Items Ordered</span>
                      {receipt.items.map(entry => (
                        <div key={entry.id} className="flex justify-between text-[11px] font-medium">
                          <span>{entry.name} <span className="text-[10px] text-slate-400 font-mono">x{entry.quantity}</span></span>
                          <span className="font-mono font-bold text-slate-700">${(entry.price * entry.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-slate-900 font-extrabold text-xs pt-1.5 border-t border-slate-200/50 border-dashed mt-1.5 select-all">
                        <span>Total Paid sum:</span>
                        <span className="font-mono text-indigo-700">${receipt.total.toFixed(2)}</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
