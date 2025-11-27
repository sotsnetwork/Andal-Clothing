import React, { useState } from 'react';
import { Product, Page, CartItem } from '../types';
import { Button } from '../components/Shared';

// --- MOCK DATA ---
const PRODUCTS: Product[] = [
  { id: '1', name: 'Royal Grand Agbada', price: 1500, category: 'Agbadas', image: 'https://placehold.co/800x1000/1a1a1a/FFF?text=Royal+Agbada', isNew: true, collection: 'Eid' },
  { id: '2', name: 'Premium White Jalabiya', price: 250, category: 'Jalabiyas', image: 'https://placehold.co/800x1000/EAEAEA/1A1A1A?text=White+Jalabiya' },
  { id: '3', name: 'Hand-Embroidered Zanna Cap', price: 120, category: 'Caps', image: 'https://placehold.co/800x1000/333/FFF?text=Zanna+Cap' },
  { id: '4', name: 'Swiss Voile Fabric - Navy', price: 300, category: 'Fabrics', image: 'https://placehold.co/800x1000/172554/FFF?text=Swiss+Voile', collection: 'Textiles' },
  { id: '5', name: 'Emirate Black Kaftan', price: 450, category: 'Kaftan', image: 'https://placehold.co/800x1000/000/FFF?text=Black+Kaftan' },
  { id: '6', name: 'Classic Hausa Fila', price: 80, category: 'Caps', image: 'https://placehold.co/800x1000/666/FFF?text=Hausa+Fila' },
  { id: '7', name: 'Atiku Jacquard Fabric', price: 280, category: 'Fabrics', image: 'https://placehold.co/800x1000/e5e5e5/333?text=Atiku+Fabric' },
  { id: '8', name: 'Ceremonial Gold Agbada', price: 2100, category: 'Agbadas', image: 'https://placehold.co/800x1000/B8860B/FFF?text=Gold+Agbada', isNew: true },
];

