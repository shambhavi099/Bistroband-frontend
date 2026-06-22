/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  Coins, 
  Smartphone, 
  Sparkles, 
  Check, 
  Search, 

  Gift, 
 
  Printer, 
  Receipt,
  Percent,
  TrendingUp,
  Award,
} from 'lucide-react';


export default function PaymentsView({
  orders,
  tables,
  customers,
  payments,
 
  onSettleOrderAndTable,
  posCheckoutOrderId,
  posCheckoutTableNumber,
  onClearPOSCheckoutLink,
  promoCampaigns = []
}) {
  // Active states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethodFilter, setSelectedMethodFilter] = useState('all');
  
  // Selection block for Terminal POS billing
  const [selectedBillType, setSelectedBillType] = useState('order');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedTableNumber, setSelectedTableNumber] = useState('');
  
  // Custom sale input state
  const [customDescription, setCustomDescription] = useState('Bespoke Bistro Event');
  const [customAmount, setCustomAmount] = useState('50.00');

  // Associated Customer Profile for loyalty benefits
  const [associatedCustomerId, setAssociatedCustomerId] = useState('');

  // POS modifiers
  const [tipPercentage, setTipPercentage] = useState(15);
  const [customTip, setCustomTip] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoDiscountPct, setPromoDiscountPct] = useState(0);
  
  // Active Terminal simulation triggers
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [successMessage, setSuccessMessage] = useState("");

  // Link status notice
  const [linkedNotice, setLinkedNotice] = useState("");

  // Filter Outstanding Items
  const outstandingOrders = orders.filter(o => o.status !== 'served' && o.status !== 'cancelled');
  const outstandingTables = tables.filter(t => t.status === 'billing' || (t.status === 'occupied' && (t.spendAmount ?? 0) > 0));

  // Sync linking triggers from KDS or Tables view
  useEffect(() => {
    let linkTimeout;

    if (posCheckoutOrderId) {
      linkTimeout = window.setTimeout(() => {
        setSelectedBillType("order");
        setSelectedOrderId(posCheckoutOrderId);

        const currentOrder = orders.find(
          (o) => o.id === posCheckoutOrderId
        );

        if (currentOrder) {
          setLinkedNotice(
            `Kitchen Display pre-filled Ticket: ${posCheckoutOrderId} (Customer: ${currentOrder.customerName}, Subtotal: $${currentOrder.totalAmount})`
          );

          // Auto-link CRM Customer
          const potentialCustomer = customers.find(
            (c) =>
              c.name.toLowerCase() ===
              currentOrder.customerName.toLowerCase()
          );

          if (potentialCustomer) {
            setAssociatedCustomerId(potentialCustomer.id);
          }
        }

        onClearPOSCheckoutLink?.();
      }, 0);
    } else if (posCheckoutTableNumber) {
      linkTimeout = window.setTimeout(() => {
        setSelectedBillType("table");
        setSelectedTableNumber(posCheckoutTableNumber);

        const matchedTable = tables.find(
          (t) => t.number === posCheckoutTableNumber
        );

        const activeBillSum =
          matchedTable?.spendAmount ?? 0;

        setLinkedNotice(
          `Kitchen Display pre-filled Seating Layout: Table ${posCheckoutTableNumber} (Active spend: $${activeBillSum})`
        );

        onClearPOSCheckoutLink?.();
      }, 0);
    }

    return () => {
      window.clearTimeout(linkTimeout);
    };
  }, [
    posCheckoutOrderId,
    posCheckoutTableNumber,
    orders,
    customers,
    tables,
    onClearPOSCheckoutLink,
  ]);
  // Auto-fill states based on first available outstanding items
  useEffect(() => {
    let orderTimeout;
    let tableTimeout;

    if (outstandingOrders.length > 0 && !selectedOrderId) {
      const firstOrderId = outstandingOrders[0].id;
      orderTimeout = window.setTimeout(() => {
        setSelectedOrderId(firstOrderId);
      }, 0);
    }

    if (outstandingTables.length > 0 && !selectedTableNumber) {
      const firstTableNumber = outstandingTables[0].number;
      tableTimeout = window.setTimeout(() => {
        setSelectedTableNumber(firstTableNumber);
      }, 0);
    }

    return () => {
      clearTimeout(orderTimeout);
      clearTimeout(tableTimeout);
    };
  }, [
    outstandingOrders,
    outstandingTables,
    selectedOrderId,
    selectedTableNumber
  ]);

  // Compute Active Subtotal
  const getSubtotal = () => {
    if (selectedBillType === 'order') {
      const order = orders.find(o => o.id === selectedOrderId);
      return Number(order?.totalAmount ?? 0); 
    } else if (selectedBillType === 'table') {
      const table = tables.find(t => t.number === selectedTableNumber);
      return Number(table?.spendAmount ?? 0);
    } else {
      return parseFloat(customAmount) || 0;
    }
  };

  // Determine connected customer and loyalty eligibility
  const getCustomerAssociation = () => {
    // If explicitly chosen
    if (associatedCustomerId) {
      return customers.find(c => c.id === associatedCustomerId);
    }
    // Else check if chosen order matches a registered patron
    if (selectedBillType === 'order') {
      const currentOrder = orders.find(o => o.id === selectedOrderId);
      if (currentOrder) {
        return customers.find(c => c.name.toLowerCase() === currentOrder.customerName.toLowerCase());
      }
    }
    return undefined;
  };

  const associatedCustomer = getCustomerAssociation();

  // Tier Discount logic
  const getTierDiscountPct = (tier) => {
    switch (tier) {
      case 'VIP': return 15; // 15% off
      case 'Local': return 10; // 10% off
      case 'Regular': return 5;  // 5% off
      default: return 0;
    }
  };

  const tierDiscountPct = associatedCustomer ? getTierDiscountPct(associatedCustomer.tier) : 0;

  // Total discounts combined
  const totalDiscountPct = Math.min(100, tierDiscountPct + promoDiscountPct);

  console.log(
  orders.find(o => o.id === selectedOrderId)
);

  // Calculations
  const subtotalVal = getSubtotal();
  const discountVal = parseFloat(((subtotalVal * totalDiscountPct) / 100).toFixed(2));
  
  const getTipAmount = () => {
    if (tipPercentage === -1) {
      return parseFloat(customTip) || 0;
    }
    return parseFloat(((subtotalVal - discountVal) * tipPercentage / 100).toFixed(2));
  };
  const tipVal = getTipAmount();
  const totalVal = Math.max(0, subtotalVal - discountVal + tipVal);

  // Run Promo Code
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    
    // Check in dynamic campaigns
    const activeCampaign = promoCampaigns.find(c => c.code.toUpperCase() === code && c.isActive);
    
    if (activeCampaign) {
      setAppliedPromo(activeCampaign.code);
      setPromoDiscountPct(activeCampaign.discountPct);
      setPromoCode('');
    } else if (code === 'HAPPYHOUR') {
      setAppliedPromo('HAPPYHOUR');
      setPromoDiscountPct(10);
      setPromoCode('');
    } else if (code === 'LOYALTY_TREAT_15%' || code === 'LOYALTY_TREAT_15') {
      setAppliedPromo('LOYALTY_TREAT_15%');
      setPromoDiscountPct(15);
      setPromoCode('');
    } else if (code === 'WELCOME5') {
      setAppliedPromo('WELCOME5');
      setPromoDiscountPct(5);
      setPromoCode('');
    } else {
      const dynamicCodesList = promoCampaigns.filter(c => c.isActive).map(c => `'${c.code}'`).join(', ');
      const extraHint = dynamicCodesList ? `, or dynamic campaigns: ${dynamicCodesList}` : '';
      alert(`Invalid promotional campaign code. Try 'HAPPYHOUR', 'WELCOME5'${extraHint}.`);
    }
  };

  // Clear promo code
  const handleRemovePromo = () => {
    setAppliedPromo('');
    setPromoDiscountPct(0);
  };

  // Settle current bill simulator
  const handleSettleSubmit = async (e) => {
    e.preventDefault();
    if (subtotalVal <= 0) {
      alert("Bill cumulative sum must be positive to clear.");
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Validating active ticket credentials...');

    setTimeout(() => {
      setProcessingStep(paymentMethod === 'Card' ? 'Channelling merchant card processor...' :
                        paymentMethod === 'Mobile' ? 'Negotiating smart tap token auth...' :
                        paymentMethod === 'Points' ? 'Checking credit points reserves...' :
                        'Verifying paper tender cash integrity...');
      
      setTimeout(() => {
        setProcessingStep('Recording financial ledger coordinates...');
        
        setTimeout(async () => {
          // Finalize ledger values
          const newTxnId = `TXN-${Math.floor(8410 + Math.random() * 950)}`;
          const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
          
          let resolvedCustomerName = 'Walk-In Guest';
          if (associatedCustomer) {
            resolvedCustomerName = associatedCustomer.name;
          } else if (selectedBillType === 'order') {
            const currentOrder = orders.find(o => o.id === selectedOrderId);
            if (currentOrder) resolvedCustomerName = currentOrder.customerName;
          }

          const targetPayment= {
            id: newTxnId,
            orderId: selectedBillType === 'order' ? selectedOrderId : undefined,
            tableNumber: selectedBillType === 'table' ? selectedTableNumber : (selectedBillType === 'order' ? orders.find(o => o.id === selectedOrderId)?.tableNumber : undefined),
            customerName: resolvedCustomerName,
            customerId: associatedCustomer?.id,
            subtotal: subtotalVal,
            tip: tipVal,
            discount: discountVal,
            total: parseFloat(totalVal.toFixed(2)),
            method: paymentMethod,
            status: 'Settled',
            timestamp: todayDate + " " + timeStr
          };

          // Execute cascade
          await onSettleOrderAndTable(targetPayment);

          setIsProcessing(false);
          setProcessingStep('');
          setSuccessMessage(`POS Settle Succeeded! Setteled invoice ${newTxnId} totaling $${totalVal.toFixed(2)} with ${paymentMethod}.`);
          
          // Clear successful modifiers
          setCustomAmount('50.00');
          setPromoCode('');
          setAppliedPromo('');
          setPromoDiscountPct(0);
          setTipPercentage(15);
          setCustomTip('');
          setAssociatedCustomerId('');

          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);

        }, 1000);
      }, 1000);
    }, 1000);
  };

  // Past payments ledger filter
  const filteredPayments = payments.filter(pay => {
    if (selectedMethodFilter !== 'all' && pay.method !== selectedMethodFilter) return false;
    
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const inId = pay.id.toLowerCase().includes(q);
      const inName = pay.customerName.toLowerCase().includes(q);
      const inTbl = pay.tableNumber && pay.tableNumber.toLowerCase().includes(q);
      return inId || inName || inTbl;
    }
    return true;
  });

  // Analytics for headers
  const totalSettledRevenue = payments
    .filter(p => p.status === 'Settled')
    .reduce((sum, p) => sum + p.total, 0);
  
  const totalTipsRaised = payments
    .filter(p => p.status === 'Settled')
    .reduce((sum, p) => sum + p.tip, 0);

  const totalDiscountsGiven = payments
    .filter(p => p.status === 'Settled')
    .reduce((sum, p) => sum + p.discount, 0);

  const settledTxnVolume = payments.filter(p => p.status === 'Settled').length;

   
  
  return (
    <div id="payments-view-root" className="space-y-6">
      
      {/* Top Ledger Financial Stats Card Tiles */}
      <div id="payments-finance-metric-grid" className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white border p-4.5 rounded-2xl flex items-center space-x-4 border-slate-100 shadow-sm">
          <div className="p-2.5 bg-emerald-50 rounded-xl shrink-0">
            <DollarSign className="h-5.5 w-5.5 text-emerald-600" />
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-400 font-bold leading-tight">Settled Sales</span>
            <span className="text-base font-bold font-mono text-slate-900">${totalSettledRevenue.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</span>
          </div>
        </div>

        <div className="bg-white border p-4.5 rounded-2xl flex items-center space-x-4 border-slate-100 shadow-sm">
          <div className="p-2.5 bg-amber-50 rounded-xl shrink-0">
            <Award className="h-5.5 w-5.5 text-amber-600" />
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-400 font-bold leading-tight">Gratuity & Tips</span>
            <span className="text-base font-bold font-mono text-slate-900">${totalTipsRaised.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
        </div>

        <div className="bg-white border p-4.5 rounded-2xl flex items-center space-x-4 border-slate-100 shadow-sm">
          <div className="p-2.5 bg-rose-50 rounded-xl shrink-0">
            <Percent className="h-5.5 w-5.5 text-rose-600" />
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-400 font-bold leading-tight font-sans">Loyalty Savings</span>
            <span className="text-base font-bold font-mono text-slate-900">${totalDiscountsGiven.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white border p-4.5 rounded-2xl flex items-center space-x-4 border-slate-100 shadow-sm">
          <div className="p-2.5 bg-indigo-50 rounded-xl shrink-0">
            <TrendingUp className="h-5.5 w-5.5 text-indigo-600" />
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-400 font-bold leading-tight">Paid Tickets count</span>
            <span className="text-base font-bold font-mono text-slate-900">{settledTxnVolume} Clear Transactions</span>
          </div>
        </div>
      </div>

      {/* Success Banner alert */}
      {successMessage && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold animate-slideIn">
          <span className="flex items-center gap-2">
            <Check className="h-4.5 w-4.5 bg-white/20 rounded-full p-0.5" />
            {successMessage}
          </span>
          <button onClick={() => setSuccessMessage(null)} className="text-white hover:text-emerald-100 text-xs">Dismiss</button>
        </div>
      )}

      {/* KDS Preloaded Link Notice */}
      {linkedNotice && (
        <div className="bg-indigo-50 border border-indigo-150 text-indigo-950 p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold animate-slideIn">
          <span className="flex items-center gap-2">
            <CreditCard className="h-4.5 w-4.5 text-indigo-600 animate-pulse shrink-0" />
            <span>{linkedNotice}</span>
          </span>
          <button onClick={() => setLinkedNotice(null)} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-100/55 transition-colors">Dismiss</button>
        </div>
      )}

      {/* Split layout: POS Emulator (Right/Left dynamic layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: POS Configuration Board (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden flex flex-col justify-between">
          
          <div className="space-y-6">
            <div className="border-b border-slate-50 pb-4 flex justify-between items-center bg-slate-50/50 p-4 -mx-6 -mt-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="h-4.5 w-4.5 text-amber-500" />
                  Bistroboard POS Physical Terminal Emulator
                </h3>
                <p className="text-[11px] text-slate-550 mt-0.5">Charge tables, apply priority discounts & reward priority customer points</p>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase bg-slate-200 border border-slate-300 px-2.5 py-0.5 rounded-full select-none font-bold">TERMINAL ONLINE</span>
            </div>

            {/* Bill Source Selection Switch */}
            <div className="space-y-2.5">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type of Billing Item</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'order', label: 'By Active Ticket', desc: `${outstandingOrders.length} outstanding orders` },
                  { id: 'table', label: 'By Table Location', desc: `${outstandingTables.length} active tables` },
                  { id: 'custom', label: 'By Bespoke Charge', desc: 'Pre-set custom sum event' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedBillType(opt.id );
                    }}
                    className={`p-3 text-left border rounded-xl transition-all ${
                      selectedBillType === opt.id 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-xs font-bold">{opt.label}</span>
                    <span className={`block text-[9px] mt-0.5 font-medium ${selectedBillType === opt.id ? 'text-slate-300' : 'text-slate-400'}`}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Sourcing inputs */}
            <div className="bg-slate-50/50 p-4 border rounded-xl border-slate-100 p-4.5">
              
              {selectedBillType === 'order' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Active Ticket Reference</label>
                    {outstandingOrders.length === 0 ? (
                      <span className="block text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-100 font-semibold italic">No outstanding kitchen orders requiring payout.</span>
                    ) : (
                      <select
                        value={selectedOrderId}
                        onChange={(e) => setSelectedOrderId(e.target.value)}
                        className="w-full text-xs p-2.5 border bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        {outstandingOrders.map(o => (
                          <option key={o.id} value={o.id}>
                            {o.id} — {o.customerName} ({o.tableNumber ? `Table ${o.tableNumber}` : 'Takeaway/Deliv'}) : ${o.totalAmount}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5 label-info">Receipt Items Breakdown</span>
                    <div className="text-xs text-slate-600 max-h-16 overflow-y-auto bg-white p-2 rounded border border-slate-100 space-y-1">
                      {(() => {
                        const ord = orders.find(o => o.id === selectedOrderId);
                        if (!ord) return <span className="text-slate-400 italic">No bill selected</span>;
                        return ord.items.map((it, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{it.name} <span className="text-slate-400">({it.quantity}x)</span></span>
                            <span className="font-mono font-bold">${it.price * it.quantity}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {selectedBillType === 'table' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Occupied Dining Table</label>
                    {outstandingTables.length === 0 ? (
                      <span className="block text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-100 font-semibold italic">No active dining tables require immediate checkout receipts.</span>
                    ) : (
                      <select
                        value={selectedTableNumber}
                        onChange={(e) => setSelectedTableNumber(e.target.value)}
                        className="w-full text-xs p-2.5 border bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-550"
                      >
                        {outstandingTables.map(t => (
                          <option key={t.id} value={t.number}>
                            Table {t.number} — {t.assignedStaffName || 'Jessica'} handler : ${t.spendAmount} (Status: {t.status})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="text-xs border-l border-slate-200 pl-4 space-y-1 justify-center flex flex-col">
                    {(() => {
                      const tb = tables.find(t => t.number === selectedTableNumber);
                      if (!tb) return <span className="text-slate-400 italic">No table details selected</span>;
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Lounge Server:</span>
                            <span className="font-bold text-slate-800">{tb.assignedStaffName || 'General Staff'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Table Capacity:</span>
                            <span className="font-bold text-slate-800">{tb.capacity} Pax maximum</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Service Area Status:</span>
                            <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.2 select-none uppercase text-[9px]">{tb.status}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {selectedBillType === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Charge event Details</label>
                    <input
                      type="text"
                      placeholder="e.g. VIP Catering Dinner"
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      className="w-full p-2.5 border bg-white rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Custom Amount ($)</label>
                    <input
                      type="number"
                      placeholder="50.00"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full p-2.5 border bg-white rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono font-bold"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Associate CRM Loyalty Customer */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Link CRM Registered Patron</span>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-bold">Auto Loyalty Point Accrual</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={associatedCustomerId}
                  onChange={(e) => setAssociatedCustomerId(e.target.value)}
                  className="w-full text-xs p-2.5 border bg-white rounded-lg focus:outline-none"
                >
                  <option value="">-- Generic/Walk-In Guest (No Loyalty) --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.tier} — {c.totalVisits} visits, Spend: ${c.totalSpent})
                    </option>
                  ))}
                </select>

                {/* Loyalty Tier Discount Display Card */}
                {associatedCustomer ? (
                  <div className="p-3 bg-indigo-50/50 border border-indigo-150 rounded-xl flex items-center space-x-3 text-xs">
                    <div className="p-2 bg-indigo-100 rounded-lg shrink-0">
                      <Award className="h-4.5 w-4.5 text-indigo-650 text-indigo-600" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-800 leading-none">
                        Priority Level: {associatedCustomer.tier} Patron
                      </span>
                      <span className="text-[10px] text-indigo-700 block mt-1 font-semibold">
                        ⭐ Auto-applying <b>{tierDiscountPct}%</b> loyalty discount.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200/55 rounded-xl flex items-center text-xs text-slate-400 italic">
                    No Customer connected. No automatic priority loyalty discounts active.
                  </div>
                )}
              </div>
            </div>

            {/* Gratuity / Tips Options */}
            <div className="space-y-3">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bistro Gratuity (Tip Payer)</span>
              <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
                {[
                  { value: 0, label: '0%' },
                  { value: 10, label: '10%' },
                  { value: 15, label: '15%' },
                  { value: 18, label: '18%' },
                  { value: 20, label: '20%' },
                  { value: -1, label: 'Custom' }
                ].map((pct, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTipPercentage(pct.value);
                    }}
                    className={`py-2 text-center text-xs border rounded-lg transition-all font-semibold ${
                      tipPercentage === pct.value 
                        ? 'bg-amber-550 bg-amber-500 border-amber-500 text-white font-bold' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    {pct.label}
                  </button>
                ))}
                
                {/* Custom tip input field */}
                {tipPercentage === -1 && (
                  <div className="col-span-2 md:col-span-6 flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="Custom tip amount ($)"
                        value={customTip}
                        onChange={(e) => setCustomTip(e.target.value)}
                        className="w-full text-xs p-2 border rounded-lg pl-6 font-mono font-bold"
                      />
                      <span className="absolute left-2 text-slate-400 text-xs top-2.5">$</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coupon Promo Entry and Payment Method selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Promo code entry */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Manual CRM Campaign Code</label>
                
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-xs font-semibold">
                    <span>Applied: <b>{appliedPromo}</b> (-{promoDiscountPct}%)</span>
                    <button type="button" onClick={handleRemovePromo} className="text-[10px] text-red-500 hover:text-red-700 font-bold ml-2">Remove</button>
                  </div>
                ) : (
                  <div className="flex space-x-1.5">
                    <input
                      type="text"
                      placeholder="e.g. HAPPYHOUR, WELCOME5"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg text-xs bg-white text-slate-800 focus:outline-none uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3 py-2 bg-slate-900 text-white font-bold rounded-lg text-xs"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Primary Tender Method</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'Card', label: 'Credit Card', icon: CreditCard },
                    { id: 'Cash', label: 'Paper Cash', icon: Coins },
                    { id: 'Mobile', label: 'Mobile Pay', icon: Smartphone },
                    { id: 'Points', label: 'Loyalty Points', icon: Sparkles }
                  ].map(m => {
                    const MethodIcon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id )}
                        className={`py-2 px-3 border rounded-xl flex items-center space-x-2 transition-all font-semibold ${
                          paymentMethod === m.id
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <MethodIcon className="h-4 w-4 shrink-0" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Ledger Calculation Block & Action trigger footer */}
          <div className="border-t border-slate-100 pt-6 mt-6 shrink-0 space-y-4">
            
            {/* Realtime Receipt breakdown */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal Payout Price</span>
                <span className="font-mono">${subtotalVal.toFixed(2)}</span>
              </div>
              
              {totalDiscountPct > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Gift className="h-3.5 w-3.5 text-rose-500" />
                    Campaign Savings (-{totalDiscountPct}%)
                  </span>
                  <span className="font-mono">-${discountVal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500 font-medium">
                <span>Selected Tip / Gratuity</span>
                <span className="font-mono">+${tipVal.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-slate-205 flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span>Settlement Grand Total</span>
                <span className="font-mono text-base text-indigo-750 text-indigo-600">${totalVal.toFixed(2)}</span>
              </div>
            </div>

            {/* Settle POS terminal execution */}
            {isProcessing ? (
              <div className="bg-indigo-50 border border-indigo-150 p-4 rounded-xl flex flex-col items-center justify-center space-y-2 animate-pulse">
                <div className="h-4 w-4 border-2 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-indigo-900">{processingStep}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSettleSubmit}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/10 transition-all uppercase tracking-wide"
              >
                <Printer className="h-4 w-4" />
                <span>Simulate Live POS Swipe & Settle Receipt</span>
              </button>
            )}

          </div>

        </div>

        {/* Right Side: Historical payments ledger checklist (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">
          
          <div>
            <div className="border-b border-slate-50 p-4 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Payments Ledger History</h3>
              
              {/* Payment Method lookup */}
              <select
                value={selectedMethodFilter}
                onChange={(e) => setSelectedMethodFilter(e.target.value)}
                className="text-[10px] p-1.5 border bg-white rounded font-bold"
              >
                <option value="all">All Channels</option>
                <option value="Card">Card Only</option>
                <option value="Cash">Cash Only</option>
                <option value="Mobile">Mobile Only</option>
                <option value="Points">Points Only</option>
              </select>
            </div>

            {/* Search within ledger list */}
            <div className="p-3.5 border-b border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search invoice, guest name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-8 pr-4 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {/* Settle ledger item list */}
            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
              {filteredPayments.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400 bg-[#fbfbfb]">
                  <Receipt className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <span>No completed payout transactions registered.</span>
                </div>
              ) : (
                filteredPayments.map(p => (
                  <div key={p.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col justify-between text-xs space-y-2">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-850">{p.id}</span>
                        {p.tableNumber && (
                          <span className="bg-slate-100 text-slate-655 font-bold px-1.5 py-0.5 rounded text-[9px] border">Table {p.tableNumber}</span>
                        )}
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold font-semibold ${
                          p.method === 'Card' ? 'bg-blue-50 text-blue-700 border border-blue-105' :
                          p.method === 'Mobile' ? 'bg-indigo-50 text-indigo-700 border border-indigo-105' :
                          p.method === 'Cash' ? 'bg-emerald-50 text-emerald-700 border border-emerald-105' :
                          'bg-amber-50 text-amber-700 border border-amber-105'
                        }`}>
                          {p.method}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{p.timestamp}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-800">{p.customerName}</span>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex flex-wrap gap-1.5">
                          <span>Subtotal: ${p.subtotal}</span>
                          <span>•</span>
                          <span>Tip: ${p.tip}</span>
                          {p.discount > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-rose-600 font-bold">Disc: -${p.discount}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="font-mono text-xs font-extrabold text-slate-900 block">${p.total}</span>
                        <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider block">settled</span>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick PDF receipt printer simulator placeholder */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-505">
            <span className="flex items-center gap-1.5 font-sans font-semibold">
              <Printer className="h-4 w-4 text-slate-400" /> Live Receipt Printer Connected
            </span>
            <button 
              type="button" 
              onClick={() => alert("Printing completed daily financial payouts reports logs via simulated thermal queue pipeline...")}
              className="p-1 px-3 bg-white border rounded text-slate-600 hover:bg-slate-100 transition-colors text-[10px] font-bold"
            >
              Export Day Ledger
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
