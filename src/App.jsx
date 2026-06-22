/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import  { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import OrdersView from './components/OrdersView';
import TablesView from './components/TablesView';
import MenuView from './components/MenuView';
import InventoryView from './components/InventoryView';
import StaffView from './components/StaffView';
import ReportsView from './components/ReportsView';
import CustomersView from './components/CustomersView';
import PaymentsView from './components/PaymentsView';
import AdminView from './components/AdminView';
import LoginView from './components/LoginView';
import CustomerPortal from './components/CustomerPortal';
import api from "./services/api";


import { 
  initialOrders, 
  initialTables, 
  initialMenu, 
  initialInventory, 
  initialStaff, 
  salesTrendData, 
  categoryBreakdown,
  initialCustomers,
  initialPayments
} from './data/mockData';

import { Bell, HelpCircle, UtensilsCrossed } from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] =useState(null)

  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Operation States
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);

  const [reportSummary, setReportSummary] = useState({
  totalRevenue: 0,
  count: 0,
  averageTicketValue: 0,
});

const [popularSellers, setPopularSellers] = useState([]);

  useEffect(() => {
  fetchEmployees();
  fetchTables();
  fetchOrders();
  fetchMenu();
  fetchInventory();
  fetchCustomers();
  fetchPayments();
  fetchReports();
}, []);

  // Admin and Operations Configurations States
  const [systemConfig, setSystemConfig] = useState({
    restaurantName: "BISTROBOARD GOURMET",
    taxRate: 8.25,
    serviceChargeRate: 10.0,
    enableTableCleanup: true,
    preparationBuffer: 5
  });

  const [promoCampaigns, setPromoCampaigns] = useState([
    { id: 'CAM-1', code: 'HAPPYHOUR', discountPct: 10, description: 'Happy hour afternoon 10% off', isActive: true },
    { id: 'CAM-2', code: 'LOYALTY_TREAT_15', discountPct: 15, description: 'VIP patrons premium discount 15% off', isActive: true },
    { id: 'CAM-3', code: 'WELCOME5', discountPct: 5, description: 'Welcome voucher coupon 5% off', isActive: true }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 'log-1', timestamp: '10:01 AM', category: 'SYSTEM', action: 'BistroBoard Operational OS online', severity: 'info', user: 'Vedanshi' },
    { id: 'log-2', timestamp: '10:05 AM', category: 'STAFF', action: 'Roster active shift schedules assigned', severity: 'info', user: 'Chef Marcus' },
    { id: 'log-3', timestamp: '10:10 AM', category: 'CONFIG', action: 'Tax rate initial configuration applied (8.25%)', severity: 'info', user: 'Vedanshi' }
  ]);

  const handleAddAuditLog = (category, action, severity = 'info') => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const nextId = `log-${Math.floor(1000 + Math.random() * 9000)}`;
    setAuditLogs(prev => [
      { id: nextId, timestamp: timeStr, category, action, severity, user: currentUser ? currentUser.name : 'Vedanshi' },
      ...prev
    ]);
  };

const fetchEmployees = async () => {
  try {
    const response = await api.get("/employees");

    setStaffList(response.data.data || []);
  } catch (error) {
    console.log(error);
  }
};

const fetchTables = async () => {
  try {
    const response = await api.get("/tables");

    setTables(
  response.data.data.map(table => ({
    ...table,
    number: `T${table.tableNumber}`,
    status: table.status.toLowerCase(),
    assignedStaffName: table.assignedStaffName || "",
    spendAmount: table.spendAmount || 0
  }))
);
  } catch (error) {
    console.error("Tables Fetch Error:", error);
  }
};

const fetchOrders = async () => {
  try {
    const response = await api.get("/orders");

    setOrders(response.data.data || []);
  } catch (error) {
    console.error("Orders Fetch Error:", error);
  }
};

const fetchMenu = async () => {
  try {
    const response = await api.get("/menu");

    setMenuItems(response.data.data || []);
  } catch (error) {
    console.error("Menu Fetch Error:", error);
  }
};

