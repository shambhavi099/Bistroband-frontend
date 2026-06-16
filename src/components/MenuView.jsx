import  { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  Clock, 
  AlertTriangle,
  Flame,
  ChefHat
} from 'lucide-react';
import api from "../services/api";

export default function MenuView({ 
  menuItems, 
  onAddMenuItem, 
  onUpdatePrice, 
  onToggleAvailability, 
  onDeleteMenuItem 
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Item submission states
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('18');
  const [newCategory, setNewCategory] = useState('Mains');
  const [newPrep, setNewPrep] = useState('15');
  const [newPopular, setNewPopular] = useState(false);

  // Price adjustment inline helper
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPrice, setTempPrice] = useState('');

  const filteredItems = menuItems.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const inName = item.name.toLowerCase().includes(query);
      const inDesc = item.description.toLowerCase().includes(query);
      return inName || inDesc;
    }
    return true;
  });

  const handleAddNewItemSubmit = async (e) => {
    try{
    e.preventDefault();
    if (!newName.trim() || !newDesc.trim()) return;

    const menuItem = {
      name: newName,
      description: newDesc,
      price: parseFloat(newPrice),
      category: newCategory,
      isAvailable: true,
      preparationTime: parseInt(newPrep),
      isPopular: newPopular,
    };

    const response = await api.post("/menu", menuItem);

    onAddMenuItem({
      id: response.data.menuItemId,
      ...response.data.data,
    });
  } catch(error){
    console.log(error.message)
  }

    // Reset Form fields
    setNewName('');
    setNewDesc('');
    setNewPrice('18');
    setNewPrep('15');
    setNewPopular(false);
    setIsAdding(false);
  };

  const handleStartEditPrice = (item) => {
    setEditingPriceId(item.id);
    setTempPrice(item.price.toString());
  };

  const handleSavePrice = (itemId) => {
    const val = parseFloat(tempPrice);
    if (!isNaN(val) && val >= 0) {
      onUpdatePrice(itemId, val);
    }
    setEditingPriceId(null);
  };

  return (
    <div id="menu-view-container" className="space-y-6">
      
      {/* Search, Categories Filter, Custom Item Launcher Bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Categories toggler */}
        <div className="flex flex-wrap gap-1">
          {['all', 'Appetizers', 'Mains', 'Desserts', 'Beverages', 'Sides'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'Full Menu' : cat}
            </button>
          ))}
        </div>

        {/* Input & Form Toggle trigger */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:w-52">
            <input
              type="text"
              placeholder="Search recipe catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shrink-0 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Launch Dish</span>
          </button>
        </div>
      </div>

      {/* Slide-out Adding Form component */}
      {isAdding && (
        <form onSubmit={handleAddNewItemSubmit} className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 flex items-center space-x-1.5">
              <ChefHat className="h-4.5 w-4.5 text-indigo-600" />
              <span>Launch New Chef's Special Recipe</span>
            </h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-650">
              <EyeOff className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-501 lowercase text-slate-500 uppercase mb-1">Recipe / Dish Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Lobster thermidor linguine"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-205 border-slate-250 bg-white rounded-lg text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category Group</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value )}
                className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs focus:outline-none"
              >
                {['Appetizers', 'Mains', 'Desserts', 'Beverages', 'Sides'].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-205 bg-white rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Prep Time (min)</label>
                <input
                  type="number"
                  required
                  value={newPrep}
                  onChange={(e) => setNewPrep(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-205 bg-white rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Culinary Description</label>
            <textarea
              required
              rows={2}
              placeholder="Sautéed hand-picked lobster claws with white burgundy and chives folded in linguine."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-205 bg-white rounded-lg text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center space-x-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={newPopular}
                onChange={(e) => setNewPopular(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Tag as Popular Seller (Highlight on dashboard metrics)</span>
            </label>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3.5 py-1.5 bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
              >
                Add to Live Menu
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Grid of actual menu items */}
      <div id="recipe-catalog-cards" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border">
            <AlertTriangle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No dishes match active tags</p>
            <p className="text-xs text-slate-500 mt-1">Refine filters or add a new creation above.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isEditingPrice = editingPriceId === item.id;
            
            return (
              <div 
                key={item.id} 
                className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  item.isAvailable ? 'border-slate-100' : 'border-slate-200 bg-slate-50/50 opacity-75'
                }`}
              >
                <div className="space-y-2">
                  
                  {/* Category Indicator & Tags */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                    <div className="flex gap-1.5">
                      {item.isPopular && (
                        <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded font-bold uppercase inline-flex items-center space-x-0.5">
                          <Flame className="h-3 w-3 fill-amber-500 text-amber-500" />
                          <span>Popular</span>
                        </span>
                      )}
                      {!item.isAvailable && (
                        <span className="bg-red-50 text-red-650 text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                          Sold Out
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Price */}
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-slate-900 font-sans tracking-tight">{item.name}</h4>
                    
                    {isEditingPrice ? (
                      <div className="flex items-center space-x-1 shrink-0">
                        <span className="text-xs text-slate-400 font-bold">$</span>
                        <input
                          type="text"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(e.target.value)}
                          className="w-12 px-1 py-0.5 border border-slate-300 rounded text-xs font-mono font-bold text-right"
                        />
                        <button 
                          onClick={() => handleSavePrice(item.id)}
                          className="p-0.5 bg-emerald-500 hover:bg-emerald-600 rounded text-white"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => handleStartEditPrice(item)}
                        className="flex items-center space-x-1.5 group cursor-pointer shrink-0"
                      >
                        <span className="text-xs font-mono font-extrabold text-indigo-700">${item.price}</span>
                        <Edit2 className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-500 tracking-normal leading-relaxed">{item.description}</p>
                </div>

                {/* Card footer details & toggle switches */}
                <div className="mt-4 pt-3.5 border-t border-slate-100/50 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-semibold font-mono">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Prep: {item.preparationTime} mins</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Toggle availability */}
                    <button
                      onClick={() => onToggleAvailability(item.id)}
                      title={item.isAvailable ? "Set Sold Out" : "Set Available"}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        item.isAvailable 
                          ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200' 
                          : 'bg-indigo-50 border-indigo-200 text-indigo-605 text-indigo-600 hover:bg-indigo-100'
                      }`}
                    >
                      {item.isAvailable ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>

                    {/* Delete item */}
                    <button
                      onClick={() => {
                      console.log("Deleting:", item.id);
                      onDeleteMenuItem(item.id);
                    }}
                      title="Decommission Dish"
                      className="p-1.5 rounded-lg border border-red-150 hover:bg-red-50 text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
