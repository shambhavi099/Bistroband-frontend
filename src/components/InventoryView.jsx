

import { useState } from 'react';
import { 
  Plus, 
  Search, 
 
  Package, 

  RefreshCw,
  AlertTriangle,
  
} from 'lucide-react';

export default function InventoryView({ 
  inventoryItems, 
  onUpdateStock, 
  onAddStockItem, 
  onRestockLowStock 
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Stock Form state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Produce');
  const [newQty, setNewQty] = useState('20');
  const [newMin, setNewMin] = useState('10');
  const [newUnit, setNewUnit] = useState('lbs');

  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.minQuantity);

  const filteredItems = inventoryItems.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchQuery.trim() !== '') {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleAddNewIngredient = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const qty = parseFloat(newQty) || 0;
    const min = parseFloat(newMin) || 0;

    const newItem= {
      id: `INV-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      quantity: qty,
      unit: newUnit,
      minQuantity: min,
      category: newCat,
      status: qty === 0 ? 'out-of-stock' : qty <= min ? 'low-stock' : 'in-stock',
      lastSupplied: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    onAddStockItem(newItem);
    setNewName('');
    setNewQty('20');
    setNewMin('10');
    setIsAdding(false);
  };

  return (
    <div id="inventory-view-layout" className="space-y-6">
      
      {/* Low stock alerts panel */}
      {lowStockItems.length > 0 && (
        <div id="low-stock-critical-alert" className="bg-red-50/70 border border-red-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3 text-red-800 text-xs text-left max-w-2xl">
            <AlertTriangle className="h-4.5 w-4.5 text-red-500 shrink-0 stroke-[2.5]" />
            <div>
              <p className="font-bold">Caution: Low Ingredient Reserves Detected</p>
              <p className="text-red-700 mt-1 leading-relaxed">
                The kitchen currently has {lowStockItems.length} ingredients below minimal threshold metrics (including <b>{lowStockItems.map(i => i.name).join(', ')}</b>). This could disrupt mains and desserts cooking prep.
              </p>
            </div>
          </div>
          <button
            onClick={onRestockLowStock}
            className="px-4 py-2 bg-red-650 hover:bg-red-700 bg-red-600 text-white font-bold rounded-lg text-xs shrink-0 flex items-center space-x-2 shadow-sm transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refill Low Stocks ({lowStockItems.length})</span>
          </button>
        </div>
      )}

      {/* Top Filter and Search tool block */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-1">
          {['all', 'Produce', 'Meat & Seafood', 'Dairy', 'Pantry', 'Beverages'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-505 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Inventory' : cat}
            </button>
          ))}
        </div>

        {/* Search & Actions launcher */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:w-52">
            <input
              type="text"
              placeholder="Search food reserves..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-855 text-white text-xs font-bold rounded-lg flex items-center space-x-1 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Order Supply</span>
          </button>
        </div>
      </div>

      {/* Adding item form */}
      {isAdding && (
        <form onSubmit={handleAddNewIngredient} className="bg-slate-50 border rounded-2xl border-dashed border-slate-355 border-slate-300 p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center space-x-2">
              <Package className="h-4 w-4 text-indigo-600" />
              <span>Register New Raw Good Stream</span>
            </h4>
            <span onClick={() => setIsAdding(false)} className="text-xs font-bold text-slate-400 cursor-pointer">Close</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Ingredient Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Madagascan vanilla pods"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Stocking Group</label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value )}
                className="w-full px-3 py-1.5 border border-slate-205 border-slate-200 rounded-lg text-xs bg-white"
              >
                {['Produce', 'Meat & Seafood', 'Dairy', 'Pantry', 'Beverages'].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-550 text-slate-500 uppercase mb-0.5">Target Value</label>
                <div className="flex space-x-1">
                  <input
                    type="number"
                    required
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    className="w-1/2 px-1 focus:outline-none py-1.5 border border-slate-200 rounded text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="lbs"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-1/2 px-1 focus:outline-none py-1.5 border border-slate-201 rounded text-xs text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Alert Level</label>
                <input
                  type="number"
                  required
                  value={newMin}
                  onChange={(e) => setNewMin(e.target.value)}
                  className="w-full px-1.5 py-1.5 border border-slate-200 rounded text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-1.5 border bg-white text-slate-600 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 border border-indigo-700 text-white rounded-lg text-xs font-bold"
            >
              Commit Supply Line
            </button>
          </div>
        </form>
      )}

      {/* Stock list table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold font-sans">
              <th className="py-3 px-4">Item SKU</th>
              <th className="py-3 px-4">Ingredient Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">In Stock Quantity</th>
              <th className="py-3 px-4 text-right">Threshold Alert Level</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right pr-6">Stock Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item) => {
              const isLow = item.quantity <= item.minQuantity;
              const isOut = item.quantity === 0;

              return (
                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{item.id}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900">{item.name}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5 font-medium">Last supplied: {item.lastSupplied}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 font-semibold text-slate-700 text-[10px] rounded">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-950">
                    {item.quantity} <span className="text-slate-400 font-normal font-sans ml-0.5">{item.unit}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-500">
                    {item.minQuantity} <span className="text-slate-450 font-normal font-sans ml-0.5">{item.unit}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isOut 
                        ? 'bg-red-150 text-red-800' 
                        : isLow 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-emerald-100 text-emerald-850 text-emerald-800'
                    }`}>
                      {isOut ? 'Out of stock' : isLow ? 'Low reserve' : 'Healthy'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right pr-6">
                    <div className="flex items-center justify-end space-x-1.5">
                      {/* Decrease */}
                      <button
                        onClick={() => onUpdateStock(item.id, -1)}
                        className="h-7 w-7 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-bold text-sm text-slate-600 transition-colors flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      {/* Increase */}
                      <button
                        onClick={() => onUpdateStock(item.id, 1)}
                        className="h-7 w-7 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded font-bold text-sm text-indigo-750 transition-colors flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
