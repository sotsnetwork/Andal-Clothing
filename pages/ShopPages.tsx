import React, { useState, useEffect, useRef } from 'react';
import { Product, Page, CartItem, Review } from '../types';
import { Button, Modal, Input } from '../components/Shared';

// --- MOCK DATA ---
export const PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Royal Grand Agbada', 
    price: 150000, 
    category: 'Agbadas', 
    image: 'https://placehold.co/800x1000/1a1a1a/FFF?text=Royal+Agbada', 
    isNew: true, 
    collection: 'Eid', 
    colors: ['Black', 'Navy', 'Gold'],
    description: "An embodiment of traditional elegance, this Agbada is crafted from the finest materials. Designed for the modern man who values heritage, comfort, and sophistication."
  },
  { 
    id: '2', 
    name: 'Premium White Jalabiya', 
    price: 25000, 
    category: 'Jalabiyas', 
    image: 'https://placehold.co/800x1000/EAEAEA/1A1A1A?text=White+Jalabiya', 
    colors: ['White', 'Cream'],
    description: "Experience the purity of comfort with our Premium White Jalabiya, perfect for Friday prayers or casual gatherings."
  },
  { 
    id: '3', 
    name: 'Hand-Embroidered Zanna Cap', 
    price: 12000, 
    category: 'Caps', 
    image: 'https://placehold.co/800x1000/333/FFF?text=Zanna+Cap', 
    colors: ['Black', 'White', 'Multi'],
    description: "A meticulously hand-woven cap that adds a crowning touch to any traditional outfit."
  },
  { 
    id: '4', 
    name: 'Swiss Voile Fabric - Navy', 
    price: 30000, 
    category: 'Fabrics', 
    image: 'https://placehold.co/800x1000/172554/FFF?text=Swiss+Voile', 
    collection: 'Textiles', 
    colors: ['Navy'],
    description: "High-grade Swiss Voile fabric, known for its breathability and durability. Ideal for custom tailoring."
  },
  { 
    id: '5', 
    name: 'Emirate Black Kaftan', 
    price: 45000, 
    category: 'Kaftan', 
    image: 'https://placehold.co/800x1000/000/FFF?text=Black+Kaftan', 
    colors: ['Black'],
    description: "Sleek, stylish, and commanding. The Emirate Black Kaftan is a staple for the contemporary gentleman."
  },
  { 
    id: '6', 
    name: 'Classic Hausa Fila', 
    price: 8000, 
    category: 'Caps', 
    image: 'https://placehold.co/800x1000/666/FFF?text=Hausa+Fila', 
    colors: ['Cream', 'Brown'],
    description: "Traditional Hausa Fila cap, representing culture and prestige."
  },
  { 
    id: '7', 
    name: 'Atiku Jacquard Fabric', 
    price: 28000, 
    category: 'Fabrics', 
    image: 'https://placehold.co/800x1000/e5e5e5/333?text=Atiku+Fabric', 
    colors: ['White', 'Cream', 'Silver'],
    description: "Luxurious Atiku Jacquard fabric with subtle patterns for a refined look."
  },
  { 
    id: '8', 
    name: 'Ceremonial Gold Agbada', 
    price: 210000, 
    category: 'Agbadas', 
    image: 'https://placehold.co/800x1000/B8860B/FFF?text=Gold+Agbada', 
    isNew: true, 
    colors: ['Gold', 'Brown'],
    description: "Stand out in any ceremony with this opulent Gold Agbada, featuring heavy embroidery."
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

// --- HELPER: Fuzzy Matching ---
const getLevenshteinDistance = (a: string, b: string) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[b.length][a.length];
};