const fetchReports = async () => {
  try {

    const [summaryRes, popularRes] = await Promise.all([
      api.get("/reports/summary"),
      api.get("/reports/popular-items"),
    ]);

    setReportSummary(summaryRes.data.data);

    setPopularSellers(popularRes.data.data);

  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};

const handleLoginSuccess = (user)=> {
  setCurrentUser(user);
  // Add success logger
  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const nextId = `log-${Math.floor(1000 + Math.random() * 9000)}`;
  setAuditLogs(prev => [
    { id: nextId, timestamp: timeStr, category: 'SYSTEM', action: `Staff authenticated: ${user.name} (${user.role}) logged in`, severity: 'info', user: user.name },
    ...prev
  ]);
  
  // Auto-navigate to appropriate initial tab based on role
  if (user.role === 'Chef') {
    setActiveTab('orders');
  } else if (user.role === 'Server') {
    setActiveTab('tables');
  } else {
    setActiveTab('dashboard');
  }
};

const handleLogout = () => {
  if (currentUser) {
    const uName = currentUser.name;
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const nextId = `log-${Math.floor(1000 + Math.random() * 9000)}`;
    setAuditLogs(prev => [
      { id: nextId, timestamp: timeStr, category: 'SYSTEM', action: `Staff session ended: ${uName} signed out`, severity: 'info', user: uName },
      ...prev
    ]);
  }
  setCurrentUser(null);
  setActiveTab('dashboard');
};

  const handleResetToDefaults = () => {
    setOrders(initialOrders);
    setTables(initialTables);
    setMenuItems(initialMenu);
    setInventoryItems(initialInventory);
    setStaffList(initialStaff);
    setCustomers(initialCustomers);
    setPayments(initialPayments);
    setSystemConfig({
      restaurantName: "BISTROBOARD GOURMET",
      taxRate: 8.25,
      serviceChargeRate: 10.0,
      enableTableCleanup: true,
      preparationBuffer: 5
    });
    setPromoCampaigns([
      { id: 'CAM-1', code: 'HAPPYHOUR', discountPct: 10, description: 'Happy hour afternoon 10% off', isActive: true },
      { id: 'CAM-2', code: 'LOYALTY_TREAT_15', discountPct: 15, description: 'VIP patrons premium discount 15% off', isActive: true },
      { id: 'CAM-3', code: 'WELCOME5', discountPct: 5, description: 'Welcome voucher coupon 5% off', isActive: true }
    ]);
  };

  const handleWipeFinancialLedgers = () => {
    setPayments([]);
    setOrders(prev => prev.map(o => ({ ...o, paymentStatus: 'Unpaid' })));
  };

  const handleSimulateBusyRush = () => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const todayStr = new Date().toISOString().slice(0, 10);
    
    const simulatedOrders=[
      {
        id: "ORD-7590",
        tableNumber: "T-2",
        customerName: "VIP Charlotte G.",
        status: "preparing",
        type: "dine-in",
        items: [
          { id: "1", name: "Truffle Ribeye Steak", quantity: 2, price: 44 },
          { id: "4", name: "Warm Molten Lava Cake", quantity: 2, price: 12 }
        ],
        total: 112,
        notes: "Gluten-free preference. Sliced thin.",
        timestamp: timeStr,
        createdAtDate: todayStr,
        paymentStatus: "Unpaid"
      },
      {
        id: "ORD-7591",
        tableNumber: "T-4",
        customerName: "Siddharth Sen",
        status: "pending",
        type: "dine-in",
        items: [
          { id: "2", name: "Pan-Seared Sea Bass", quantity: 1, price: 38 },
          { id: "6", name: "Fresh Squeezed Citrus Juice", quantity: 1, price: 8 }
        ],
        total: 46,
        notes: "Allergy warning: peanut-free environment requested.",
        timestamp: timeStr,
        createdAtDate: todayStr,
        paymentStatus: "Unpaid"
      }
    ];

    setOrders(prev => [...simulatedOrders, ...prev]);

    setTables(prevTables => 
      prevTables.map(t => {
        if (t.number === "T-2") {
          return {
            ...t,
            status: "occupied",
            spendAmount: 112,
            currentOrderId: "ORD-7590"
          };
        }
        if (t.number === "T-4") {
          return {
            ...t,
            status: "occupied",
            spendAmount: 46,
            currentOrderId: "ORD-7591"
          };
        }
        return t;
      })
    );

    if (!customers.some(c => c.name === "Siddharth Sen")) {
      const newCust = {
        id: `CUST-${Math.floor(600 + Math.random() * 300)}`,
        name: "Siddharth Sen",
        email: "siddharth@example.com",
        phone: "555-9012",
        tier: "VIP",
        preferences: "Strict peanut allergy. Prefers sea bass.",
        favoriteDishes: ["Pan-Seared Sea Bass"],
        totalSpent: 120,
        totalVisits: 3,
        lastVisit: "May 29, 2026",
        avatarColor: "bg-purple-500"
      };
      setCustomers(prev => [...prev, newCust]);
    }
  };

  const fetchInventory = async () => {
  try {
    const response = await api.get("/inventory");
    setInventoryItems(response.data.data || []);
  } catch (error) {
    console.log(error);
  }
};

  const handleReplenishStock = () => {
    setInventoryItems(prevItems => 
      prevItems.map(item => {
        if (item.quantity <= item.minQuantity) {
          return {
            ...item,
            quantity: item.quantity + 300,
            status: "in-stock",
            lastSupplied: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
          };
        }
        return item;
      })
    );
  };

  const handleAddPromoCampaign = (campaign) => {
    setPromoCampaigns(prev => [...prev, campaign]);
  };

  const handleTogglePromoCampaignStatus = (id) => {
    setPromoCampaigns(prev =>
      prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)
    );
  };

  const handleDeletePromoCampaign = (id) => {
    setPromoCampaigns(prev => prev.filter(c => c.id !== id));
  };

  // POS - KDS Integration Linkage States
  const [posCheckoutOrderId, setPosCheckoutOrderId] = useState(null);
  const [posCheckoutTableNumber, setPosCheckoutTableNumber] = useState(null);

  const handleTriggerPOSCheckout = (orderId) => {
    setPosCheckoutOrderId(orderId);
    const matchedOrder = orders.find(o => o.id === orderId);
    if (matchedOrder && matchedOrder.tableNumber) {
      setPosCheckoutTableNumber(matchedOrder.tableNumber);
    } else {
      setPosCheckoutTableNumber(null);
    }
    setActiveTab('payments');
  };

  const handleClearPOSCheckoutLink = () => {
    setPosCheckoutOrderId(null);
    setPosCheckoutTableNumber(null);
  };

  // Stats Counters
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
  const lowStockCount = inventoryItems.filter(item => item.quantity <= item.minQuantity).length;

  // --- ACTIONS HANDLERS ---

  // Order Handlers
  const handleAddOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);

    // If dine-in, auto occupy accompanying table
    if (newOrder.type === 'dine-in' && newOrder.tableNumber) {
      setTables(prevTables => 
        prevTables.map(t => {
          if (t.number === newOrder.tableNumber) {
            return {
              ...t,
              status: 'occupied',
              currentOrderId: newOrder.id,
              spendAmount: newOrder.total,
              assignedStaffName: t.assignedStaffName || staffList.find(s => s.role === 'Server')?.name || "Jessica Lee"
            };
          }
          return t;
        })
      );
    }
  };

  const handleUpdateOrderStatus = (orderId, status) => {
    setOrders(prev => 
      prev.map(o => {
        if (o.id === orderId) {
          const updated = { ...o, status };
          
          // Cascading changes to Table if status becomes served
          if (status === 'served' && o.tableNumber) {
            setTables(prevTables => 
              prevTables.map(t => {
                if (t.number === o.tableNumber) {
                  return {
                    ...t,
                    status: 'billing', // Asking for bill / paying
                    spendAmount: o.total
                  };
                }
                return t;
              })
            );
          }
          return updated;
        }
        return o;
      })
    );
  };

  const handleCancelOrder = (orderId) => {
    setOrders(prev => 
      prev.map(o => {
        if (o.id === orderId) {
          // Free table association
          if (o.tableNumber) {
            setTables(prevTables => 
              prevTables.map(t => {
                if (t.number === o.tableNumber) {
                  return { ...t, status: 'available', currentOrderId:null, spendAmount:null };
                }
                return t;
              })
            );
          }
          return { ...o, status: 'cancelled' };
        }
        return o;
      })
    );
  };

  // Table Handlers
  const handleUpdateTableStatus = (
    tableId, 
    status, 
    staffName, 
    spendAmount
  ) => {
    setTables(prev => 
      prev.map(t => {
        if (t.id === tableId) {
          return {
            ...t,
            status,
            assignedStaffName: staffName || t.assignedStaffName,
            spendAmount: spendAmount !== undefined ? spendAmount : t.spendAmount
          } ;
        }
        return t;
      })
    );
  };

  const handleClearTable = (tableId) => {
    setTables(prev => 
      prev.map(t => {
        if (t.id === tableId) {
          return {
            ...t,
            status: 'available',
            spendAmount: undefined,
            currentOrderId: undefined,
            assignedStaffName: undefined
          } ;
        }
        return t;
      })
    );
  };

  // Menu Handlers
  const handleAddMenuItem = (item) => {
    setMenuItems(prev => [...prev, item]);
  };

 const handleUpdatePrice = async (itemId, newPrice) => {
  try {
    await api.put(`/menu/${itemId}`, {
      price: newPrice,
    });

    setMenuItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, price: newPrice }
          : item
      )
    );
  } catch (error) {
    console.log(error.response?.data);
    console.log(error.message);
  }
};

  const handleToggleAvailability = (itemId) => {
    setMenuItems(prev => 
      prev.map(item => item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item)
    );
  };

  const handleDeleteMenuItem = async (itemId) => {
  try {
    console.log("Deleting:", itemId);

    await api.delete(`/menu/${itemId}`);

    setMenuItems(prev =>
      prev.filter(item => item.id !== itemId)
    );

    console.log("Deleted successfully");
  } catch (error) {
    console.log(error.response?.data);
    console.log(error.message);
  }
};

