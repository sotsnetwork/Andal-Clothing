import React, { useState, useEffect } from 'react';
import { Page, CartItem, Product, Review } from './types';
import { Layout } from './components/Shared';
import { Home, Shop, ProductDetail, Cart, CheckoutSuccess, PRODUCTS } from './pages/ShopPages';
import { About, Journal, Sustainability, Careers, HelpCenter, ShippingReturns, CareInstructions, SizeGuide, PrivacyPolicy, TermsOfService } from './pages/Content';
import { Account, Contact, Press } from './pages/Support';
import { SignIn, SignUp, ForgotPassword, NewPassword } from './pages/Auth';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>(Page.HOME);
  const [params, setParams] = useState<any>({});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Mini Cart State
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  
  // State to hold reviews map: ProductID -> Review[]
  // Initialized with empty array for now, logic adds to it.
  const [productReviews, setProductReviews] = useState<Record<string, Review[]>>({});

  const navigate = (newPage: Page, newParams?: any) => {
    window.scrollTo(0, 0);

    // Route Protection: Redirect to Login if accessing Account while logged out
    if (newPage === Page.ACCOUNT && !isAuthenticated) {
      setPage(Page.LOGIN);
      return;
    }

    setPage(newPage);
    if (newParams) {
        setParams(newParams);
    } else {
        setParams({});
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate(Page.ACCOUNT);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate(Page.HOME);
  };

  // Cart Functions
  const addToCart = (product: Product, size: string, color: string) => {
    setCart(prev => {
      // Check if item with same ID, size, and color exists
      const existingItem = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      );

      let newCart;
      let addedItem: CartItem;

      if (existingItem) {
        addedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
        newCart = prev.map(item => 
          (item.id === product.id && item.selectedSize === size && item.selectedColor === color)
            ? addedItem
            : item
        );
      } else {
        addedItem = { ...product, quantity: 1, selectedSize: size, selectedColor: color };
        newCart = [...prev, addedItem];
      }
      
      setLastAddedItem(addedItem);
      return newCart;
    });
    
    // Trigger Mini Cart
    setShowMiniCart(true);
  };

  const updateQuantity = (itemId: string, size: string, color: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId && item.selectedSize === size && item.selectedColor === color) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (itemId: string, size: string, color: string) => {
    setCart(prev => prev.filter(item => 
      !(item.id === itemId && item.selectedSize === size && item.selectedColor === color)
    ));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Wishlist Functions
  const toggleWishlist = (productId: string) => {
    if (!isAuthenticated) {
      navigate(Page.LOGIN);
      return;
    }
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  // Review Functions
  const addReview = (productId: string, review: Review) => {
    setProductReviews(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), review]
    }));
  };

  // Simple hash router simulation for refresh persistence
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const parts = hash.split('/');
        const pageName = parts[0] as Page;
        if (Object.values(Page).includes(pageName)) {
          // Basic protection check on hash change
          if (pageName === Page.ACCOUNT && !isAuthenticated) {
             setPage(Page.LOGIN);
             return;
          }
          setPage(pageName);
          if (parts[1]) setParams({ id: parts[1] });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); 

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  useEffect(() => {
    let hash = page;
    if (params.id && page === Page.PRODUCT) {
      hash = `${page}/${params.id}` as Page;
    }
    if (window.location.hash.replace('#', '') !== hash) {
      window.location.hash = hash;
    }
  }, [page, params]);

  return (
    <Layout 
      activePage={page} 
      onNavigate={navigate} 
      isAuthenticated={isAuthenticated} 
      cartCount={cartCount}
      showMiniCart={showMiniCart}
      lastAddedItem={lastAddedItem}
      onCloseMiniCart={() => setShowMiniCart(false)}
    >
      {page === Page.HOME && <Home onNavigate={navigate} />}
      {page === Page.SHOP && (
        <Shop 
          onNavigate={navigate} 
          params={params} 
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
        />
      )}
      {page === Page.PRODUCT && (
        <ProductDetail 
          id={params.id} 
          onNavigate={navigate} 
          addToCart={addToCart} 
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          reviews={productReviews[params.id] || []}
          onAddReview={addReview}
        />
      )}
      {page === Page.CART && (
        <Cart 
          onNavigate={navigate} 
          isAuthenticated={isAuthenticated} 
          cartItems={cart} 
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      )}
      {page === Page.CHECKOUT_SUCCESS && <CheckoutSuccess onNavigate={navigate} />}
      {page === Page.ACCOUNT && (
        <Account 
          onNavigate={navigate} 
          params={params} 
          onLogout={handleLogout} 
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />
      )}
      {page === Page.ABOUT && <About />}
      {page === Page.CONTACT && <Contact />}
      {page === Page.JOURNAL && <Journal />}
      {page === Page.SUSTAINABILITY && <Sustainability />}
      {page === Page.CAREERS && <Careers />}
      {page === Page.PRESS && <Press />}
      
      {/* New Pages */}
      {page === Page.SHIPPING && <ShippingReturns />}
      {page === Page.CARE_INSTRUCTIONS && <CareInstructions />}
      {page === Page.SIZE_GUIDE && <SizeGuide />}
      {page === Page.PRIVACY && <PrivacyPolicy />}
      {page === Page.TERMS && <TermsOfService />}

      {/* Auth Pages */}
      {page === Page.LOGIN && <SignIn onNavigate={navigate} onLogin={handleLogin} />}
      {page === Page.SIGNUP && <SignUp onNavigate={navigate} onLogin={handleLogin} />}
      {page === Page.FORGOT_PASSWORD && <ForgotPassword onNavigate={navigate} />}
      {page === Page.NEW_PASSWORD && <NewPassword onNavigate={navigate} />}
    </Layout>
  );
};

export default App;