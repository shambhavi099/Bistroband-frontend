/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


export const initialOrders= [
  {
    id: "ORD-9482",
    tableId: "T-2",
    tableNumber: "T2",
    customerName: "Alice Chen",
    items: [
      { id: "M1", name: "Truffle Ribeye Steak", quantity: 1, price: 38 },
      { id: "B2", name: "Cabernet Sauvignon", quantity: 2, price: 14 }
    ],
    status: "preparing",
    type: "dine-in",
    timestamp: "11:45 AM",
    createdAtDate: "2026-06-02",
    total: 66,
    notes: "Steak medium rare. Bread on side.",
    paymentStatus: "Unpaid"
  },
  {
    id: "ORD-9483",
    tableId: "T-5",
    tableNumber: "T5",
    customerName: "Markus Aurelius",
    items: [
      { id: "A2", name: "Crispy Calamari", quantity: 1, price: 16 },
      { id: "M3", name: "Wild Mushroom Risotto", quantity: 1, price: 24 },
      { id: "B1", name: "Artisanal Cucumber Tonic", quantity: 1, price: 7 }
    ],
    status: "pending",
    type: "dine-in",
    timestamp: "12:10 PM",
    createdAtDate: "2026-06-02",
    total: 47,
    notes: "Allergy check: No heavy dairy in risotto if possible, substitute with olive oil.",
    paymentStatus: "Unpaid"
  },
  {
    id: "ORD-9484",
    customerName: "Sarah Jenkins",
    items: [
      { id: "M2", name: "Pan-Seared Sea Bass", quantity: 2, price: 29 },
      { id: "D1", name: "Deconstructed Tiramisu", quantity: 2, price: 10 }
    ],
    status: "ready",
    type: "takeaway",
    timestamp: "12:02 PM",
    createdAtDate: "2026-06-02",
    total: 78,
    notes: "Pack dessert separately in cooler bio-bags.",
    paymentStatus: "Unpaid"
  },
  {
    id: "ORD-9485",
    tableId: "T-1",
    tableNumber: "T1",
    customerName: "David Kim",
    items: [
      { id: "A1", name: "Heirloom Burrata Salad", quantity: 1, price: 14 },
      { id: "M4", name: "Fennel & Sausage Paccheri", quantity: 1, price: 21 }
    ],
    status: "served",
    type: "dine-in",
    timestamp: "11:20 AM",
    createdAtDate: "2026-06-02",
    total: 35,
    paymentStatus: "Paid"
  },
  {
    id: "ORD-9486",
    tableId: "T-8",
    tableNumber: "T8",
    customerName: "Dr. Eleanor Vance",
    items: [
      { id: "M1", name: "Truffle Ribeye Steak", quantity: 2, price: 38 },
      { id: "M4", name: "Fennel & Sausage Paccheri", quantity: 1, price: 21 },
      { id: "B2", name: "Cabernet Sauvignon", quantity: 1, price: 14 }
    ],
    status: "served",
    type: "dine-in",
    timestamp: "11:05 AM",
    createdAtDate: "2026-06-02",
    total: 111,
    paymentStatus: "Paid"
  },
  {
    id: "ORD-9487",
    customerName: "UberEats Courier - Dan",
    items: [
      { id: "M3", name: "Wild Mushroom Risotto", quantity: 2, price: 24 },
      { id: "A2", name: "Crispy Calamari", quantity: 1, price: 16 }
    ],
    status: "preparing",
    type: "delivery",
    timestamp: "12:05 PM",
    createdAtDate: "2026-06-02",
    total: 64,
    paymentStatus: "Unpaid"
  },
  {
    id: "ORD-9488",
    tableId: "T-10",
    tableNumber: "T10",
    customerName: "Brad & Tina",
    items: [
      { id: "A1", name: "Heirloom Burrata Salad", quantity: 2, price: 14 },
      { id: "D2", name: "Salted Caramel Tart", quantity: 1, price: 9 },
      { id: "B1", name: "Artisanal Cucumber Tonic", quantity: 2, price: 7 }
    ],
    status: "pending",
    type: "dine-in",
    timestamp: "12:12 PM",
    createdAtDate: "2026-06-02",
    total: 51,
    paymentStatus: "Unpaid"
  }
];

