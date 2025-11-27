import React, { useState, useEffect } from 'react';
import { Page, PaymentMethod } from '../types';
import { Button, Input, Modal } from '../components/Shared';
import { PRODUCTS } from './ShopPages';

// --- MOCK DATA & INTERFACES ---
interface Address {
  id: string;
  type: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  isDefault: boolean;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: string;
  items: OrderItem[];
}

// Orders and addresses will be stored per user - starting with empty arrays

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

// --- ACCOUNT PAGE ---
export const Account: React.FC<{ 
  onNavigate: (page: Page, params?: any) => void; 
  params?: any; 
  onLogout?: () => void;
  wishlist?: string[];
  toggleWishlist?: (id: string) => void;
  user?: { name: string; email: string } | null;
  updateUser?: (user: { name: string; email: string }) => void;
}> = ({ onNavigate, params, onLogout, wishlist = [], toggleWishlist, user, updateUser }) => {
  const currentView = params?.view || 'profile';

  // --- ORDER STATE ---
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showTracking, setShowTracking] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // --- ADDRESS STATE ---
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  // --- USER PROFILE STATE ---
  const [passwordLastChanged, setPasswordLastChanged] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    type: 'Home',
    name: '',
    address: '',
    city: '',
    state: '',
    phone: ''
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // --- PAYMENT METHODS STATE ---
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  // Address Validation
  const validateAddressField = (name: string, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = 'This field is required';
    }
    // Simple phone validation
    if (name === 'phone' && value.trim() && !/^[0-9+\-\s()]+$/.test(value)) {
        error = 'Invalid phone number format';
    }
    
    setAddressErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
    validateAddressField(name, value);
  };

  const openEditAddress = (addr: Address) => {
    setAddressForm({
      type: addr.type,
      name: addr.name,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      phone: addr.phone
    });
    setEditingAddressId(addr.id);
    setAddressErrors({});
    setIsAddressFormOpen(true);
  };

  const openNewAddress = () => {
    setAddressForm({ type: 'Home', name: '', address: '', city: '', state: '', phone: '' });
    setEditingAddressId(null);
    setAddressErrors({});
    setIsAddressFormOpen(true);
  };

  const saveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all
    const fields = ['type', 'name', 'address', 'city', 'state', 'phone'];
    let isValid = true;
    fields.forEach(field => {
      const valid = validateAddressField(field, (addressForm as any)[field]);
      if (!valid) isValid = false;
    });

    if (!isValid) return;

    if (editingAddressId) {
      // Update existing
      setAddresses(prev => prev.map(a => a.id === editingAddressId ? { ...a, ...addressForm } : a));
    } else {
      // Create new
      const newAddr: Address = {
        id: Math.random().toString(36).substr(2, 9),
        isDefault: addresses.length === 0,
        ...addressForm
      };
      setAddresses(prev => [...prev, newAddr]);
    }
    setIsAddressFormOpen(false);
  };

  const deleteAddress = (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
        setAddresses(prev => prev.filter(a => a.id !== id));
    }
  };

  // Payment Methods Functions
  const detectCardType = (cardNumber: string): PaymentMethod['cardType'] => {
    const num = cardNumber.replace(/\s/g, '');
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    if (/^6(?:011|5)/.test(num)) return 'discover';
    return 'other';
  };

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const validatePaymentField = (name: string, value: string, isOptional: boolean = false) => {
    let error = '';
    if (!value.trim()) {
      if (!isOptional) {
        error = 'This field is required';
      }
    } else if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      if (cleaned.length < 13 || cleaned.length > 19) {
        error = 'Card number must be between 13 and 19 digits';
      } else if (!/^\d+$/.test(cleaned)) {
        error = 'Card number must contain only digits';
      }
    } else if (name === 'cvv') {
      if (value.length < 3 || value.length > 4) {
        error = 'CVV must be 3 or 4 digits';
      } else if (!/^\d+$/.test(value)) {
        error = 'CVV must contain only digits';
      }
    } else if (name === 'expiryMonth' || name === 'expiryYear') {
      if (!/^\d+$/.test(value)) {
        error = 'Invalid format';
      }
    }
    setPaymentErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isOptional = editingPaymentId && (name === 'cardNumber' || name === 'cvv');
    if (name === 'cardNumber') {
      const formatted = formatCardNumber(value);
      setPaymentForm(prev => ({ ...prev, [name]: formatted }));
      validatePaymentField(name, formatted.replace(/\s/g, ''), isOptional);
    } else {
      setPaymentForm(prev => ({ ...prev, [name]: value }));
      validatePaymentField(name, value, isOptional);
    }
  };

  const openNewPayment = () => {
    setPaymentForm({ cardNumber: '', cardholderName: '', expiryMonth: '', expiryYear: '', cvv: '' });
    setEditingPaymentId(null);
    setPaymentErrors({});
    setIsPaymentFormOpen(true);
  };

  const openEditPayment = (pm: PaymentMethod) => {
    // For security, we only store last 4 digits, so we'll allow user to optionally re-enter
    setPaymentForm({
      cardNumber: '', // Clear - user can optionally enter new card number
      cardholderName: pm.cardholderName,
      expiryMonth: pm.expiryMonth,
      expiryYear: pm.expiryYear,
      cvv: '' // Never show CVV
    });
    setEditingPaymentId(pm.id);
    setPaymentErrors({});
    setIsPaymentFormOpen(true);
  };

  const savePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields (cardNumber optional when editing)
    const requiredFields = editingPaymentId 
      ? ['cardholderName', 'expiryMonth', 'expiryYear'] 
      : ['cardNumber', 'cardholderName', 'expiryMonth', 'expiryYear', 'cvv'];
    
    let isValid = true;
    requiredFields.forEach(field => {
      const valid = validatePaymentField(field, (paymentForm as any)[field]);
      if (!valid) isValid = false;
    });

    // If editing and new card number provided, validate it (optional)
    if (editingPaymentId && paymentForm.cardNumber.trim()) {
      const cardNumber = paymentForm.cardNumber.replace(/\s/g, '');
      if (!validatePaymentField('cardNumber', cardNumber, false)) {
        isValid = false;
      }
    }

    if (!isValid) return;

    if (editingPaymentId) {
      // Update existing
      const existingPayment = paymentMethods.find(pm => pm.id === editingPaymentId);
      if (!existingPayment) return;

      let updatedPayment = { ...existingPayment };
      updatedPayment.cardholderName = paymentForm.cardholderName;
      updatedPayment.expiryMonth = paymentForm.expiryMonth;
      updatedPayment.expiryYear = paymentForm.expiryYear;

      // If new card number provided, update it
      if (paymentForm.cardNumber.trim()) {
        const cardNumber = paymentForm.cardNumber.replace(/\s/g, '');
        updatedPayment.cardNumber = cardNumber.slice(-4);
        updatedPayment.cardType = detectCardType(cardNumber);
      }

      setPaymentMethods(prev => prev.map(pm => 
        pm.id === editingPaymentId ? updatedPayment : pm
      ));
    } else {
      // Create new
      const cardNumber = paymentForm.cardNumber.replace(/\s/g, '');
      const last4 = cardNumber.slice(-4);
      const cardType = detectCardType(cardNumber);
      
      const newPayment: PaymentMethod = {
        id: Math.random().toString(36).substr(2, 9),
        cardNumber: last4,
        cardholderName: paymentForm.cardholderName,
        expiryMonth: paymentForm.expiryMonth,
        expiryYear: paymentForm.expiryYear,
        cardType,
        isDefault: paymentMethods.length === 0
      };
      setPaymentMethods(prev => [...prev, newPayment]);
    }
    
    setIsPaymentFormOpen(false);
    setPaymentForm({ cardNumber: '', cardholderName: '', expiryMonth: '', expiryYear: '', cvv: '' });
    setPaymentErrors({});
  };

  const deletePayment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(prev => {
        const filtered = prev.filter(pm => pm.id !== id);
        // If deleted was default and there are other cards, set first as default
        if (filtered.length > 0 && prev.find(pm => pm.id === id)?.isDefault) {
          filtered[0].isDefault = true;
        }
        return filtered;
      });
    }
  };

  const setDefaultPayment = (id: string) => {
    setPaymentMethods(prev => prev.map(pm => ({ ...pm, isDefault: pm.id === id })));
  };

  const handleTrackPackage = (order: Order) => {
    setTrackingOrder(order);
    setShowTracking(true);
  };

  // Helper to calculate estimated delivery (Mock: 7 days after order date)
  const getEstimatedDelivery = (orderDate: string) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Update profile form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateUser) {
      updateUser({ name: profileForm.name, email: profileForm.email });
      setIsEditingProfile(false);
    }
  };

  const handleCancelEditProfile = () => {
    setProfileForm({ name: user?.name || '', email: user?.email || '' });
    setIsEditingProfile(false);
  };

  const validatePassword = (name: string, value: string) => {
    let error = '';
    if (name === 'newPassword' && value.length > 0 && value.length < 8) {
      error = 'Password must be at least 8 characters';
    }
    if (name === 'confirmPassword' && value !== passwordForm.newPassword) {
      error = 'Passwords do not match';
    }
    setPasswordErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    validatePassword(name, value);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordErrors({ newPassword: 'Password must be at least 8 characters' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    // Save password (in a real app, this would call an API)
    setPasswordLastChanged(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
    setIsChangingPassword(false);
    alert('Password changed successfully!');
  };

  const handleCancelPassword = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
    setIsChangingPassword(false);
  };

  return (
    <div className="flex min-h-[80vh] bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
               <span className="material-symbols-outlined text-gray-500">person</span>
            </div>
            <div>
              <p className="font-bold text-sm">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'No email'}</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          <button 
            onClick={() => { onNavigate(Page.ACCOUNT, { view: 'profile' }); setSelectedOrder(null); setIsAddressFormOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-left ${currentView === 'profile' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span className="material-symbols-outlined text-xl">person</span> Account Settings
          </button>
          <button 
            onClick={() => { onNavigate(Page.ACCOUNT, { view: 'orders' }); setSelectedOrder(null); setIsAddressFormOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-left ${currentView === 'orders' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span className="material-symbols-outlined text-xl">shopping_bag</span> My Orders
          </button>
          <button 
            onClick={() => { onNavigate(Page.ACCOUNT, { view: 'wishlist' }); setSelectedOrder(null); setIsAddressFormOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-left ${currentView === 'wishlist' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span className="material-symbols-outlined text-xl">favorite</span> Wishlist
          </button>
          <button 
            onClick={() => { onNavigate(Page.ACCOUNT, { view: 'addresses' }); setSelectedOrder(null); setIsAddressFormOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-left ${currentView === 'addresses' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span className="material-symbols-outlined text-xl">home</span> Addresses
          </button>
          <button 
            onClick={() => { onNavigate(Page.ACCOUNT, { view: 'payments' }); setSelectedOrder(null); setIsAddressFormOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-left ${currentView === 'payments' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span className="material-symbols-outlined text-xl">credit_card</span> Payment Methods
          </button>
          <button 
            onClick={() => onLogout && onLogout()}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg font-medium text-sm text-gray-600 mt-10 text-left"
          >
            <span className="material-symbols-outlined text-xl">logout</span> Logout
          </button>
        </nav>
      </aside>

      <div className="flex-1 p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile View */}
          {currentView === 'profile' && (
            <>
              <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
              <div className="space-y-6">
                {/* Personal Information Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h2 className="text-sm text-gray-500 mb-4">Personal Information</h2>
                  {!isEditingProfile ? (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">{user?.name || 'Not set'}</p>
                        <p className="text-gray-500">{user?.email || 'No email'}</p>
                      </div>
                      <button 
                        onClick={() => setIsEditingProfile(true)} 
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <Input
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div className="flex gap-4 pt-2">
                        <Button type="submit" className="flex-1">Save Changes</Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleCancelEditProfile} 
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Password Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h2 className="text-sm text-gray-500 mb-4">Password</h2>
                  {!isChangingPassword ? (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg tracking-widest">••••••••••••</p>
                        <p className="text-gray-500 text-sm">
                          {passwordLastChanged ? `Last changed ${passwordLastChanged}` : 'Password not set'}
                        </p>
                      </div>
                      <button 
                        onClick={() => setIsChangingPassword(true)} 
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium"
                      >
                        {passwordLastChanged ? 'Change Password' : 'Create Password'}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSavePassword} className="space-y-4">
                      {passwordLastChanged && (
                        <div>
                          <label className="block text-sm font-medium mb-2">Current Password</label>
                          <Input
                            type="password"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter current password"
                            required
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <Input
                          type="password"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter new password (min. 8 characters)"
                          required
                        />
                        {passwordErrors.newPassword && (
                          <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                        <Input
                          type="password"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirm new password"
                          required
                        />
                        {passwordErrors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                        )}
                      </div>
                      <div className="flex gap-4 pt-2">
                        <Button type="submit" className="flex-1">Save Password</Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleCancelPassword} 
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Orders View */}
          {currentView === 'orders' && (
            <>
              {!selectedOrder ? (
                <>
                  <h1 className="text-3xl font-bold mb-8">My Orders</h1>
                  {orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order, i) => (
                      <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                          <div>
                            <h3 className="font-bold text-lg">{order.id}</h3>
                            <p className="text-sm text-gray-500">Placed on {order.date}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {order.status}
                            </span>
                            <span className="font-bold text-lg">{order.total}</span>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                          <p className="text-sm text-gray-600 truncate max-w-md">
                            {order.items.map(item => item.name).join(', ')}
                          </p>
                          <div className="flex gap-4">
                            {order.status === 'In Transit' && (
                                <button onClick={(e) => { e.stopPropagation(); handleTrackPackage(order); }} className="text-sm font-bold text-blue-600 hover:underline">
                                  Track Package
                                </button>
                            )}
                            <button onClick={() => setSelectedOrder(order)} className="text-sm font-medium underline hover:text-blue-600">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                      <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">shopping_bag</span>
                      <p className="text-gray-500 mb-6">You have no orders yet.</p>
                      <Button onClick={() => onNavigate(Page.SHOP)}>Start Shopping</Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="animate-fade-in">
                  <Button variant="outline" onClick={() => setSelectedOrder(null)} className="mb-6 flex items-center gap-2 px-4 h-10 w-auto">
                    <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Orders
                  </Button>
                  <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">Order {selectedOrder.id}</h1>
                      <p className="text-gray-600">Placed on {selectedOrder.date}</p>
                      {selectedOrder.status === 'In Transit' && (
                          <p className="text-green-600 font-medium mt-2 flex items-center gap-1">
                              <span className="material-symbols-outlined text-base">local_shipping</span>
                              Estimated Delivery: {getEstimatedDelivery(selectedOrder.date)}
                          </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                        {selectedOrder.status === 'In Transit' && (
                           <Button variant="outline" onClick={() => handleTrackPackage(selectedOrder)} className="h-10 text-sm">
                             Track Package
                           </Button>
                        )}
                        <div className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {selectedOrder.status}
                        </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 font-bold text-sm uppercase tracking-wide">Items</div>
                    <div className="divide-y divide-gray-100">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="p-6 flex items-center gap-6">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover bg-gray-100" />
                          <div className="flex-1">
                            <h4 className="font-bold">{item.name}</h4>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-medium">{item.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 py-4 bg-gray-50 flex justify-between items-center border-t border-gray-200">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-xl">{selectedOrder.total}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <h3 className="font-bold mb-4">Shipping Address</h3>
                      {selectedOrder && addresses.find(a => a.isDefault) ? (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {addresses.find(a => a.isDefault)?.name}<br/>
                          {addresses.find(a => a.isDefault)?.address}<br/>
                          {addresses.find(a => a.isDefault)?.city}, {addresses.find(a => a.isDefault)?.state}<br/>
                          {addresses.find(a => a.isDefault)?.phone}
                        </p>
                      ) : (
                        <p className="text-gray-500 text-sm">No address on file for this order</p>
                      )}
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <h3 className="font-bold mb-4">Payment Method</h3>
                      <p className="text-gray-500 text-sm">Payment information not available</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Wishlist View */}
          {currentView === 'wishlist' && (
            <>
              <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
              {wishlist.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PRODUCTS.filter(p => wishlist.includes(p.id)).map(product => (
                       <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-200 group relative">
                         <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-pointer" onClick={() => onNavigate(Page.PRODUCT, { id: product.id })}>
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                         </div>
                         <div className="flex justify-between items-start mb-4">
                           <div>
                             <h3 className="font-medium">{product.name}</h3>
                             <p className="text-gray-500 text-sm">{formatCurrency(product.price)}</p>
                           </div>
                         </div>
                         <div className="flex gap-2">
                           <Button className="flex-1 text-sm h-10 px-0" onClick={() => onNavigate(Page.PRODUCT, { id: product.id })}>View Details</Button>
                           <button 
                             onClick={() => toggleWishlist && toggleWishlist(product.id)}
                             className="w-10 h-10 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors"
                           >
                              <span className="material-symbols-outlined text-xl">delete</span>
                           </button>
                         </div>
                       </div>
                    ))}
                 </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                  <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">favorite</span>
                  <p className="text-gray-500 mb-6">Your wishlist is empty.</p>
                  <Button onClick={() => onNavigate(Page.SHOP)}>Explore Collection</Button>
                </div>
              )}
            </>
          )}

          {/* Addresses View */}
          {currentView === 'addresses' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Addresses</h1>
                {!isAddressFormOpen && (
                  <Button onClick={openNewAddress} className="text-sm px-4 h-10">Add New</Button>
                )}
              </div>

              {isAddressFormOpen ? (
                <div className="bg-white p-8 rounded-xl border border-gray-200 animate-fade-in">
                  <h2 className="text-xl font-bold mb-6">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h2>
                  <form onSubmit={saveAddress} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <Input 
                            name="name" 
                            value={addressForm.name} 
                            onChange={handleAddressChange} 
                            placeholder="John Doe" 
                        />
                        {addressErrors.name && <p className="text-red-500 text-xs mt-1">{addressErrors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <Input 
                            name="phone" 
                            value={addressForm.phone} 
                            onChange={handleAddressChange} 
                            placeholder="+234..." 
                        />
                        {addressErrors.phone && <p className="text-red-500 text-xs mt-1">{addressErrors.phone}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <Input 
                        name="address" 
                        value={addressForm.address} 
                        onChange={handleAddressChange} 
                        placeholder="Street address, apartment, suite, etc." 
                      />
                      {addressErrors.address && <p className="text-red-500 text-xs mt-1">{addressErrors.address}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <Input 
                            name="city" 
                            value={addressForm.city} 
                            onChange={handleAddressChange} 
                            placeholder="City" 
                        />
                         {addressErrors.city && <p className="text-red-500 text-xs mt-1">{addressErrors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">State</label>
                        <Input 
                            name="state" 
                            value={addressForm.state} 
                            onChange={handleAddressChange} 
                            placeholder="State" 
                        />
                        {addressErrors.state && <p className="text-red-500 text-xs mt-1">{addressErrors.state}</p>}
                      </div>
                    </div>
                    <div>
                       <label className="block text-sm font-medium mb-1">Address Type</label>
                       <select 
                         name="type" 
                         value={addressForm.type} 
                         onChange={handleAddressChange}
                         className="w-full h-12 px-4 bg-white border border-gray-200 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                       >
                         <option value="Home">Home</option>
                         <option value="Office">Office</option>
                         <option value="Other">Other</option>
                       </select>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button type="submit" className="flex-1">Save Address</Button>
                      <Button type="button" variant="outline" onClick={() => setIsAddressFormOpen(false)} className="flex-1">Cancel</Button>
                    </div>
                  </form>
                </div>
              ) : addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map(addr => (
                    <div key={addr.id} className="bg-white p-6 rounded-xl border border-gray-200 relative group">
                      {addr.isDefault && (
                        <span className="absolute top-6 right-6 text-xs font-bold bg-gray-100 px-2 py-1 rounded">DEFAULT</span>
                      )}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-gray-400">{addr.type === 'Home' ? 'home' : 'work'}</span>
                        <h3 className="font-bold">{addr.type}</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        {addr.name}<br/>
                        {addr.address}<br/>
                        {addr.city}, {addr.state}<br/>
                        {addr.phone}
                      </p>
                      <div className="flex gap-4 border-t border-gray-100 pt-4">
                        <button onClick={() => openEditAddress(addr)} className="text-sm font-medium hover:text-blue-600">Edit</button>
                        {!addr.isDefault && (
                          <button onClick={() => deleteAddress(addr.id)} className="text-sm font-medium text-gray-400 hover:text-red-500">Remove</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                  <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">home</span>
                  <p className="text-gray-500 mb-6">You have no saved addresses.</p>
                  <Button onClick={openNewAddress}>Add Your First Address</Button>
                </div>
              )}
            </>
          )}

           {/* Payments View */}
           {currentView === 'payments' && (
             <>
               <div className="flex justify-between items-center mb-8">
                 <h1 className="text-3xl font-bold">Payment Methods</h1>
                 <Button onClick={openNewPayment}>Add New Card</Button>
               </div>

               {paymentMethods.length === 0 && !isPaymentFormOpen ? (
                 <div className="bg-white p-8 rounded-xl border border-gray-200 text-center py-16">
                   <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">credit_card_off</span>
                   <p className="text-gray-500 mb-6">You have no saved payment methods.</p>
                   <Button onClick={openNewPayment}>Add New Card</Button>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {paymentMethods.map(pm => (
                     <div key={pm.id} className="bg-white p-6 rounded-xl border border-gray-200">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                             {pm.cardType === 'visa' && (
                               <span className="text-white text-xs font-bold">VISA</span>
                             )}
                             {pm.cardType === 'mastercard' && (
                               <span className="text-white text-xs font-bold">MC</span>
                             )}
                             {pm.cardType === 'amex' && (
                               <span className="text-white text-xs font-bold">AMEX</span>
                             )}
                             {pm.cardType === 'discover' && (
                               <span className="text-white text-xs font-bold">DISC</span>
                             )}
                             {pm.cardType === 'other' && (
                               <span className="text-white text-xs font-bold">CARD</span>
                             )}
                           </div>
                           <div>
                             <p className="font-medium">**** **** **** {pm.cardNumber}</p>
                             <p className="text-sm text-gray-500">{pm.cardholderName}</p>
                             <p className="text-sm text-gray-500">
                               Expires {pm.expiryMonth.padStart(2, '0')}/{pm.expiryYear}
                             </p>
                           </div>
                           {pm.isDefault && (
                             <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                               Default
                             </span>
                           )}
                         </div>
                         <div className="flex items-center gap-2">
                           {!pm.isDefault && (
                             <button
                               onClick={() => setDefaultPayment(pm.id)}
                               className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50"
                             >
                               Set as Default
                             </button>
                           )}
                           <button
                             onClick={() => openEditPayment(pm)}
                             className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50"
                           >
                             Edit
                           </button>
                           <button
                             onClick={() => deletePayment(pm.id)}
                             className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50"
                           >
                             Delete
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}

               {/* Payment Form Modal */}
               <Modal isOpen={isPaymentFormOpen} onClose={() => setIsPaymentFormOpen(false)}>
                 <div className="p-8">
                   <h2 className="text-2xl font-bold mb-6">
                     {editingPaymentId ? 'Edit Payment Method' : 'Add New Card'}
                   </h2>
                   <form onSubmit={savePayment} className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium mb-2">
                         Card Number {editingPaymentId && <span className="text-gray-400 font-normal">(optional)</span>}
                       </label>
                       <Input
                         type="text"
                         name="cardNumber"
                         value={paymentForm.cardNumber}
                         onChange={handlePaymentChange}
                         placeholder={editingPaymentId ? "Leave blank or enter new card number" : "1234 5678 9012 3456"}
                         maxLength={19}
                         className={paymentErrors.cardNumber ? 'border-red-500' : ''}
                       />
                       {paymentErrors.cardNumber && (
                         <p className="text-red-500 text-xs mt-1">{paymentErrors.cardNumber}</p>
                       )}
                     </div>

                     <div>
                       <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                       <Input
                         type="text"
                         name="cardholderName"
                         value={paymentForm.cardholderName}
                         onChange={handlePaymentChange}
                         placeholder="John Doe"
                         className={paymentErrors.cardholderName ? 'border-red-500' : ''}
                       />
                       {paymentErrors.cardholderName && (
                         <p className="text-red-500 text-xs mt-1">{paymentErrors.cardholderName}</p>
                       )}
                     </div>

                     <div className="grid grid-cols-3 gap-4">
                       <div className="col-span-1">
                         <label className="block text-sm font-medium mb-2">Month</label>
                         <select
                           name="expiryMonth"
                           value={paymentForm.expiryMonth}
                           onChange={handlePaymentChange}
                           className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${paymentErrors.expiryMonth ? 'border-red-500' : 'border-gray-200'}`}
                         >
                           <option value="">MM</option>
                           {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                             <option key={month} value={month.toString().padStart(2, '0')}>
                               {month.toString().padStart(2, '0')}
                             </option>
                           ))}
                         </select>
                         {paymentErrors.expiryMonth && (
                           <p className="text-red-500 text-xs mt-1">{paymentErrors.expiryMonth}</p>
                         )}
                       </div>
                       <div className="col-span-1">
                         <label className="block text-sm font-medium mb-2">Year</label>
                         <select
                           name="expiryYear"
                           value={paymentForm.expiryYear}
                           onChange={handlePaymentChange}
                           className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${paymentErrors.expiryYear ? 'border-red-500' : 'border-gray-200'}`}
                         >
                           <option value="">YYYY</option>
                           {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map(year => (
                             <option key={year} value={year.toString()}>
                               {year}
                             </option>
                           ))}
                         </select>
                         {paymentErrors.expiryYear && (
                           <p className="text-red-500 text-xs mt-1">{paymentErrors.expiryYear}</p>
                         )}
                       </div>
                       <div className="col-span-1">
                         <label className="block text-sm font-medium mb-2">
                           CVV {editingPaymentId && <span className="text-gray-400 font-normal">(optional)</span>}
                         </label>
                         <Input
                           type="text"
                           name="cvv"
                           value={paymentForm.cvv}
                           onChange={handlePaymentChange}
                           placeholder={editingPaymentId ? "Optional" : "123"}
                           maxLength={4}
                           className={paymentErrors.cvv ? 'border-red-500' : ''}
                         />
                         {paymentErrors.cvv && (
                           <p className="text-red-500 text-xs mt-1">{paymentErrors.cvv}</p>
                         )}
                       </div>
                     </div>

                     {editingPaymentId && (
                       <p className="text-sm text-gray-500">
                         Leave card number blank to keep the existing card, or enter a new card number to update it.
                       </p>
                     )}

                     <div className="flex gap-4 pt-4">
                       <Button type="submit" className="flex-1">
                         {editingPaymentId ? 'Save Changes' : 'Add Card'}
                       </Button>
                       <button
                         type="button"
                         onClick={() => {
                           setIsPaymentFormOpen(false);
                           setPaymentForm({ cardNumber: '', cardholderName: '', expiryMonth: '', expiryYear: '', cvv: '' });
                           setPaymentErrors({});
                         }}
                         className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
                       >
                         Cancel
                       </button>
                     </div>
                   </form>
                 </div>
               </Modal>
             </>
           )}
        </div>
      </div>

      {/* Tracking Modal */}
      <Modal isOpen={showTracking} onClose={() => setShowTracking(false)}>
        {trackingOrder && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-2">Tracking Details</h2>
            <p className="text-gray-500 mb-8">Order {trackingOrder.id}</p>
            
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
               <div className="relative pl-8">
                 <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow"></div>
                 <p className="font-bold text-sm">Out for Delivery</p>
                 <p className="text-xs text-gray-500">Today, 09:30 AM</p>
                 <p className="text-sm text-gray-600 mt-1">Your package is with the delivery agent.</p>
               </div>
               <div className="relative pl-8">
                 <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow"></div>
                 <p className="font-bold text-sm">Arrived at Sorting Facility</p>
                 <p className="text-xs text-gray-500">Yesterday, 06:45 PM</p>
                 <p className="text-sm text-gray-600 mt-1">Lagos Main Distribution Center</p>
               </div>
               <div className="relative pl-8">
                 <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow"></div>
                 <p className="font-bold text-sm">Shipped</p>
                 <p className="text-xs text-gray-500">Sep 29, 10:00 AM</p>
                 <p className="text-sm text-gray-600 mt-1">Package has left our warehouse.</p>
               </div>
               <div className="relative pl-8">
                 <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow"></div>
                 <p className="font-bold text-sm">Order Placed</p>
                 <p className="text-xs text-gray-500">Sep 28, 02:20 PM</p>
               </div>
            </div>

            <div className="mt-8 text-right">
              <Button onClick={() => setShowTracking(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// --- CONTACT PAGE ---
export const Contact: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
                </div>
                <h1 className="text-4xl font-serif font-bold mb-4">Message Sent</h1>
                <p className="text-gray-600 max-w-lg text-lg mb-8">
                    Thank you for contacting Andal Clothing. Our support team has received your message and will get back to you within 24 hours.
                </p>
                <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
            <div className="bg-[#111] text-white p-12 lg:p-24 flex flex-col justify-center">
                <h1 className="text-5xl font-serif font-medium mb-6">Get in Touch</h1>
                <p className="text-gray-400 mb-12 text-lg leading-relaxed">
                    Have questions about our Agbadas or need assistance with sizing? 
                    Our dedicated concierge team is here to assist you.
                </p>
                
                <div className="space-y-8">
                    <div className="flex gap-4">
                        <span className="material-symbols-outlined text-2xl">mail</span>
                        <div>
                            <p className="font-bold mb-1">Email Us</p>
                            <p className="text-gray-400">concierge@andalclothing.com</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <span className="material-symbols-outlined text-2xl">call</span>
                        <div>
                            <p className="font-bold mb-1">Call Us</p>
                            <p className="text-gray-400">+234 (0) 800 ANDAL LUXE</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <span className="material-symbols-outlined text-2xl">location_on</span>
                        <div>
                            <p className="font-bold mb-1">Visit Our Showroom</p>
                            <p className="text-gray-400">14 Ademola Adetokunbo, Victoria Island, Lagos</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-12 lg:p-24 flex items-center bg-white">
                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">First Name</label>
                            <Input placeholder="Enter your first name" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Last Name</label>
                            <Input placeholder="Enter your last name" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <Input type="email" placeholder="Enter your email" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <select className="w-full h-12 px-4 bg-white border border-gray-200 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                            <option>Order Inquiry</option>
                            <option>Custom Tailoring</option>
                            <option>Wholesale</option>
                            <option>Press & Media</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea 
                            className="w-full h-32 px-4 py-3 bg-white border border-gray-200 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none" 
                            placeholder="How can we help you?"
                            required
                        ></textarea>
                    </div>
                    <Button type="submit" className="w-full">Send Message</Button>
                </form>
            </div>
        </div>
    );
};

// --- PRESS PAGE ---
export const Press: React.FC = () => (
  <div className="max-w-6xl mx-auto px-6 py-20">
    <div className="text-center mb-16">
      <h1 className="text-5xl font-serif font-bold mb-6">Press & Media</h1>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg">Featured stories about Andal Clothing from around the globe.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
      <div className="group cursor-pointer">
        <div className="bg-gray-100 aspect-video rounded-xl mb-6 overflow-hidden">
             <img src="https://placehold.co/800x450/222/FFF?text=Vogue+Africa" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Vogue Africa • Oct 2024</span>
        <h2 className="text-2xl font-serif font-bold mt-2 mb-3 group-hover:underline">The Renaissance of the Agbada: Andal Clothing Leads the Way</h2>
        <p className="text-gray-600">"A stunning reinterpretation of classic Nigerian menswear that speaks to the modern global citizen..."</p>
      </div>
      <div className="group cursor-pointer">
        <div className="bg-gray-100 aspect-video rounded-xl mb-6 overflow-hidden">
             <img src="https://placehold.co/800x450/333/FFF?text=GQ+Style" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">GQ Style • Sep 2024</span>
        <h2 className="text-2xl font-serif font-bold mt-2 mb-3 group-hover:underline">Best Dressed at Lagos Fashion Week</h2>
        <p className="text-gray-600">"Andal Clothing stole the show with their 'Eid Collection', featuring impeccable embroidery and luxurious Swiss voile..."</p>
      </div>
    </div>

    <div className="border-t border-gray-200 pt-16">
      <h3 className="text-2xl font-bold mb-8">Recent Mentions</h3>
      <div className="space-y-6">
        {[
          { outlet: 'Forbes Africa', date: 'Aug 15, 2024', title: 'Top 10 Emerging Luxury Brands in West Africa' },
          { outlet: 'BellaNaija Style', date: 'Jul 22, 2024', title: 'The Ultimate Guide to Grooming for the Traditional Wedding' },
          { outlet: 'ThisDay Style', date: 'Jun 10, 2024', title: 'Interview with the Creative Director of Andal Clothing' }
        ].map((item, i) => (
          <div key={i} className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-gray-100 group cursor-pointer hover:bg-gray-50 px-4 rounded-lg transition-colors">
            <div>
              <h4 className="font-serif font-bold text-xl group-hover:text-blue-900 transition-colors">{item.title}</h4>
              <p className="text-gray-500 text-sm mt-1">{item.outlet}</p>
            </div>
            <span className="text-gray-400 text-sm mt-2 md:mt-0">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);