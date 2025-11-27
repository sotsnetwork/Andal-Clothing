import React, { useState, useEffect } from 'react';
import { Page } from './types';
import { Layout } from './components/Shared';
import { Home, Shop, ProductDetail, Cart, CheckoutSuccess } from './pages/ShopPages';
import { About, Journal, Sustainability, Careers, HelpCenter } from './pages/Content';
import { Account, Contact, Press } from './pages/Support';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>(Page.HOME);
  const [params, setParams] = useState<any>({});

  const navigate = (newPage: Page, newParams?: any) => {
    window.scrollTo(0, 0);
    setPage(newPage);
    if (newParams) setParams(newParams);
  };

  // Simple hash router simulation for refresh persistence
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Simple parsing for demo purposes
        const parts = hash.split('/');
        const pageName = parts[0] as Page;
        if (Object.values(Page).includes(pageName)) {
          setPage(pageName);
          if (parts[1]) setParams({ id: parts[1] });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when state changes
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
    <Layout activePage={page} onNavigate={navigate}>
      {page === Page.HOME && <Home onNavigate={navigate} />}
      {page === Page.SHOP && <Shop onNavigate={navigate} />}
      {page === Page.PRODUCT && <ProductDetail id={params.id} onNavigate={navigate} />}
      {page === Page.CART && <Cart onNavigate={navigate} />}
      {page === Page.CHECKOUT_SUCCESS && <CheckoutSuccess onNavigate={navigate} />}
      {page === Page.ACCOUNT && <Account />}
      {page === Page.ABOUT && <About />}
      {page === Page.CONTACT && <Contact />}
      {page === Page.JOURNAL && <Journal />}
      {page === Page.SUSTAINABILITY && <Sustainability />}
      {page === Page.CAREERS && <Careers />}
      {page === Page.PRESS && <Press />}
      {/* Basic Fallbacks for unimplemented distinct pages */}
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
        page !== Page.PRESS
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