// Inventory Handlers
const handleUpdateStock = async (itemId, value) => {
  try {
    console.log(itemId, value);

    const response = await api.patch(`/inventory/${itemId}`, {
      value,
    });

    console.log(response.data);

    fetchInventory();
  } catch (error) {
    console.log(error.response?.status);
    console.log(error.response?.data);
    console.log(error.message);
  }
};

const handleAddStockItem = async (item) => {
  try {

    const response = await api.post("/inventory", item);

    setInventoryItems(prev => [
      ...prev,
      {
        id: response.data.inventoryId,
        ...response.data.data,
      },
    ]);

  } catch (error) {
    console.log(error.response?.data);
  }
};

const handleRestockLowStock = async () => {
  try {
    await api.patch("/inventory/restock");
    fetchInventory();
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteInventory = async (itemId) => {
  try {
    console.log("Deleting:", itemId);

    const response = await api.delete(`/inventory/${itemId}`);

    console.log(response.data);

    setInventoryItems(prev =>
      prev.filter(item => item.id !== itemId)
    );
  } catch (error) {
    console.log(error.response?.status);
    console.log(error.response?.data);
    console.log(error.message);
  }
};


// Staff Handlers
const handleAddStaff = async (staffData) => {
  try {
    console.log("Sending:", staffData);

    const response = await api.post("/employees", staffData);

    console.log("Response:", response.data);

    setStaffList(prev => [
      ...prev,
      {
        id: response.data.employeeId,
        ...response.data.data,
      },
    ]);

  } catch (error) {
    console.log("Status:", error.response?.status);
    console.log("Error:", error.response?.data);
    console.log(error.message);
  }
};

const handleUpdateStaffStatus = async (staffId, status) => {
  try {

    await api.patch(
      `/employees/status/${staffId}`,
      { status }
    );

    fetchEmployees();

  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};
  const handleFireStaff = (staffId) => {
    setStaffList(prev => prev.filter(st => st.id !== staffId));
  };

  // Customer Handlers
  const handleAddCustomer = async (customerData) => {
  try {
    const response = await api.post("/customers", customerData);

    setCustomers(prev => [
      ...prev,
      {
        id: response.data.customerId,
        ...response.data.data,
      },
    ]);
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};

  const handleUpdateCustomer = async (customer) => {
  try {
    await api.put(`/customers/${customer.id}`, customer);

    fetchCustomers();
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};

const handleDeleteCustomer = async (customerId) => {
  try {
    await api.delete(`/customers/${customerId}`);

    await fetchCustomers();
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};

  const fetchCustomers = async () => {
  try {
    const response = await api.get("/customers");

    setCustomers(response.data.data || []);
  } catch (error) {
    console.log(error);
  }
};

  // Payment Handlers
  const fetchPayments = async () => {
  try {
    const res = await api.get("/payments");

    setPayments(res.data);
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};
  const handleAddPayment = (newPayment) => {
    setPayments(prev => [newPayment, ...prev]);
  };

  const handleSettleOrderAndTable = async (paymentData) => {
  try {
    const res = await api.post("/payments", paymentData);

    // Refresh all data
    await Promise.all([
      fetchOrders(),
      fetchTables(),
      fetchCustomers(),
      fetchPayments(),
    ]);

    return res.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

  // Tab Header Translation label lookup
  const getTabHeaderLabel = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Operational Command Centre';
      case 'orders':
        return 'Active Order Ticket Board';
      case 'tables':
        return 'Floor Map & Seating Allocation';
      case 'menu':
        return 'Vila Culinary Menu Configuration';
      case 'inventory':
        return 'Raw Ingredient Stocks Monitor';
      case 'staff':
        return 'Bistro Team Roster & Schedules';
      case 'customers':
        return 'Customer Profile Dossier & CRM Hub';
      case 'payments':
        return 'Unified Direct Payments & Terminal POS Checkout';
      case 'reports':
        return 'Sales Insights & Financial Reports';
      case 'admin':
        return 'Executive Operations & Administrative Controls';
      default:
        return 'Restaurant Management System';
    }
  };

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentUser.role === 'Customer') {
    return (
      <CustomerPortal
        menuItems={menuItems}
        tables={tables}
        orders={orders}
        systemConfig={systemConfig}
        promoCampaigns={promoCampaigns}
        onAddOrder={handleAddOrder}
        onUpdateTableStatus={handleUpdateTableStatus}
        onSettleOrderAndTable={handleSettleOrderAndTable}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div id="restaurant-app-root" className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans antialiased text-slate-800">
      
      {/* Left Sidebar Menu Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        pendingCount={pendingOrdersCount}
        lowStockCount={lowStockCount}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main workspace scrollable area */}
      <div id="workspace-viewport" className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Top Navbar Header */}
        <header id="workspace-header" className="h-16 px-8 border-b border-slate-200/65 bg-white flex items-center justify-between shrink-0 select-none">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">{getTabHeaderLabel()}</h2>
            <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-semibold font-mono tracking-wide uppercase mt-0.5">
              <span>BistroBoard Control</span>
              <span>•</span>
              <span className="text-indigo-600">Active Session</span>
            </div>
          </div>

          <div className="flex items-center space-x-5">
            {/* Direct Link status */}
            <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100">
              <UtensilsCrossed className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-slate-650">Main Service Deck</span>
            </div>

            {/* Notification alert hub switcher */}
            <div id="notifications-ring" className="relative cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
              <Bell className="h-4.5 w-4.5 text-slate-500" />
              {(pendingOrdersCount > 0 || lowStockCount > 0) && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-[#20fff2] rounded-full ring-2 ring-white animate-pulse" />
              )}
            </div>

            <button 
              onClick={() => alert("BistroBoard User Assistance Guide:\n\n1. Select operational panels from the executive sidebar.\n2. In 'Orders', spawn tickets, set states to cooking, or cancel bad tickets.\n3. In 'Tables', track active floor headcounts or click occupied items to request instant customer checkout.\n4. Change inventory reserves or adjust teammate roles directly from the panels.")}
              title="Help Manual" 
              className="hover:bg-slate-50 p-1.5 rounded-lg text-slate-500"
            >
              <HelpCircle className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        {/* Dynamic Inner Panel viewport */}
        <main id="workspace-content" className="flex-1 overflow-y-auto p-8 bg-[#fdfdfd]">
          {activeTab === 'dashboard' && (
            <DashboardView 
              orders={orders}
              tables={tables}
              salesTrend={salesTrendData}
              categoryBreakdown={categoryBreakdown}
              onNavigate={setActiveTab}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView 
              orders={orders}
              menuItems={menuItems}
              onAddOrder={handleAddOrder}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onCancelOrder={handleCancelOrder}
              onTriggerPOSCheckout={handleTriggerPOSCheckout}
              payments={payments}
            />
          )}

          {activeTab === 'tables' && (
            <TablesView 
              tables={tables}
              staffList={staffList}
              onUpdateTableStatus={handleUpdateTableStatus}
              onClearTable={handleClearTable}
            />
          )}

          {activeTab === 'menu' && (
            <MenuView 
              menuItems={menuItems}
              onAddMenuItem={handleAddMenuItem}
              onUpdatePrice={handleUpdatePrice}
              onToggleAvailability={handleToggleAvailability}
              onDeleteMenuItem={handleDeleteMenuItem}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView 
              inventoryItems={inventoryItems}
              onUpdateStock={handleUpdateStock}
              onAddStockItem={handleAddStockItem}
              onRestockLowStock={handleRestockLowStock}
              onDeleteInventory={handleDeleteInventory}
            />
          )}

          {activeTab === 'staff' && (
            <StaffView 
              staffList={staffList}
              onAddStaff={handleAddStaff}
              onUpdateStaffStatus={handleUpdateStaffStatus}
              onFireStaff={handleFireStaff}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView 
              customers={customers}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsView 
              orders={orders}
              tables={tables}
              customers={customers}
              payments={payments}
              onAddPayment={handleAddPayment}
              onSettleOrderAndTable={handleSettleOrderAndTable}
              posCheckoutOrderId={posCheckoutOrderId}
              posCheckoutTableNumber={posCheckoutTableNumber}
              onClearPOSCheckoutLink={handleClearPOSCheckoutLink}
              promoCampaigns={promoCampaigns}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              orders={orders}
              menuItems={menuItems}
              reportSummary={reportSummary}
              popularSellers={popularSellers}
          />
          )}

          {activeTab === 'admin' && (
            <AdminView 
              systemConfig={systemConfig}
              onUpdateSystemConfig={setSystemConfig}
              promoCampaigns={promoCampaigns}
              onAddPromoCampaign={handleAddPromoCampaign}
              onTogglePromoCampaignStatus={handleTogglePromoCampaignStatus}
              onDeletePromoCampaign={handleDeletePromoCampaign}
              auditLogs={auditLogs}
              onClearAuditLogs={() => setAuditLogs([])}
              onAddAuditLog={handleAddAuditLog}
              onResetToDefaults={handleResetToDefaults}
              onWipeFinancialLedgers={handleWipeFinancialLedgers}
              onSimulateBusyRush={handleSimulateBusyRush}
              onReplenishStock={handleReplenishStock}
            />
          )}
        </main>
      </div>

    </div>
  );
}
