import React, { useState } from 'react';
import { Page } from '../types';
import { Button, Input } from '../components/Shared';

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

const MOCK_ORDERS: Order[] = [
  { 
    id: '#4523-23', 
    date: 'Oct 12, 2024', 
    status: 'Delivered', 
    total: '₦175,000.00', 
    items: [
      { name: 'Royal Grand Agbada', quantity: 1, price: '₦150,000.00', image: 'https://placehold.co/100/1a1a1a/FFF?text=Agbada' },
      { name: 'White Jalabiya', quantity: 1, price: '₦25,000.00', image: 'https://placehold.co/100/EAEAEA/1A1A1A?text=Jalabiya' }
    ] 
  },
  { 
    id: '#4490-11', 
    date: 'Sep 28, 2024', 
    status: 'In Transit', 
    total: '₦45,000.00', 
    items: [
      { name: 'Emirate Black Kaftan', quantity: 1, price: '₦45,000.00', image: 'https://placehold.co/100/000/FFF?text=Kaftan' }
    ]
  },
  { 
    id: '#4102-09', 
    date: 'Aug 15, 2024', 
    status: 'Delivered', 
    total: '₦12,000.00', 
    items: [
      { name: 'Zanna Cap', quantity: 1, price: '₦12,000.00', image: 'https://placehold.co/100/333/FFF?text=Cap' }
    ]
  },
];

const INITIAL_ADDRESSES: Address[] = [
  {
    id: '1',
    type: 'Home',
    name: 'Ibrahim Al-Fayed',
    address: '123 Andal Avenue, Lekki Phase 1',
    city: 'Lagos',
    state: 'Lagos State',
    phone: '+234 800 123 4567',
    isDefault: true
  },
  {
    id: '2',
    type: 'Office',
    name: 'Ibrahim Al-Fayed',
    address: '456 Trade Center, CBD',
    city: 'Abuja',
    state: 'FCT',
    phone: '+234 809 987 6543',
    isDefault: false
  }
];

// --- ACCOUNT PAGE ---
export const Account: React.FC<{ onNavigate: (page: Page, params?: any) => void; params?: any; onLogout?: () => void }> = ({ onNavigate, params, onLogout }) => {
  const currentView = params?.view || 'profile';

  // --- ORDER STATE ---
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- ADDRESS STATE ---
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
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

  return (
    <div className="flex min-h-[80vh] bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
               <span className="material-symbols-outlined text-gray-500">person</span>
            </div>
            <div>
              <p className="font-bold text-sm">Ibrahim Al-Fayed</p>
              <p className="text-xs text-gray-500">ibrahim@email.com</p>
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
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h2 className="text-sm text-gray-500 mb-2">Personal Information</h2>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">Ibrahim Al-Fayed</p>
                      <p className="text-gray-500">ibrahim@email.com</p>
                    </div>
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium">Edit</button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h2 className="text-sm text-gray-500 mb-2">Password</h2>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg tracking-widest">••••••••••••</p>
                      <p className="text-gray-500 text-sm">Last changed 3 months ago</p>
                    </div>
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium">Change Password</button>
                  </div>
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
                  <div className="space-y-6">
                    {MOCK_ORDERS.map((order, i) => (
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
                          <button onClick={() => setSelectedOrder(order)} className="text-sm font-medium underline hover:text-blue-600">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="animate-fade-in">
                  <button onClick={() => setSelectedOrder(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6">
                    <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Orders
                  </button>
                  <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">Order {selectedOrder.id}</h1>
                      <p className="text-gray-600">Placed on {selectedOrder.date}</p>
                    </div>
                    <div className={`mt-2 md:mt-0 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {selectedOrder.status}
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
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Ibrahim Al-Fayed<br/>
                        123 Andal Avenue, Lekki Phase 1<br/>
                        Lagos, Lagos State<br/>
                        Nigeria<br/>
                        +234 800 123 4567
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <h3 className="font-bold mb-4">Payment Method</h3>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-400">credit_card</span>
                        <p className="text-gray-600 text-sm">Visa ending in 4242</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Addresses View */}
          {currentView === 'addresses' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Addresses</h1>
                <Button onClick={openNewAddress} className="text-sm px-4 h-10">Add New</Button>
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
              ) : (
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
              )}
            </>
          )}

           {/* Payments View */}
           {currentView === 'payments' && (
             <>
               <h1 className="text-3xl font-bold mb-8">Payment Methods</h1>
               <div className="bg-white p-8 rounded-xl border border-gray-200 text-center py-16">
                 <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">credit_card_off</span>
                 <p className="text-gray-500 mb-6">You have no saved payment methods.</p>
                 <Button>Add New Card</Button>
               </div>
             </>
           )}
        </div>
      </div>
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