// --- HOME PAGE ---
export const Home: React.FC<{ onNavigate: (page: Page, params?: any) => void }> = ({ onNavigate }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center bg-gray-900 text-white">
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/111/333?text=Andal+Clothing+Hero')] bg-cover bg-center opacity-60"></div>
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
                <span className="font-medium">${product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 px-6 md:px-10 max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative h-[500px] group cursor-pointer rounded-xl overflow-hidden">
            <img src="https://placehold.co/600x800/222/FFF?text=Agbada+Collection" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-3xl font-serif font-bold mb-2">Grand Agbadas</h3>
              <span className="text-sm font-medium border-b border-white pb-1">Shop Ceremonial</span>
            </div>
          </div>
          <div className="relative h-[500px] group cursor-pointer rounded-xl overflow-hidden">
            <img src="https://placehold.co/600x800/444/FFF?text=Jalabiyas+%26+Kaftans" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-3xl font-serif font-bold mb-2">Jalabiyas & Kaftans</h3>
              <span className="text-sm font-medium border-b border-white pb-1">Shop Everyday</span>
            </div>
          </div>
          <div className="relative h-[500px] group cursor-pointer rounded-xl overflow-hidden">
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
export const Shop: React.FC<{ onNavigate: (page: Page, params?: any) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-[1920px] mx-auto px-6 md:px-10 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Filters</h3>
            <button className="text-sm text-gray-500 hover:text-black underline">Clear All</button>
          </div>
          
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Category</h4>
            <div className="space-y-3">
              {['Agbadas', 'Jalabiyas', 'Kaftan', 'Caps', 'Fabrics'].map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 hover:text-black">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
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
              {['bg-black', 'bg-white border border-gray-200', 'bg-[#EAEAEA]', 'bg-blue-900', 'bg-[#B8860B]'].map((color, i) => (
                <button key={i} className={`w-8 h-8 rounded-full ${color} hover:ring-2 ring-offset-2 ring-primary transition-all`}></button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <div className="flex gap-2 text-sm text-gray-500 mb-2">
                <span>Home</span> / <span className="text-black">Men's Collection</span>
              </div>
              <h1 className="text-4xl font-serif font-bold">Men's Traditional Wear</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{PRODUCTS.length} items</span>
              <select className="h-10 border border-gray-200 rounded px-3 text-sm bg-white">
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex gap-2 mb-8">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
              All Items <span className="material-symbols-outlined text-sm cursor-pointer">close</span>
            </span>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {PRODUCTS.map(product => (
              <div key={product.id} className="group cursor-pointer" onClick={() => onNavigate(Page.PRODUCT, { id: product.id })}>
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-4 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {product.isNew && <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-bold uppercase tracking-wider">New Arrival</span>}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-base group-hover:text-gray-600 transition-colors">{product.name}</h3>
                    {product.collection && <p className="text-gray-500 text-xs mt-1">{product.collection} Collection</p>}
                  </div>
                  <span className="font-medium text-sm">${product.price}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex justify-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-black hover:border-black transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
            <button className="w-10 h-10 flex items-center justify-center rounded bg-black text-white font-medium">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 font-medium transition-colors">2</button>
            <span className="w-10 h-10 flex items-center justify-center">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 hover:border-black transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PRODUCT DETAIL PAGE ---
export const ProductDetail: React.FC<{ id?: string; onNavigate: (page: Page, params?: any) => void }> = ({ id, onNavigate }) => {
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

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
          <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
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
          <p className="text-2xl font-medium mb-8">${product.price}.00</p>

          <p className="text-gray-600 leading-relaxed mb-8">
            An embodiment of traditional elegance, this {product.category.toLowerCase().slice(0, -1)} is crafted from the finest materials. 
            Designed for the modern man who values heritage, comfort, and sophistication. 
            Perfect for special occasions, ceremonies, or Friday prayers.
          </p>

          <div className="space-y-6 mb-10">
            <div>
              <span className="block text-sm font-bold mb-3">Color</span>
              <div className="flex gap-3">
                <button className="w-8 h-8 rounded-full bg-black ring-2 ring-offset-2 ring-black"></button>
                <button className="w-8 h-8 rounded-full bg-[#EAEAEA] border border-gray-200 hover:ring-2 ring-offset-2 ring-gray-300 transition-all"></button>
                <button className="w-8 h-8 rounded-full bg-blue-900 border border-gray-200 hover:ring-2 ring-offset-2 ring-gray-300 transition-all"></button>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-3">
                <span className="text-sm font-bold">Size</span>
                <button className="text-sm text-gray-500 underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button key={size} className={`h-12 border rounded flex items-center justify-center text-sm font-medium transition-all ${size === 'M' ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={() => onNavigate(Page.CART)} className="w-full mb-8 text-lg">Add to Bag</Button>

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
               <p className="text-gray-500 text-sm">${p.price}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// --- CART PAGE ---
export const Cart: React.FC<{ onNavigate: (page: Page, params?: any) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <h1 className="text-4xl font-serif font-bold mb-12">Shopping Bag</h1>
      
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cart Items */}
        <div className="flex-1 space-y-8">
          <div className="flex gap-6 py-6 border-b border-gray-100">
            <div className="w-24 h-32 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
              <img src={PRODUCTS[1].image} alt="Jalabiya" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex justify-between">
              <div>
                <h3 className="font-medium text-lg">{PRODUCTS[1].name}</h3>
                <p className="text-gray-500 text-sm mt-1">Size: L</p>
                <p className="text-gray-500 text-sm">Color: White</p>
                <div className="flex items-center gap-4 mt-4">
                  <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">-</button>
                  <span className="text-sm font-medium">1</span>
                  <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">+</button>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <span className="font-medium">${PRODUCTS[1].price}.00</span>
                <button className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined">close</span></button>
              </div>
            </div>
          </div>

          <div className="flex gap-6 py-6 border-b border-gray-100">
            <div className="w-24 h-32 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
              <img src={PRODUCTS[2].image} alt="Cap" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex justify-between">
              <div>
                <h3 className="font-medium text-lg">{PRODUCTS[2].name}</h3>
                <p className="text-gray-500 text-sm mt-1">Size: 22.5</p>
                <p className="text-gray-500 text-sm">Color: Charcoal</p>
                <div className="flex items-center gap-4 mt-4">
                  <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">-</button>
                  <span className="text-sm font-medium">1</span>
                  <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">+</button>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <span className="font-medium">${PRODUCTS[2].price}.00</span>
                <button className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined">close</span></button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 bg-gray-50 p-8 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${PRODUCTS[1].price + PRODUCTS[2].price}.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">$25.00</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between text-base">
              <span className="font-bold">Total</span>
              <span className="font-bold">${PRODUCTS[1].price + PRODUCTS[2].price + 25}.00</span>
            </div>
          </div>
          <Button onClick={() => onNavigate(Page.CHECKOUT_SUCCESS)} className="w-full">Proceed to Checkout</Button>
          
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
             <span>${PRODUCTS[0].price}.00</span>
           </div>
           <div className="flex gap-4">
             <img src={PRODUCTS[5].image} className="