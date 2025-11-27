
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
    images: [
      'https://placehold.co/800x1000/1a1a1a/FFF?text=Royal+Agbada',
      'https://placehold.co/800x1000/2a2a2a/FFF?text=Detail+View',
      'https://placehold.co/800x1000/111/FFF?text=Side+Profile'
    ],
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
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  
  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [qvSize, setQvSize] = useState('M');
  const [qvColor, setQvColor] = useState('Black');

  useEffect(() => {
    setLocalSearchQuery(params?.search || '');
  }, [params]);

  // Handle outside click for search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setIsSearchFocused(false);
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
                <div key={cat} className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id={`category-filter-${cat.replace(/\s+/g, '-')}`}
                    checked={currentCategory === cat} 
                    onChange={() => onNavigate(Page.SHOP, { category: cat })}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" 
                  />
                  <label 
                    htmlFor={`category-filter-${cat.replace(/\s+/g, '-')}`}
                    className="text-sm text-gray-600 hover:text-black cursor-pointer select-none"
                  >
                    {cat}
                  </label>
                </div>
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
                  aria-label={`Filter by color ${color.name}`}
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
          <div className="mb-8 relative max-w-xl" ref={searchContainerRef}>
             <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input 
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all"
                  placeholder="Search products by name, category..."
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  aria-label="Search products"
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
                aria-label="Sort products"
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
                <div 
                  key={product.id} 
                  className={`group cursor-pointer relative transition-opacity duration-300 ${hoveredProductId && hoveredProductId !== product.id ? 'opacity-50' : 'opacity-100'}`}
                  onClick={() => onNavigate(Page.PRODUCT, { id: product.id })}
                  onMouseEnter={() => setHoveredProductId(product.id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-4 relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {product.isNew && <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-bold uppercase tracking-wider z-10">New Arrival</span>}
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                      <Button 
                        variant="secondary" 
                        className="flex-1 h-10 text-sm shadow-lg flex items-center justify-center gap-2" 
                        onClick={(e) => openQuickView(e, product)}
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                        Quick View
                      </Button>
                    </div>

                    {/* Wishlist Button */}
                    <button 
                      className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-colors z-10 ${wishlist?.includes(product.id) ? 'text-red-500' : 'text-gray-400'}`}
                      onClick={(e) => { e.stopPropagation(); toggleWishlist && toggleWishlist(product.id); }}
                      aria-label="Add to wishlist"
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
               <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                 {quickViewProduct.description && quickViewProduct.description.length > 150 
                   ? `${quickViewProduct.description.substring(0, 150)}...` 
                   : quickViewProduct.description}
               </p>
               
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
                        aria-label={`Select color ${c}`}
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
  
  // Gallery State
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  
  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [comment, setComment] = useState('');

  // Init Gallery
  useEffect(() => {
    const initialImages = product.images && product.images.length > 0 ? product.images : [product.image];
    setGalleryImages(initialImages);
    setActiveImage(initialImages[0]);
  }, [product]);

  // Handle File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newImageUrls = files.map(file => URL.createObjectURL(file as Blob));
      const updatedGallery = [...galleryImages, ...newImageUrls];
      setGalleryImages(updatedGallery);
      if (!activeImage) setActiveImage(newImageUrls[0]);
    }
  };

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
               src={activeImage} 
               alt={product.name} 
               className="w-full h-full object-cover transition-transform duration-700 hover:scale-125" 
             />
             <button 
                className={`absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-colors z-20 ${wishlist?.includes(product.id) ? 'text-red-500' : 'text-gray-400'}`}
                onClick={() => toggleWishlist && toggleWishlist(product.id)}
                aria-label="Add to wishlist"
              >
                <span className={`material-symbols-outlined ${wishlist?.includes(product.id) ? 'fill-current' : ''}`}>favorite</span>
              </button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {galleryImages.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setActiveImage(img)}
                className={`aspect-[3/4] bg-gray-100 rounded-lg cursor-pointer overflow-hidden border-2 ${activeImage === img ? 'border-black' : 'border-transparent hover:border-gray-300'} transition-all`}
              >
                 <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
             {/* Upload Photos Button */}
             <label className="aspect-[3/4] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors text-gray-400 hover:text-gray-600">
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                <span className="text-[10px] uppercase font-bold mt-1">Add</span>
             </label>
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
                  aria-label="Select color Black"
                ></button>
                <button 
                  onClick={() => setSelectedColor('White')}
                  className={`w-8 h-8 rounded-full bg-[#EAEAEA] border border-gray-200 ${selectedColor === 'White' ? 'ring-2 ring-offset-2 ring-gray-300' : ''}`}
                  aria-label="Select color White"
                ></button>
                <button 
                  onClick={() => setSelectedColor('Navy')}
                  className={`w-8 h-8 rounded-full bg-blue-900 border border-gray-200 ${selectedColor === 'Navy' ? 'ring-2 ring-offset-2 ring-gray-300' : ''}`}
                  aria-label="Select color Navy"
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

          <Button onClick={handleAddToCart} className="w-full mb-4 text-lg">Add to Bag</Button>

          {/* Share Trigger */}
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full h-12 border border-gray-200 rounded font-medium hover:bg-gray-50 transition-colors mb-8"
          >
            <span className="material-symbols-outlined text-lg">share</span>
            Share This Product
          </button>

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

      {/* Customers Also Bought Section */}
      <div className="mt-20 border-t border-gray-200 pt-16">
        <h2 className="text-3xl font-serif font-bold mb-10">Customers Also Bought</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PRODUCTS.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                <div key={p.id} className="group cursor-pointer" onClick={() => onNavigate(Page.PRODUCT, { id: p.id })}>
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h3 className="font-medium text-sm">{p.name}</h3>
                    <p className="text-gray-500 text-sm">{formatCurrency(p.price)}</p>
                </div>
            ))}
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

      {/* Recommendations / Complete the Look */}
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

      {/* Share Modal */}
      <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)}>
        <div className="p-8 text-center max-w-sm mx-auto">
          <h3 className="text-2xl font-serif font-bold mb-2">Share this Product</h3>
          <p className="text-gray-500 mb-8 text-sm">Spread the word about the {product.name}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`)} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </div>
              <span className="text-xs font-bold">WhatsApp</span>
            </button>
            <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </div>
              <span className="text-xs font-bold">X</span>
            </button>
            <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-colors">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.035v.936h4.017l-.521 3.667h-3.496v7.988a11.905 11.905 0 0 0 3.29-6.932 11.93 11.93 0 0 0-1.63-7.535A12.015 12.015 0 0 0 12 1.25a12.015 12.015 0 0 0-7.604 2.768 11.93 11.93 0 0 0-1.63 7.535 11.905 11.905 0 0 0 6.335 12.138z"/></svg>
              </div>
              <span className="text-xs font-bold">Facebook</span>
            </button>
          </div>

          <div className="relative">
            <input 
              readOnly 
              value={shareUrl} 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 pl-4 pr-20 text-sm text-gray-600 focus:outline-none"
            />
            <button 
              onClick={() => { navigator.clipboard.writeText(shareUrl); alert('Link copied to clipboard'); }}
              className="absolute right-2 top-2 bottom-2 px-3 bg-white border border-gray-200 rounded text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              COPY
            </button>
          </div>
        </div>
      </Modal>
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
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity && updateQuantity(item.id, item.selectedSize, item.selectedColor, 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="font-medium text-lg">{formatCurrency(item.price * item.quantity)}</span>
                  <button 
                    onClick={() => removeFromCart && removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 bg-gray-50 p-8 rounded-xl h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
          </div>
          <div className="flex justify-between text-xl font-bold mb-8">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Button onClick={handleCheckout} className="w-full h-14 text-lg mb-4">Proceed to Checkout</Button>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <span className="material-symbols-outlined text-base">lock</span>
            Secure Checkout
          </div>
        </div>
      </div>
    </div>
  );
};

export const CheckoutSuccess: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-fade-in">
        <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Order Confirmed!</h1>
      <p className="text-gray-600 text-lg max-w-lg mb-10 leading-relaxed">
        Thank you for your purchase. Your order has been received and is being processed. 
        You will receive an email confirmation shortly.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => onNavigate(Page.ACCOUNT)}>View Order</Button>
        <Button variant="outline" onClick={() => onNavigate(Page.SHOP)}>Continue Shopping</Button>
      </div>
    </div>
  );
};