export const initialTables= [
  { id: "T-1", number: "T1", capacity: 2, status: "occupied", currentOrderId: "ORD-9485", assignedStaffName: "Jessica Lee", spendAmount: 35 },
  { id: "T-2", number: "T2", capacity: 2, status: "occupied", currentOrderId: "ORD-9482", assignedStaffName: "Jessica Lee", spendAmount: 66 },
  { id: "T-3", number: "T3", capacity: 4, status: "available" },
  { id: "T-4", number: "T4", capacity: 4, status: "reserved", assignedStaffName: "Marcus Brody" },
  { id: "T-5", number: "T5", capacity: 6, status: "occupied", currentOrderId: "ORD-9483", assignedStaffName: "Marcus Brody", spendAmount: 47 },
  { id: "T-6", number: "T6", capacity: 2, status: "available" },
  { id: "T-7", number: "T7", capacity: 4, status: "billing", assignedStaffName: "Jessica Lee", spendAmount: 145 },
  { id: "T-8", number: "T8", capacity: 8, status: "occupied", currentOrderId: "ORD-9486", assignedStaffName: "Sarah Connor", spendAmount: 111 },
  { id: "T-9", number: "T9", capacity: 2, status: "available" },
  { id: "T-10", number: "T10", capacity: 2, status: "occupied", currentOrderId: "ORD-9488", assignedStaffName: "Sarah Connor", spendAmount: 51 },
  { id: "T-11", number: "T11", capacity: 4, status: "reserved" },
  { id: "T-12", number: "T12", capacity: 6, status: "available" }
];

export const initialMenu = [
  {
    id: "A1",
    name: "Heirloom Burrata Salad",
    description: "Creamy pugliese burrata, heirloom cherry tomatoes, basil microgreens, cold-pressed olive oil, saba glaze.",
    price: 14,
    category: "Appetizers",
    isAvailable: true,
    preparationTime: 8,
    isPopular: true
  },
  {
    id: "A2",
    name: "Crispy Calamari",
    description: "Point Judith calamari, flash-fried banana peppers, house preserved lemon aioli, volcanic sea salt.",
    price: 16,
    category: "Appetizers",
    isAvailable: true,
    preparationTime: 10,
    isPopular: true
  },
  {
    id: "A3",
    name: "Charred Spanish Octopus",
    description: "Smoked paprika fingerlings, olive tapenade, preserved long hots, citrus-herb oil infusion.",
    price: 18,
    category: "Appetizers",
    isAvailable: false,
    preparationTime: 12
  },
  {
    id: "M1",
    name: "Truffle Ribeye Steak",
    description: "14oz prime hand-cut angus, black winter truffle compound butter, roasted bone marrow, duck-fat fingerling potatoes.",
    price: 38,
    category: "Mains",
    isAvailable: true,
    preparationTime: 22,
    isPopular: true
  },
  {
    id: "M2",
    name: "Pan-Seared Sea Bass",
    description: "Chilean sea bass, white wine lemongrass reduction, baby bok choy, wild black forbidden rice.",
    price: 29,
    category: "Mains",
    isAvailable: true,
    preparationTime: 18
  },
  {
    id: "M3",
    name: "Wild Mushroom Risotto",
    description: "Carnaroli rice, porcini & chanterelle pan-roast, aged parmigiano-reggiano, fresh thyme, white truffle foam.",
    price: 24,
    category: "Mains",
    isAvailable: true,
    preparationTime: 20
  },
  {
    id: "M4",
    name: "Fennel & Sausage Paccheri",
    description: "House-made paccheri tubes, sweet Italian fennel sausage ragoût, organic San Marzano tomatoes, pecorino romano.",
    price: 21,
    category: "Mains",
    isAvailable: true,
    preparationTime: 15,
    isPopular: true
  },
  {
    id: "D1",
    name: "Deconstructed Tiramisu",
    description: "Espresso-soaked sponge biscuit, whipped mascarpone sabayon, gourmet dark chocolate dust, coffee liqueur syrup.",
    price: 10,
    category: "Desserts",
    isAvailable: true,
    preparationTime: 7,
    isPopular: true
  },
  {
    id: "D2",
    name: "Salted Caramel Tart",
    description: "Chocolate shortbread crust, smooth liquid sea-salt caramel, dark Valrhona ganache shell, gold leaf flecks.",
    price: 9,
    category: "Desserts",
    isAvailable: true,
    preparationTime: 6
  },
  {
    id: "B1",
    name: "Artisanal Cucumber Tonic",
    description: "Cold-extracted organic cucumber, fever tree tonic, fresh mint sprigs, lime wedge, cracked juniper berries.",
    price: 7,
    category: "Beverages",
    isAvailable: true,
    preparationTime: 4
  },
  {
    id: "B2",
    name: "Cabernet Sauvignon",
    description: "Grown in Napa Valley. Bold red fruits, full body, robust oaky structure, velvety tannic finish.",
    price: 14,
    category: "Beverages",
    isAvailable: true,
    preparationTime: 2
  },
  {
    id: "S1",
    name: "Truffle Gnocchi Fries",
    description: "Flash-fried potato gnocchi tossed in premium truffle salt, parsley, shaved grana padano cheese.",
    price: 9,
    category: "Sides",
    isAvailable: true,
    preparationTime: 6
  }
];

