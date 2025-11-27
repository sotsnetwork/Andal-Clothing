import React from 'react';
import { Page } from '../types';
import { Button, Input } from '../components/Shared';

// --- ACCOUNT PAGE ---
export const Account: React.FC<{ onNavigate: (page: Page, params?: any) => void; params?: any; onLogout?: () => void }> = ({ onNavigate, params, onLogout }) => {
  const currentView = params?.view || 'profile';

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
            onClick={() => onNavigate(Page.ACCOUNT, { view: 'profile' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-left ${currentView === 'profile' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span className="material-symbols-outlined text-xl">person</span> Account Settings
          </button>
          <button 
            onClick={() => onNavigate(Page.ACCOUNT, { view: 'orders' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-left ${currentView === 'orders' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span className="material-symbols-outlined text-xl">shopping_bag</span> My Orders
          </button>
          <button 
            onClick={() => onNavigate(Page.ACCOUNT, { view: 'addresses' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-left ${currentView === 'addresses' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span className="material-symbols-outlined text-xl">home</span> Addresses
          </button>
          <button 
            onClick={() => onNavigate(Page.ACCOUNT, { view: 'payments' })}
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
              <h1 className="text-3xl font-bold mb-8">My Orders</h1>
              <div className="space-y-6">
                {[
                  { id: '#4523-23', date: 'Oct 12, 2024', status: 'Delivered', total: '$1,750.00', items: 'Royal Grand Agbada, White Jalabiya' },
                  { id: '#4490-11', date: 'Sep 28, 2024', status: 'In Transit', total: '$450.00', items: 'Emirate Black Kaftan' },
                  { id: '#4102-09', date: 'Aug 15, 2024', status: 'Delivered', total: '$120.00', items: 'Zanna Cap' },
                ].map((order, i) => (
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
                      <p className="text-sm text-gray-600 truncate max-w-md">{order.items}</p>
                      <button className="text-sm font-medium underline">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Addresses View */}
          {currentView === 'addresses' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Addresses</h1>
                <Button className="h-10 text-sm bg-black text-white">Add New Address</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 relative group">
                  <span className="absolute top-4 right-4 bg-gray-100 px-2 py-1 text-xs font-bold rounded">Default</span>
                  <div className="mb-4">
                     <span className="material-symbols-outlined text-gray-400 text-3xl mb-2">home</span>
                     <h3 className="font-bold">Home</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Ibrahim Al-Fayed<br/>
                    123 Andal Avenue<br/>
                    Lekki Phase 1, Lagos<br/>
                    Nigeria<br/>
                    +234 800 123 4567
                  </p>
                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button className="text-sm font-medium hover:text-black text-gray-500">Edit</button>
                    <button className="text-sm font-medium hover:text-red-600 text-gray-500">Remove</button>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 relative group">
                  <div className="mb-4">
                     <span className="material-symbols-outlined text-gray-400 text-3xl mb-2">work</span>
                     <h3 className="font-bold">Office</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Ibrahim Al-Fayed<br/>
                    456 Trade Center, CBD<br/>
                    Abuja, FCT<br/>
                    Nigeria<br/>
                    +234 809 987 6543
                  </p>
                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button className="text-sm font-medium hover:text-black text-gray-500">Edit</button>
                    <button className="text-sm font-medium hover:text-red-600 text-gray-500">Remove</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Payments View */}
          {currentView === 'payments' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Payment Methods</h1>
                <Button className="h-10 text-sm bg-black text-white">Add New Card</Button>
              </div>
              <div className="space-y-4">
                 <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <span className="font-bold text-xs">VISA</span>
                       </div>
                       <div>
                          <p className="font-bold">Visa ending in 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/25</p>
                       </div>
                    </div>
                    <span className="bg-gray-100 px-3 py-1 rounded text-xs font-bold">Default</span>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <span className="font-bold text-xs text-orange-600">MC</span>
                       </div>
                       <div>
                          <p className="font-bold">Mastercard ending in 8899</p>
                          <p className="text-sm text-gray-500">Expires 09/26</p>
                       </div>
                    </div>
                    <button className="text-sm font-medium text-gray-500 hover:text-black">Remove</button>
                 </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- CONTACT PAGE ---
export const Contact: React.FC = () => (
  <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
    <div className="flex flex-col lg:flex-row gap-16">
      <div className="flex-1">
        <h1 className="text-5xl font-serif font-medium mb-6">Get in Touch</h1>
        <p className="text-gray-600 mb-10 text-lg">We're here to help. Whether you have a question about custom fittings, fabric availability, or your order status, our team is ready.</p>
        
        <form className="space-y-6">
          <div className="flex gap-6">
            <label className="flex-1 block">
              <span className="text-sm font-bold mb-2 block">Full Name</span>
              <Input placeholder="Enter your full name" />
            </label>
            <label className="flex-1 block">
              <span className="text-sm font-bold mb-2 block">Email Address</span>
              <Input type="email" placeholder="Enter your email" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-bold mb-2 block">Subject</span>
            <Input placeholder="Enter subject" />
          </label>
          <label className="block">
            <span className="text-sm font-bold mb-2 block">Message</span>
            <textarea className="w-full h-32 p-4 border rounded focus:outline-none focus:border-black resize-none" placeholder="Write your message here..."></textarea>
          </label>
          <Button className="w-full bg-blue-700 hover:bg-blue-800">Send Message</Button>
        </form>
      </div>

      <div className="lg:w-1/3 space-y-10 lg:mt-24">
        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
          <h3 className="text-xl font-serif font-bold mb-6">Contact Details</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-gray-400">mail</span>
              <div>
                <p className="font-bold">Email</p>
                <a href="#" className="text-blue-600">support@andalclothing.com</a>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-gray-400">call</span>
              <div>
                <p className="font-bold">Phone</p>
                <p>+234 800 123 4567</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-gray-400">location_on</span>
              <div>
                <p className="font-bold">Showroom</p>
                <p className="text-gray-600 text-sm">123 Andal Avenue<br/>Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- PRESS PAGE ---
export const Press: React.FC = () => (
  <div className="max-w-7xl mx-auto px-6 py-12">
    <div className="relative h-[400px] rounded-xl overflow-hidden bg-gray-800 mb-16 flex items-center justify-center text-center px-4">
      <div className="absolute inset-0 bg-[url('https://placehold.co/1920x600/111/444?text=Andal+Press')] bg-cover bg-center opacity-50"></div>
      <div className="relative z-10 text-white">
        <h1 className="text-6xl font-serif font-bold mb-4">Press & Media</h1>
        <p className="text-xl max-w-2xl mx-auto">Latest news and features from Andal Clothing.</p>
      </div>
    </div>

    <div className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif font-bold">Press Releases</h2>
        <div className="flex gap-2">
          {['All', '2024', '2023'].map(y => (
            <button key={y} className={`px-4 py-1 rounded-full text-sm ${y==='All' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>{y}</button>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        {[
          { date: 'Oct 15, 2024', title: 'Andal Clothing Launches "The Grand Agbada" Series', desc: 'A new collection redefining ceremonial wear for the modern man.' },
          { date: 'Aug 02, 2024', title: 'New Flagship Store Opens in Lagos', desc: 'Bringing premium traditional menswear closer to home.' },
          { date: 'May 21, 2024', title: 'Sourcing the Finest Swiss Voile', desc: 'Our partnership with premium textile manufacturers.' }
        ].map((pr, i) => (
          <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 group cursor-pointer hover:bg-gray-50 p-4 rounded transition-colors">
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase mb-1 block">{pr.date}</span>
              <h3 className="text-lg font-bold mb-1">{pr.title}</h3>
              <p className="text-sm text-gray-600">{pr.desc}</p>
            </div>
            <span className="text-blue-600 text-sm font-bold flex items-center mt-2 md:mt-0 group-hover:translate-x-1 transition-transform">View Release <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span></span>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gray-50 p-12 rounded-xl text-center">
      <h2 className="text-2xl font-serif font-bold mb-2">Media Inquiries</h2>
      <p className="text-gray-600 mb-6">For all press related inquiries, please contact our PR team.</p>
      <a href="mailto:press@andalclothing.com" className="text-blue-600 font-bold text-lg hover:underline">press@andalclothing.com</a>
    </div>
  </div>
);