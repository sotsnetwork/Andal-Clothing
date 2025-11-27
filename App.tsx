import React, { useState, useEffect } from 'react';
import { Page } from './types';
import { Layout } from './components/Shared';
import { Home, Shop, ProductDetail, Cart, CheckoutSuccess } from './pages/ShopPages';
import { About, Journal, Sustainability, Careers, HelpCenter } from './pages/Content';
import { Account, Contact, Press } from './pages/Support';
import { SignIn, SignUp, ForgotPassword, NewPassword } from './pages/Auth';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>(Page.HOME);
  const [params, setParams] = useState<any>({});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
    <Layout activePage={page} onNavigate={navigate} isAuthenticated={isAuthenticated}>
      {page === Page.HOME && <Home onNavigate={navigate} />}
      {page === Page.SHOP && <Shop onNavigate={navigate} params={params} />}
      {page === Page.PRODUCT && <ProductDetail id={params.id} onNavigate={navigate} />}
      {page === Page.CART && <Cart onNavigate={navigate} isAuthenticated={isAuthenticated} />}
      {page === Page.CHECKOUT_SUCCESS && <CheckoutSuccess onNavigate={navigate} />}
      {page === Page.ACCOUNT && <Account onNavigate={navigate} params={params} onLogout={handleLogout} />}
      {page === Page.ABOUT && <About />}
      {page === Page.CONTACT && <Contact />}
      {page === Page.JOURNAL && <Journal />}
      {page === Page.SUSTAINABILITY && <Sustainability />}
      {page === Page.CAREERS && <Careers />}
      {page === Page.PRESS && <Press />}
      
      {/* Auth Pages */}
      {page === Page.LOGIN && <SignIn onNavigate={navigate} onLogin={handleLogin} />}
      {page === Page.SIGNUP && <SignUp onNavigate={navigate} onLogin={handleLogin} />}
      {page === Page.FORGOT_PASSWORD && <ForgotPassword onNavigate={navigate} />}
      {page === Page.NEW_PASSWORD && <NewPassword onNavigate={navigate} />}

      {(page !== Page.HOME && 
        page !== Page.SHOP && 
        page !== Page.PRODUCT && 
        page !== Page.CART && 
        page !== Page.CHECKOUT_SUCCESS &&
        page !== Page.ACCOUNT &&
        page !== Page.ABOUT &&
        page !== Page.CONTACT &&
        page !== Page.JOURNAL &&
        page !== Page.SUSTAINABILITY &&
        page !== Page.CAREERS &&
        page !== Page.PRESS &&
        page !== Page.LOGIN &&
        page !== Page.SIGNUP &&
        page !== Page.FORGOT_PASSWORD &&
        page !== Page.NEW_PASSWORD
       ) && (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-4">Coming Soon</h1>
            <p className="text-gray-500 mb-8">This page is under construction.</p>
            <button onClick={() => navigate(Page.HOME)} className="bg-black text-white px-6 py-3 rounded">Return Home</button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;