export const initialInventory = [
  { id: "INV-001", name: "Prime Black Angus Ribeye", quantity: 18, unit: "lbs", minQuantity: 20, category: "Meat & Seafood", status: "low-stock", lastSupplied: "May 28, 2026" },
  { id: "INV-002", name: "Chilean Sea Bass Fillets", quantity: 24, unit: "lbs", minQuantity: 15, category: "Meat & Seafood", status: "in-stock", lastSupplied: "May 30, 2026" },
  { id: "INV-003", name: "Pugliese Fresh Burrata", quantity: 6, unit: "cases (12ct)", minQuantity: 5, category: "Dairy", status: "in-stock", lastSupplied: "Jun 01, 2026" },
  { id: "INV-004", name: "Porcini Mushrooms (Fresh)", quantity: 3, unit: "lbs", minQuantity: 10, category: "Produce", status: "low-stock", lastSupplied: "May 29, 2026" },
  { id: "INV-005", name: "Sweet Italian Sausage", quantity: 35, unit: "lbs", minQuantity: 15, category: "Meat & Seafood", status: "in-stock", lastSupplied: "May 30, 2026" },
  { id: "INV-006", name: "San Marzano Canned Tomatoes", quantity: 48, unit: "cans", minQuantity: 24, category: "Pantry", status: "in-stock", lastSupplied: "May 24, 2026" },
  { id: "INV-007", name: "Heavy Cooking Cream", quantity: 0, unit: "gallons", minQuantity: 4, category: "Dairy", status: "out-of-stock", lastSupplied: "May 22, 2026" },
  { id: "INV-008", name: "Winter Black Truffles", quantity: 0.8, unit: "lbs", minQuantity: 0.5, category: "Pantry", status: "in-stock", lastSupplied: "May 15, 2026" },
  { id: "INV-009", name: "Organic Cucumber Stock", quantity: 22, unit: "lbs", minQuantity: 8, category: "Produce", status: "in-stock", lastSupplied: "Jun 01, 2026" },
  { id: "INV-010", name: "Napa Reserve Cabernet", quantity: 36, unit: "bottles", minQuantity: 12, category: "Beverages", status: "in-stock", lastSupplied: "May 27, 2026" },
  { id: "INV-011", name: "Mascarpone Cheese", quantity: 4, unit: "lbs", minQuantity: 10, category: "Dairy", status: "low-stock", lastSupplied: "May 28, 2026" }
];