// --- HOME PAGE ---
export const Home: React.FC<{ onNavigate: (page: Page, params?: any) => void }> = ({ onNavigate }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center bg-gray-900 text-white">
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/172554/FFF?text=Man+in+Blue+Agbada')] bg-cover bg-center"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight tracking-tight">The Essence of Nobility</h1>
          <p className="text-lg md:text-xl mb-10 font-light opacity-90 max-w-2xl mx-auto">Elevate your presence with our premium collection of Agbadas, Jalabiyas, and authentic hand-woven caps.</p>
          <Button onClick={() => onNavigate(Page.SHOP)} className="bg-white text-black hover:bg-gray-200 border-none">Shop the Collection</Button>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 px-6 md:px-10 max-w-[1920px] mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">Latest Arrivals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.slice(0, 4).map(product => (
            <div key={product.id} className="group cursor-pointer" onClick={() => onNavigate(Page.PRODUCT, { id: product.id })}>
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-4 relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {product.isNew && <span className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider">New</span>}
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{product.category}</p>
                </div>
                <span className="font-medium">{formatCurrency(product.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 px-6 md:px-10 max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative h-[500px] group cursor-pointer rounded-xl overflow-hidden" onClick={() => onNavigate(Page.SHOP, { category: 'Agbadas' })}>
            <img src="https://placehold.co/600x800/222/FFF?text=Agbada+Collection" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-3xl font-serif font-bold mb-2">Grand Agbadas</h3>
              <span className="text-sm font-medium border-b border-white pb-1">Shop Ceremonial</span>
            </div>
          </div>
          <div className="relative h-[500px] group cursor-pointer rounded-xl overflow-hidden" onClick={() => onNavigate(Page.SHOP, { category: 'Jalabiyas' })}>
            <img src="https://placehold.co/600x800/444/FFF?text=Jalabiyas+%26+Kaftans" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-3xl font-serif font-bold mb-2">Jalabiyas & Kaftans</h3>
              <span className="text-sm font-medium border-b border-white pb-1">Shop Everyday</span>
            </div>
          </div>
          <div className="relative h-[500px] group cursor-pointer rounded-xl overflow-hidden" onClick={() => onNavigate(Page.SHOP, { category: 'Caps' })}>
            <img src="https://placehold.co/600x800/666/FFF?text=Caps+%26+Accessories" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-3xl font-serif font-bold mb-2">Caps & Accessories</h3>
              <span className="text-sm font-medium border-b border-white pb-1">Discover Fila</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-3xl font-serif font-bold mb-4">Join the Inner Circle</h2>
          <p className="text-gray-600 mb-8">Be the first to know about new fabric arrivals, exclusive Agbada drops, and special events.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Enter your email" className="flex-1 h-12 px-4 bg-white border border-gray-200 rounded focus:outline-none focus:border-primary" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- SHOP PAGE (PLP) ---
interface ShopProps {
  onNavigate: (page: Page, params?: any) => void;
  params?: any;
  wishlist?: string[];
  toggleWishlist?: (id: string) => void;
  addToCart?: (product: Product, size: string, color: string) => void;
}

export const Shop: React.FC<ShopProps> = ({ onNavigate, params, wishlist, toggleWishlist, addToCart }) => {
  const currentCategory = params?.category || 'All';
  const initialSearch = params?.search || '';
  const [localSearchQuery, setLocalSearchQuery] = useState(initialSearch);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('newest');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [qvSize, setQvSize] = useState('M');
  const [qvColor, setQvColor] = useState('Black');

  useEffect(() => {
    setLocalSearchQuery(params?.search || '');
  }, [params]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    
    if (query.length > 1) {
      const suggestions = new Set<string>();
      PRODUCTS.forEach(p => {
        if (p.name.toLowerCase().includes(query.toLowerCase())) suggestions.add(p.name);
        if (p.category.toLowerCase().includes(query.toLowerCase())) suggestions.add(p.category);
      });
      setSearchSuggestions(Array.from(suggestions).slice(0, 5));
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalSearchQuery(suggestion);
    setSearchSuggestions([]);
  };

  const filteredProducts = PRODUCTS.filter(p => {
    // Category Filter
    let categoryMatch = false;
    if (currentCategory === 'All') {
      categoryMatch = true;
    } else if (currentCategory === 'New Arrivals') {
      categoryMatch = p.isNew === true;
    } else if (currentCategory === 'Jalabiyas') {
      categoryMatch = p.category === 'Jalabiyas' || p.category === 'Kaftan';
    } else {
      categoryMatch = p.category === currentCategory;
    }

    // Search Filter with Fuzzy Logic
    const searchMatch = localSearchQuery 
      ? (() => {
          const q = localSearchQuery.toLowerCase();
          const n = p.name.toLowerCase();
          const d = (p.description || '').toLowerCase();
          const c = p.category.toLowerCase();
          
          // Direct match
          if (n.includes(q) || d.includes(q) || c.includes(q)) return true;
          
          // Fuzzy match on individual words
          const words = [...n.split(/\s+/), ...c.split(/\s+/)];
          const queryWords = q.split(/\s+/);
          
          return queryWords.every(qw => 
            words.some(w => {
               if (Math.abs(w.length - qw.length) > 2) return false;
               return getLevenshteinDistance(w, qw) <= 2;
            })
          );
        })()
      : true;

    // Color Filter
    const colorMatch = activeColor ? p.colors?.includes(activeColor) : true;

    return categoryMatch && searchMatch && colorMatch;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    return 0; // Default to natural order
  });

  const colorPalette = [
    { name: 'Black', class: 'bg-black' },
    { name: 'White', class: 'bg-white border border-gray-200' },
    { name: 'Cream', class: 'bg-[#EAEAEA]' },
    { name: 'Navy', class: 'bg-blue-900' },
    { name: 'Gold', class: 'bg-[#B8860B]' },
  ];

  const handleClearFilters = () => {
    setActiveColor(null);
    setLocalSearchQuery('');
    onNavigate(Page.SHOP); // Resets category
  };

  const openQuickView = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setQuickViewProduct(product);
    setQvColor(product.colors?.[0] || 'Black');
    setQvSize('M');
  };

  const handleQuickViewAddToCart = () => {
    if (quickViewProduct && addToCart) {
      addToCart(quickViewProduct, qvSize, qvColor);
      setQuickViewProduct(null);
    }
  };

  return (
    <div className="max-w-[1920px] mx-auto px-6 md:px-10 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Filters</h3>
            <button className="text-sm text-gray-500 hover:text-black underline" onClick={handleClearFilters}>Clear All</button>
          </div>
          
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Category</h4>
            <div className="space-y-3">
              {['New Arrivals', 'Agbadas', 'Jalabiyas', 'Caps', 'Fabrics'].map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 hover:text-black">
                  <input 
                    type="checkbox" 
                    checked={currentCategory === cat} 
                    onChange={() => onNavigate(Page.SHOP, { category: cat })}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" 
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Size</h4>
            <div className="grid grid-cols-4 gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <button key={size} className="h-10 border border-gray-200 rounded hover:border-black hover:bg-gray-50 text-sm transition-colors">{size}</button>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Color</h4>
            <div className="flex flex-wrap gap-3">
              {colorPalette.map((color, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveColor(activeColor === color.name ? null : color.name)}
                  className={`w-8 h-8 rounded-full ${color.class} hover:ring-2 ring-offset-2 ring-primary transition-all relative`}
                  title={color.name}
                >
                  {activeColor === color.name && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className={`material-symbols-outlined text-[10px] ${color.name === 'White' || color.name === 'Cream' ? 'text-black' : 'text-white'}`}>check</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Enhanced Search Bar */}
          <div className="mb-8 relative max-w-xl">
             <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input 
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all"
                  placeholder="Search products by name, category..."
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                />
             </div>
             {/* Autocomplete Suggestions */}
             {isSearchFocused && searchSuggestions.length > 0 && (
               <div className="absolute top-full left-0 w-full bg-white border border-gray-100 shadow-lg rounded-lg mt-1 z-20">
                 {searchSuggestions.map((suggestion, idx) => (
                   <div 
                    key={idx} 
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                   >
                     {suggestion}
                   </div>
                 ))}
               </div>
             )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <div className="flex gap-2 text-sm text-gray-500 mb-2">
                <span onClick={() => onNavigate(Page.HOME)} className="cursor-pointer hover:text-black">Home</span> / 
                <span className="text-black">{currentCategory}</span>
              </div>
              <h1 className="text-4xl font-serif font-bold">
                {localSearchQuery ? `Results for "${localSearchQuery}"` : (currentCategory === 'All' ? "Men's Traditional Wear" : currentCategory)}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{sortedProducts.length} items</span>
              <select 
                className="h-10 border border-gray-200 rounded px-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(currentCategory !== 'All' || localSearchQuery || activeColor) && (
            <div className="flex gap-2 mb-8 flex-wrap">
              {currentCategory !== 'All' && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                  Category: {currentCategory} <span className="material-symbols-outlined text-sm cursor-pointer" onClick={() => onNavigate(Page.SHOP)}>close</span>
                </span>
              )}
              {localSearchQuery && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                  Search: "{localSearchQuery}" <span className="material-symbols-outlined text-sm cursor-pointer" onClick={() => setLocalSearchQuery('')}>close</span>
                </span>
              )}
              {activeColor && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                  Color: {activeColor} <span className="material-symbols-outlined text-sm cursor-pointer" onClick={() => setActiveColor(null)}>close</span>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {sortedProducts.map(product => (
                <div key={product.id} className="group cursor-pointer relative" onClick={() => onNavigate(Page.PRODUCT, { id: product.id })}>
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-4 relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {product.isNew && <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-bold uppercase tracking-wider z-10">New Arrival</span>}
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                      <Button 
                        variant="secondary" 
                        className="flex-1 h-10 text-sm shadow-lg" 
                        onClick={(e) => openQuickView(e, product)}
                      >
                        Quick View
                      </Button>
                    </div>

                    {/* Wishlist Button */}
                    <button 
                      className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-colors z-10 ${wishlist?.includes(product.id) ? 'text-red-500' : 'text-gray-400'}`}
                      onClick={(e) => { e.stopPropagation(); toggleWishlist && toggleWishlist(product.id); }}
                    >
                      <span className={`material-symbols-outlined ${wishlist?.includes(product.id) ? 'fill-current' : ''}`}>favorite</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-base group-hover:text-gray-600 transition-colors">{product.name}</h3>
                      {product.collection && <p className="text-gray-500 text-xs mt-1">{product.collection} Collection</p>}
                    </div>
                    <span className="font-medium text-sm">{formatCurrency(product.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">No products found matching your criteria.</p>
              <Button className="mt-4" onClick={handleClearFilters}>View All Products</Button>
            </div>
          )}

          {/* Pagination */}
          {sortedProducts.length > 0 && (
            <div className="mt-16 flex justify-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-black hover:border-black transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
              <button className="w-10 h-10 flex items-center justify-center rounded bg-black text-white font-medium">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 font-medium transition-colors">2</button>
              <span className="w-10 h-10 flex items-center justify-center">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 hover:border-black transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <Modal isOpen={!!quickViewProduct} onClose={() => setQuickViewProduct(null)}>
        {quickViewProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
               <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
               <h2 className="text-2xl font-serif font-bold mb-2">{quickViewProduct.name}</h2>
               <p className="text-xl font-medium mb-4">{formatCurrency(quickViewProduct.price)}</p>
               <p className="text-gray-600 mb-6 text-sm leading-relaxed">{quickViewProduct.description}</p>
               
               <div className="space-y-4 mb-8">
                 <div>
                   <span className="block text-sm font-bold mb-2">Color: {qvColor}</span>
                   <div className="flex gap-2">
                     {quickViewProduct.colors?.map(c => (
                       <button 
                        key={c}
                        onClick={() => setQvColor(c)}
                        className={`w-6 h-6 rounded-full border border-gray-200 ${qvColor === c ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                        style={{ backgroundColor: c === 'White' || c === 'Cream' ? '#EAEAEA' : c.toLowerCase() === 'gold' ? '#B8860B' : c.toLowerCase() === 'navy' ? '#172554' : 'black' }}
                       />
                     ))}
                   </div>
                 </div>
                 <div>
                   <span className="block text-sm font-bold mb-2">Size: {qvSize}</span>
                   <div className="flex gap-2">
                      {['S', 'M', 'L', 'XL'].map(s => (
                        <button 
                          key={s}
                          onClick={() => setQvSize(s)}
                          className={`w-10 h-10 border rounded text-sm ${qvSize === s ? 'bg-black text-white border-black' : 'border-gray-200'}`}
                        >
                          {s}
                        </button>
                      ))}
                   </div>
                 </div>
               </div>

               <div className="mt-auto">
                 <Button onClick={handleQuickViewAddToCart} className="w-full mb-3">Add to Bag</Button>
                 <button 
                  className="w-full text-center text-sm underline hover:text-gray-600"
                  onClick={() => { setQuickViewProduct(null); onNavigate(Page.PRODUCT, { id: quickViewProduct.id }); }}
                 >
                   View Full Details
                 </button>
               </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// --- PRODUCT DETAIL PAGE ---
export const ProductDetail: React.FC<{ 
  id?: string; 
  onNavigate: (page: Page, params?: any) => void;
  addToCart?: (product: Product, size: string, color: string) => void;
  wishlist?: string[];
  toggleWishlist?: (id: string) => void;
  reviews?: Review[];
  onAddReview?: (productId: string, review: Review) => void;
}> = ({ id, onNavigate, addToCart, wishlist, toggleWishlist, reviews = [], onAddReview }) => {
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [comment, setComment] = useState('');

  // Handle Recently Viewed
  useEffect(() => {
    if (!id) return;
    try {
      // Get existing
      const stored = localStorage.getItem('recentlyViewed');
      let viewedIds: string[] = stored ? JSON.parse(stored) : [];
      
      // Filter current id to move to front
      viewedIds = viewedIds.filter(vId => vId !== id);
      viewedIds.unshift(id);
      
      // Limit to 6
      if (viewedIds.length > 6) viewedIds = viewedIds.slice(0, 6);
      
      // Save back
      localStorage.setItem('recentlyViewed', JSON.stringify(viewedIds));
      
      // Set state for OTHER items (exclude current product)
      const others = viewedIds.filter(vId => vId !== id);
      const otherProducts = others.map(vId => PRODUCTS.find(p => p.id === vId)).filter(Boolean) as Product[];
      setRecentlyViewed(otherProducts);
    } catch (e) {
      console.error("Failed to update recently viewed", e);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(product, selectedSize, selectedColor);
      onNavigate(Page.CART);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddReview && id) {
      const newReview: Review = {
        id: Math.random().toString(36).substr(2, 9),
        reviewerName,
        rating,
        comment,
        date: new Date().toLocaleDateString()
      };
      onAddReview(id, newReview);
      setReviewerName('');
      setComment('');
      setRating(5);
    }
  };

  const shareUrl = window.location.href;
  const shareText = `Check out this ${product.name} from Andal Clothing!`;

  return (
    <div className="max-w-[1920px] mx-auto px-6 md:px-10 py-12">
      <div className="mb-8 text-sm text-gray-500 flex gap-2">
        <span className="hover:text-black cursor-pointer" onClick={() => onNavigate(Page.HOME)}>Home</span> / 
        <span className="hover:text-black cursor-pointer" onClick={() => onNavigate(Page.SHOP)}>Men</span> / 
        <span className="text-black">{product.category}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative cursor-zoom-in group">
             <img 
               src={product.image} 
               alt={product.name} 
               className="w-full h-full object-cover transition-transform duration-700 hover:scale-125" 
             />
             <button 
                className={`absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-colors z-20 ${wishlist?.includes(product.id) ? 'text-red-500' : 'text-gray-400'}`}
                onClick={() => toggleWishlist && toggleWishlist(product.id)}
              >
                <span className={`material-symbols-outlined ${wishlist?.includes(product.id) ? 'fill-current' : ''}`}>favorite</span>
              </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg cursor-pointer hover:opacity-80 transition-opacity overflow-hidden">
                 <img src={product.image} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col h-full">
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">{product.name}</h1>
          <p className="text-2xl font-medium mb-8">{formatCurrency(product.price)}</p>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description || "An embodiment of traditional elegance, this attire is crafted from the finest materials. Designed for the modern man who values heritage, comfort, and sophistication. Perfect for special occasions, ceremonies, or Friday prayers."}
          </p>

          <div className="space-y-6 mb-10">
            <div>
              <span className="block text-sm font-bold mb-3">Color: {selectedColor}</span>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedColor('Black')}
                  className={`w-8 h-8 rounded-full bg-black ${selectedColor === 'Black' ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                ></button>
                <button 
                  onClick={() => setSelectedColor('White')}
                  className={`w-8 h-8 rounded-full bg-[#EAEAEA] border border-gray-200 ${selectedColor === 'White' ? 'ring-2 ring-offset-2 ring-gray-300' : ''}`}
                ></button>
                <button 
                  onClick={() => setSelectedColor('Navy')}
                  className={`w-8 h-8 rounded-full bg-blue-900 border border-gray-200 ${selectedColor === 'Navy' ? 'ring-2 ring-offset-2 ring-gray-300' : ''}`}
                ></button>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-3">
                <span className="text-sm font-bold">Size: {selectedSize}</span>
                <button className="text-sm text-gray-500 underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button 
                    key={size} 
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 border rounded flex items-center justify-center text-sm font-medium transition-all ${selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={handleAddToCart} className="w-full mb-8 text-lg">Add to Bag</Button>

          {/* Social Share */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-bold">Share:</span>
            <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`)} className="text-gray-500 hover:text-green-600 transition-colors">WhatsApp</button>
            <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)} className="text-gray-500 hover:text-blue-400 transition-colors">Twitter</button>
            <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)} className="text-gray-500 hover:text-blue-700 transition-colors">Facebook</button>
          </div>

          <div className="border-t border-gray-200">
            <details className="group py-4 border-b border-gray-200 cursor-pointer">
              <summary className="flex justify-between items-center font-medium list-none">
                Product Details
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="pt-4 text-gray-600 text-sm space-y-2">
                <p>• Premium imported fabric</p>
                <p>• Intricate embroidery details</p>
                <p>• Authentic traditional cut</p>
                <p>• Dry clean recommended</p>
              </div>
            </details>
            <details className="group py-4 border-b border-gray-200 cursor-pointer">
              <summary className="flex justify-between items-center font-medium list-none">
                Shipping & Returns
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="pt-4 text-gray-600 text-sm">
                <p>Worldwide shipping available. Returns accepted within 14 days of delivery for unworn items.</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 max-w-4xl">
        <h2 className="text-3xl font-serif font-bold mb-8">Customer Reviews</h2>
        
        {/* Review Form */}
        <div className="bg-gray-50 p-6 rounded-xl mb-12">
          <h3 className="text-lg font-bold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input value={reviewerName} onChange={e => setReviewerName(e.target.value)} required placeholder="Your Name" />
              </div>
              <div className="w-32">
                 <label className="block text-sm font-medium mb-1">Rating</label>
                 <select 
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded focus:outline-none focus:border-primary"
                  value={rating}
                  onChange={e => setRating(Number(e.target.value))}
                 >
                   <option value="5">5 Stars</option>
                   <option value="4">4 Stars</option>
                   <option value="3">3 Stars</option>
                   <option value="2">2 Stars</option>
                   <option value="1">1 Star</option>
                 </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comment</label>
              <textarea 
                className="w-full h-24 px-4 py-3 bg-white border border-gray-200 rounded focus:outline-none focus:border-primary resize-none"
                value={comment}
                onChange={e => setComment(e.target.value)}
                required
                placeholder="Share your thoughts about this product..."
              ></textarea>
            </div>
            <Button type="submit">Submit Review</Button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review, i) => (
              <div key={i} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold">{review.reviewerName}</span>
                    <div className="flex text-yellow-500 text-sm my-1">
                      {[...Array(5)].map((_, starIndex) => (
                        <span key={starIndex} className="material-symbols-outlined text-sm filled" style={{ fontVariationSettings: `'FILL' ${starIndex < review.rating ? 1 : 0}` }}>star</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm">{review.date}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))
          ) : (
             <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="mt-24 border-t border-gray-200 pt-16">
           <h2 className="text-3xl font-serif font-bold text-center mb-12">Recently Viewed</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
             {recentlyViewed.map(p => (
               <div key={p.id} className="group cursor-pointer" onClick={() => onNavigate(Page.PRODUCT, { id: p.id })}>
                 <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 </div>
                 <h3 className="font-medium text-xs md:text-sm truncate">{p.name}</h3>
                 <p className="text-gray-500 text-xs">{formatCurrency(p.price)}</p>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="mt-24">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">Complete The Look</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {PRODUCTS.slice(2, 6).map(p => (
             <div key={p.id} className="group cursor-pointer" onClick={() => onNavigate(Page.PRODUCT, { id: p.id })}>
               <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                 <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               <h3 className="font-medium text-sm">{p.name}</h3>
               <p className="text-gray-500 text-sm">{formatCurrency(p.price)}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// --- CART PAGE ---
interface CartProps {
  onNavigate: (page: Page, params?: any) => void;
  isAuthenticated?: boolean;
  cartItems?: CartItem[];
  updateQuantity?: (id: string, size: string, color: string, delta: number) => void;
  removeFromCart?: (id: string, size: string, color: string) => void;
}

export const Cart: React.FC<CartProps> = ({ 
  onNavigate, 
  isAuthenticated, 
  cartItems = [], 
  updateQuantity, 
  removeFromCart 
}) => {
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      onNavigate(Page.CHECKOUT_SUCCESS);
    } else {
      onNavigate(Page.LOGIN);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 5000 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_bag</span>
        <h1 className="text-2xl font-serif font-bold mb-2">Your Bag is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added any items yet.</p>
        <Button onClick={() => onNavigate(Page.SHOP)}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <h1 className="text-4xl font-serif font-bold mb-12">Shopping Bag</h1>
      
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cart Items */}
        <div className="flex-1 space-y-8">
          {cartItems.map((item, index) => (
            <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="flex gap-6 py-6 border-b border-gray-100">
              <div className="w-24 h-32 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => onNavigate(Page.PRODUCT, { id: item.id })}>
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex justify-between">
                <div>
                  <h3 className="font-medium text-lg cursor-pointer hover:underline" onClick={() => onNavigate(Page.PRODUCT, { id: item.id })}>{item.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">Size: {item.selectedSize}</p>
                  <p className="text-gray-500 text-sm">Color: {item.selectedColor}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <button 
                      onClick={() => updateQuantity && updateQuantity(item.id, item.selectedSize, item.selectedColor, -1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity && updateQuantity(item.id, item.selectedSize, item.selectedColor, 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  <button 
                    onClick={() => removeFromCart && removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                    className="text-gray-400 hover:text-red-500 flex items-center gap-1 text-sm"
                  >
                    <span className="material-symbols-outlined text-lg">close</span> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 bg-gray-50 p-8 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">{formatCurrency(shipping)}</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between text-base">
              <span className="font-bold">Total</span>
              <span className="font-bold">{formatCurrency(total)}</span>
            </div>
          </div>
          
          <Button onClick={handleCheckout} className="w-full">
            {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
          </Button>
          {!isAuthenticated && (
             <p className="text-xs text-red-500 text-center mt-2">You must be logged in to complete your order.</p>
          )}
          
          <div className="mt-6 text-center">
             <p className="text-xs text-gray-500 mb-4">We accept</p>
             <div className="flex justify-center gap-3 opacity-50">
                <span className="material-symbols-outlined">credit_card</span>
                <span className="material-symbols-outlined">account_balance_wallet</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUCCESS PAGE ---
export const CheckoutSuccess: React.FC<{ onNavigate: (page: Page, params?: any) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center bg-[#101022] text-white">
      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-8">
        <span className="material-symbols-outlined text-4xl text-blue-400">check_circle</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Thank You For Your Order</h1>
      <p className="text-gray-400 max-w-md mb-12 text-lg">Your order #11232-23424 has been placed. A confirmation email with all the details has been sent to your inbox.</p>
      
      <div className="bg-white/5 p-8 rounded-xl w-full max-w-2xl text-left mb-12 border border-white/10">
        <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Order Summary</h2>
        <div className="space-y-6">
           <div className="flex gap-4">
             <img src={PRODUCTS[0].image} className="w-16 h-16 object-cover rounded" />
             <div className="flex-1">
                <p className="font-medium">{PRODUCTS[0].name}</p>
                <p className="text-sm text-gray-400">Size: L, Color: Gold</p>
             </div>
             <span>{formatCurrency(PRODUCTS[0].price)}</span>
           </div>
           <div className="flex gap-4">
             <img src={PRODUCTS[4].image} className="w-16 h-16 object-cover rounded" />
             <div className="flex-1">
                <p className="font-medium">{PRODUCTS[4].name}</p>
                <p className="text-sm text-gray-400">Color: Classic Grey</p>
             </div>
             <span>{formatCurrency(PRODUCTS[4].price)}</span>
           </div>
        </div>
        <div className="border-t border-white/10 mt-6 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatCurrency(PRODUCTS[0].price + PRODUCTS[4].price)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button onClick={() => {}} className="flex-1 bg-blue-600 hover:bg-blue-700">Track Your Order</Button>
        <Button onClick={() => onNavigate(Page.SHOP)} className="flex-1 bg-transparent border border-white/20 text-white hover:bg-white/10">Continue Shopping</Button>
      </div>
    </div>
  );
};