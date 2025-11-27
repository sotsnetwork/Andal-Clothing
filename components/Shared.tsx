import React, { useState, useEffect } from 'react';
import { Page, CartItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onNavigate: (page: Page, params?: any) => void;
  isAuthenticated?: boolean;
  cartCount?: number;
  showMiniCart?: boolean;
  lastAddedItem?: CartItem | null;
  onCloseMiniCart?: () => void;
}

export const Header: React.FC<{ onNavigate: (page: Page, params?: any) => void; cartCount: number; isAuthenticated?: boolean }> = ({ onNavigate, cartCount, isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onNavigate(Page.SHOP, { search: searchQuery });
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1920px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate(Page.HOME)}>
            <span className="material-symbols-outlined text-3xl">all_inclusive</span>
            <h1 className="text-2xl font-bold tracking-tighter font-serif">Andal Clothing</h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate(Page.SHOP, { category: 'New Arrivals' })} className="text-base font-medium hover:text-gray-500 transition-colors">New Arrivals</button>
            <button onClick={() => onNavigate(Page.SHOP, { category: 'Agbadas' })} className="text-base font-medium hover:text-gray-500 transition-colors">Agbadas</button>
            <button onClick={() => onNavigate(Page.SHOP, { category: 'Jalabiyas' })} className="text-base font-medium hover:text-gray-500 transition-colors">Jalabiyas</button>
            <button onClick={() => onNavigate(Page.SHOP, { category: 'Caps' })} className="text-base font-medium hover:text-gray-500 transition-colors">Caps</button>
            <button onClick={() => onNavigate(Page.SHOP, { category: 'Fabrics' })} className="text-base font-medium hover:text-gray-500 transition-colors">Fabrics</button>
            <button onClick={() => onNavigate(Page.JOURNAL)} className="text-base font-medium hover:text-gray-500 transition-colors">Journal</button>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${isSearchOpen ? 'bg-gray-100 text-primary' : ''}`}
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            <button 
              onClick={() => onNavigate(isAuthenticated ? Page.ACCOUNT : Page.LOGIN)} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title={isAuthenticated ? 'Account' : 'Sign In'}
            >
              <span className="material-symbols-outlined">{isAuthenticated ? 'person' : 'login'}</span>
            </button>
            <button onClick={() => onNavigate(Page.CART)} className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <span className="material-symbols-outlined">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-0 bg-black text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 shadow-lg animate-fade-in">
            <div className="max-w-3xl mx-auto relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input 
                type="text" 
                placeholder="Search for agbadas, caps, or fabrics..." 
                className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <button onClick={() => setIsSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-lg h-[calc(100vh-80px)] overflow-y-auto">
            <button onClick={() => { onNavigate(Page.SHOP, { category: 'Agbadas' }); setIsMenuOpen(false); }} className="text-left text-lg font-medium">Agbadas</button>
            <button onClick={() => { onNavigate(Page.SHOP, { category: 'Jalabiyas' }); setIsMenuOpen(false); }} className="text-left text-lg font-medium">Jalabiyas</button>
            <button onClick={() => { onNavigate(Page.SHOP, { category: 'Caps' }); setIsMenuOpen(false); }} className="text-left text-lg font-medium">Caps (Fila)</button>
            <button onClick={() => { onNavigate(Page.SHOP, { category: 'Fabrics' }); setIsMenuOpen(false); }} className="text-left text-lg font-medium">Fabrics</button>
            <button onClick={() => { onNavigate(Page.JOURNAL); setIsMenuOpen(false); }} className="text-left text-lg font-medium">Journal</button>
            <button onClick={() => { onNavigate(Page.ABOUT); setIsMenuOpen(false); }} className="text-left text-lg font-medium">About</button>
            <button onClick={() => { onNavigate(isAuthenticated ? Page.ACCOUNT : Page.LOGIN); setIsMenuOpen(false); }} className="text-left text-lg font-medium">
              {isAuthenticated ? 'My Account' : 'Sign In'}
            </button>
          </div>
        )}
      </header>
    </>
  );
};

export const Footer: React.FC<{ onNavigate: (page: Page, params?: any) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#111111] text-white pt-20 pb-10">
      <div className="max-w-[1920px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-2xl">all_inclusive</span>
              <span className="text-xl font-bold font-serif">Andal Clothing</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Timeless elegance for the modern man. 
              Authentic Hausa craftsmanship, premium fabrics, and royal aesthetics.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Collections</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><button onClick={() => onNavigate(Page.SHOP, { category: 'Agbadas' })} className="hover:text-white transition-colors">Royal Agbadas</button></li>
              <li><button onClick={() => onNavigate(Page.SHOP, { category: 'Jalabiyas' })} className="hover:text-white transition-colors">Premium Jalabiyas</button></li>
              <li><button onClick={() => onNavigate(Page.SHOP, { category: 'Caps' })} className="hover:text-white transition-colors">Hand-Woven Caps</button></li>
              <li><button onClick={() => onNavigate(Page.SHOP, { category: 'Fabrics' })} className="hover:text-white transition-colors">Luxury Fabrics</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><button onClick={() => onNavigate(Page.ABOUT)} className="hover:text-white transition-colors">Our Heritage</button></li>
              <li><button onClick={() => onNavigate(Page.SUSTAINABILITY)} className="hover:text-white transition-colors">Sustainability</button></li>
              <li><button onClick={() => onNavigate(Page.CAREERS)} className="hover:text-white transition-colors">Careers</button></li>
              <li><button onClick={() => onNavigate(Page.PRESS)} className="hover:text-white transition-colors">Press</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><button onClick={() => onNavigate(Page.CONTACT)} className="hover:text-white transition-colors">Contact Us</button></li>
              <li><button onClick={() => onNavigate(Page.SHIPPING)} className="hover:text-white transition-colors">Shipping & Returns</button></li>
              <li><button onClick={() => onNavigate(Page.CARE_INSTRUCTIONS)} className="hover:text-white transition-colors">Care Instructions</button></li>
              <li><button onClick={() => onNavigate(Page.SIZE_GUIDE)} className="hover:text-white transition-colors">Size Guide</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2024 Andal Clothing. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => onNavigate(Page.PRIVACY)} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => onNavigate(Page.TERMS)} className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ 
  className = '', 
  variant = 'primary', 
  children, 
  ...props 
}) => {
  const baseStyles = "h-12 px-8 rounded font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-white hover:bg-black",
    secondary: "bg-white text-primary hover:bg-gray-50",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    className={`w-full h-12 px-4 bg-white border border-gray-200 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${className}`} 
    {...props} 
  />
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 z-10"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        {children}
      </div>
    </div>
  );
};

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-black transition-all animate-fade-in"
      aria-label="Back to Top"
    >
      <span className="material-symbols-outlined">arrow_upward</span>
    </button>
  );
};

export const MiniCartNotification: React.FC<{ item: CartItem; onClose: () => void; onNavigate: (page: Page) => void }> = ({ item, onClose, onNavigate }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [item, onClose]);

  return (
    <div className="fixed top-24 right-6 md:right-10 z-[60] bg-white rounded-lg shadow-2xl border border-gray-100 p-4 w-80 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-bold text-green-600 flex items-center gap-1">
          <span className="material-symbols-outlined text-base">check_circle</span>
          Added to Bag
        </span>
        <button onClick={onClose} className="text-gray-400 hover:text-black">
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>
      <div className="flex gap-3 mb-4">
        <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded bg-gray-50" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{item.name}</p>
          <p className="text-xs text-gray-500">{item.selectedColor} / {item.selectedSize}</p>
        </div>
      </div>
      <Button 
        onClick={() => { onClose(); onNavigate(Page.CART); }} 
        className="w-full h-10 text-sm"
      >
        Checkout
      </Button>
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activePage, 
  onNavigate, 
  isAuthenticated, 
  cartCount = 0,
  showMiniCart = false,
  lastAddedItem = null,
  onCloseMiniCart = () => {}
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <Header onNavigate={onNavigate} cartCount={cartCount} isAuthenticated={isAuthenticated} />
      {showMiniCart && lastAddedItem && (
        <MiniCartNotification 
          item={lastAddedItem} 
          onClose={onCloseMiniCart} 
          onNavigate={onNavigate} 
        />
      )}
      <main className="flex-grow animate-fade-in">
        {children}
      </main>
      <Footer onNavigate={onNavigate} />
      <BackToTop />
    </div>
  );
};