export const initialStaff= [
  { id: "STF-01", name: "Chef Marcus Vance", role: "Chef", status: "active", shift: "All-Day (11 AM - 10 PM)", avatarColor: "bg-red-500", performanceScore: 4.9, phone: "555-0199" },
  { id: "STF-02", name: "Sous Chef Raymond", role: "Sous Chef", status: "active", shift: "Morning / Afternoon (10 AM - 6 PM)", avatarColor: "bg-orange-500", performanceScore: 4.6, phone: "555-0122" },
  { id: "STF-03", name: "Jessica Lee", role: "Server", status: "active", shift: "Morning (11 AM - 4 PM)", avatarColor: "bg-blue-500", performanceScore: 4.8, phone: "555-0156" },
  { id: "STF-04", name: "Marcus Brody", role: "Server", status: "on-break", shift: "Morning (11 AM - 4 PM)", avatarColor: "bg-amber-500", performanceScore: 4.5, phone: "555-0182" },
  { id: "STF-05", name: "Sarah Connor", role: "Server", status: "active", shift: "Evening (4 PM - 11 PM)", avatarColor: "bg-emerald-500", performanceScore: 4.7, phone: "555-0144" },
  { id: "STF-06", name: "Elena Rostova", role: "Bartender", status: "off-duty", shift: "Evening (5 PM - Midnight)", avatarColor: "bg-purple-500", performanceScore: 4.9, phone: "555-0163" },
  { id: "STF-07", name: "Tom Redfield", role: "Host", status: "on-duty", shift: "Morning (10 AM - 4 PM)", avatarColor: "bg-teal-500", performanceScore: 4.4, phone: "555-0201" }
];

export const salesTrendData= [
  { day: "Wed (May 27)", revenue: 2450, orders: 48 },
  { day: "Thu (May 28)", revenue: 2680, orders: 52 },
  { day: "Fri (May 29)", revenue: 4120, orders: 85 },
  { day: "Sat (May 30)", revenue: 5890, orders: 122 },
  { day: "Sun (May 31)", revenue: 4940, orders: 98 },
  { day: "Mon (Jun 01)", revenue: 1850, orders: 36 },
  { day: "Tue (Jun 02 - Today)", revenue: 3240, orders: 63 } // Current day cumulative
];

export const categoryBreakdown = [
  { category: "Mains", percentage: 54, color: "bg-amber-600 text-amber-600 border-amber-600" },
  { category: "Appetizers", percentage: 22, color: "bg-emerald-600 text-emerald-600 border-emerald-600" },
  { category: "Beverages", percentage: 14, color: "bg-blue-600 text-blue-600 border-blue-600" },
  { category: "Desserts", percentage: 8, color: "bg-purple-600 text-purple-600 border-purple-600" },
  { category: "Sides", percentage: 2, color: "bg-pink-600 text-pink-600 border-pink-600" }
];

export const initialCustomers = [
  {
    id: "CUST-001",
    name: "Alice Chen",
    email: "alice.chen@example.com",
    phone: "555-0143",
    tier: "VIP",
    preferences: "Loves window seats. Gluten-free preferred (Severe allergy to wheat). Prefers medium-rare steak.",
    favoriteDishes: ["Truffle Ribeye Steak", "Cabernet Sauvignon", "Heirloom Burrata Salad"],
    totalSpent: 480,
    totalVisits: 12,
    lastVisit: "Jun 02, 2026",
    avatarColor: "bg-indigo-500"
  },
  {
    id: "CUST-002",
    name: "Markus Aurelius",
    email: "markus.philosophy@example.com",
    phone: "555-0188",
    tier: "VIP",
    preferences: "Prefers quiet round table. No organic dairy/heavy milk products. Substitute with premium olive oil.",
    favoriteDishes: ["Wild Mushroom Risotto", "Crispy Calamari", "Artisanal Cucumber Tonic"],
    totalSpent: 340,
    totalVisits: 8,
    lastVisit: "Jun 02, 2026",
    avatarColor: "bg-purple-500"
  },
  {
    id: "CUST-003",
    name: "Sarah Jenkins",
    email: "sjenkins@example.com",
    phone: "555-0105",
    tier: "Regular",
    preferences: "Order takeaway or delivery most of the time. Enjoys eco-friendly containers.",
    favoriteDishes: ["Pan-Seared Sea Bass", "Deconstructed Tiramisu"],
    totalSpent: 220,
    totalVisits: 5,
    lastVisit: "May 28, 2026",
    avatarColor: "bg-emerald-500"
  },
  {
    id: "CUST-004",
    name: "David Kim",
    email: "david.kim@example.com",
    phone: "555-0112",
    tier: "Regular",
    preferences: "Prefers indoor tables. High tolerance for spicy food. Likes trying new side specials.",
    favoriteDishes: ["Heirloom Burrata Salad", "Fennel & Sausage Paccheri", "Truffle Gnocchi Fries"],
    totalSpent: 185,
    totalVisits: 6,
    lastVisit: "Jun 01, 2026",
    avatarColor: "bg-amber-500"
  },
  {
    id: "CUST-005",
    name: "Dr. Eleanor Vance",
    email: "evance@university.edu",
    phone: "555-0191",
    tier: "VIP",
    preferences: "Often dines with colleagues. Needs quick lunches. Prefers table near high power outlet.",
    favoriteDishes: ["Truffle Ribeye Steak", "Fennel & Sausage Paccheri", "Cabernet Sauvignon"],
    totalSpent: 620,
    totalVisits: 15,
    lastVisit: "Jun 02, 2026",
    avatarColor: "bg-pink-500"
  },
  {
    id: "CUST-006",
    name: "Brad & Tina",
    email: "brad.tina@example.com",
    phone: "555-0211",
    tier: "New",
    preferences: "Anniversary table preference close to flower pots. Vegetarian preferences for Tina.",
    favoriteDishes: ["Heirloom Burrata Salad", "Salted Caramel Tart", "Artisanal Cucumber Tonic"],
    totalSpent: 51,
    totalVisits: 1,
    lastVisit: "Jun 02, 2026",
    avatarColor: "bg-rose-500"
  },
  {
    id: "CUST-007",
    name: "Robert Downey",
    email: "rdj@example.com",
    phone: "555-3000",
    tier: "Local",
    preferences: "Decaf espresso. High privacy requested. Prefers booths with high partitions.",
    favoriteDishes: ["Truffle Ribeye Steak", "Crispy Calamari"],
    totalSpent: 890,
    totalVisits: 22,
    lastVisit: "May 29, 2026",
    avatarColor: "bg-blue-500"
  }
];

export const initialPayments= [
  {
    id: "TXN-8401",
    orderId: "ORD-1234",
    tableNumber: "T3",
    customerName: "Alice Chen",
    customerId: "CUST-001",
    subtotal: 114.00,
    tip: 22.80,
    discount: 11.40,
    total: 125.40,
    method: "Card",
    status: "Settled",
    timestamp: "12:35 PM"
  },
  {
    id: "TXN-8402",
    orderId: "ORD-1235",
    tableNumber: "T6",
    customerName: "David Kim",
    customerId: "CUST-004",
    subtotal: 54.50,
    tip: 8.00,
    discount: 0,
    total: 62.50,
    method: "Mobile",
    status: "Settled",
    timestamp: "01:10 PM"
  },
  {
    id: "TXN-8403",
    orderId: "ORD-1236",
    tableNumber: "T1",
    customerName: "Sarah Jenkins",
    customerId: "CUST-003",
    subtotal: 88.00,
    tip: 15.00,
    discount: 8.80,
    total: 94.20,
    method: "Card",
    status: "Settled",
    timestamp: "02:45 PM"
  },
  {
    id: "TXN-8404",
    customerName: "Robert Downey",
    customerId: "CUST-007",
    subtotal: 135.00,
    tip: 30.00,
    discount: 13.50,
    total: 151.50,
    method: "Points",
    status: "Settled",
    timestamp: "May 29, 2026"
  },
  {
    id: "TXN-8405",
    customerName: "Dr. Eleanor Vance",
    customerId: "CUST-005",
    subtotal: 42.00,
    tip: 5.00,
    discount: 4.20,
    total: 42.80,
    method: "Cash",
    status: "Settled",
    timestamp: "May 28, 2026"
  }
];

