import React from 'react';
import { Page } from '../types';
import { Button } from '../components/Shared';

// --- ABOUT PAGE ---
export const About: React.FC = () => (
  <div className="max-w-[1920px] mx-auto">
    <div className="relative h-[70vh] w-full bg-cover bg-center flex items-center justify-center text-center px-6" style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://placehold.co/1920x1080/222/555?text=Heritage+Background")'}}>
      <div className="max-w-3xl text-white">
        <h1 className="text-5xl md:text-7xl font-black font-serif mb-6 tracking-tighter">Legacy. Honor. Style.</h1>
        <p className="text-lg md:text-xl font-light">Celebrating the timeless tradition of the Agbada and the modern African gentleman.</p>
      </div>
    </div>
    
    <div className="max-w-4xl mx-auto px-6 py-24 text-center">
      <h2 className="text-3xl font-bold mb-8">Our Heritage</h2>
      <p className="text-gray-600 leading-relaxed text-lg">
        Andal Clothing was founded with a single vision: to elevate traditional African menswear to the global stage. 
        We specialize in the art of the Agbada, the dignity of the Jalabiya, and the craftsmanship of the Fila. 
        Every piece is a testament to our rich cultural history, woven with modern sophistication.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-6 pb-24">
      <div className="space-y-4">
        <img src="https://placehold.co/800x600/333/FFF?text=Textile+Sourcing" className="rounded-lg aspect-[4/3] object-cover w-full"/>
        <h3 className="text-xl font-bold">Premium Textiles</h3>
        <p className="text-gray-600">We source the finest Atiku, Jacquard, and Swiss Voile fabrics for unparalleled comfort and drape.</p>
      </div>
      <div className="space-y-4">
        <img src="https://placehold.co/800x600/444/FFF?text=Embroidery+Detail" className="rounded-lg aspect-[4/3] object-cover w-full"/>
        <h3 className="text-xl font-bold">Master Craftsmanship</h3>
        <p className="text-gray-600">Our intricate embroidery is hand-finished by master tailors, preserving generations of skill.</p>
      </div>
    </div>
  </div>
);

// --- SUSTAINABILITY PAGE ---
export const Sustainability: React.FC = () => (
  <div className="max-w-[1920px] mx-auto pb-24">
    <div className="relative h-[600px] w-full flex items-center justify-center text-center px-6 bg-cover bg-center" style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://placehold.co/1920x1080/1a1a1a/444?text=Sustainable+Threads")'}}>
      <div className="max-w-4xl text-white">
        <h1 className="text-5xl md:text-7xl font-black font-serif mb-6">Woven with Purpose</h1>
        <p className="text-xl font-light max-w-2xl mx-auto">Luxury that respects our roots and our earth.</p>
      </div>
    </div>

    <div className="sticky top-20 z-30 bg-white/90 backdrop-blur border-b border-gray-100 py-4 flex justify-center gap-4 overflow-x-auto px-6">
      {['Our Fabrics', 'Local Artisans', 'Community', 'Our Pledge'].map(tab => (
        <button key={tab} className="px-6 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium whitespace-nowrap transition-colors">{tab}</button>
      ))}
    </div>

    <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-4xl font-bold mb-6">Ethical Fabrics</h3>
          <p className="text-gray-600 leading-relaxed text-lg">We prioritize natural fibers like high-grade cotton and locally woven textiles. Our commitment to sustainability starts with the very threads we use for your Jalabiyas and Kaftans.</p>
        </div>
        <img src="https://placehold.co/800x800/333/FFF?text=Cotton+Fabric" className="rounded-xl shadow-lg"/>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <img src="https://placehold.co/800x800/555/FFF?text=Tailor+At+Work" className="rounded-xl shadow-lg md:order-1"/>
        <div className="md:order-2">
          <h3 className="text-4xl font-bold mb-6">Supporting Local Tailors</h3>
          <p className="text-gray-600 leading-relaxed text-lg">We champion the local economy by partnering with skilled artisans. Every purchase supports the livelihood of master tailors and embroiderers in our community.</p>
        </div>
      </div>
    </div>
  </div>
);

// --- JOURNAL PAGE ---
export const Journal: React.FC = () => (
  <div className="max-w-7xl mx-auto px-6 py-16">
    <div className="mb-12">
      <h1 className="text-6xl font-serif font-medium mb-10">The Andal Journal</h1>
      
      {/* Hero Article */}
      <div className="relative rounded-xl overflow-hidden h-[500px] mb-12 group cursor-pointer">
        <img src="https://placehold.co/1200x600/111/444?text=The+Art+of+Agbada" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10">
          <span className="text-white/80 text-sm mb-2 uppercase tracking-wide">Style Guide</span>
          <h2 className="text-white text-4xl font-medium mb-4">Mastering the Agbada: A Gentleman's Guide</h2>
          <span className="text-white underline underline-offset-4">Read More</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-y border-gray-200 py-4 gap-4">
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input className="w-full h-10 bg-gray-100 rounded-full pl-10 pr-4 text-sm" placeholder="Search articles" />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Culture', 'Style Guides', 'Fabric Care'].map(filter => (
            <button key={filter} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'All' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{filter}</button>
          ))}
        </div>
      </div>
    </div>

    {/* Article Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
      {[
        { title: 'The History of the Fila (Hausa Cap)', img: 'https://placehold.co/600x400/222/FFF?text=History+of+Fila', cat: 'Culture' },
        { title: 'Choosing the Right Fabric for your Kaftan', img: 'https://placehold.co/600x400/333/FFF?text=Fabric+Guide', cat: 'Style Guide' },
        { title: '5 Ways to Style Your Jalabiya', img: 'https://placehold.co/600x400/444/FFF?text=Jalabiya+Styling', cat: 'Style Guide' },
        { title: 'Caring for Hand-Embroidered Attire', img: 'https://placehold.co/600x400/555/FFF?text=Care+Guide', cat: 'Fabric Care' },
        { title: 'Traditional Weddings: What to Wear', img: 'https://placehold.co/600x400/666/FFF?text=Wedding+Guest', cat: 'Culture' },
        { title: 'The Significance of Colors in Agbada', img: 'https://placehold.co/600x400/777/FFF?text=Color+Meaning', cat: 'Culture' },
      ].map((article, i) => (
        <article key={i} className="group cursor-pointer">
          <div className="overflow-hidden rounded-lg mb-4">
            <img src={article.img} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{article.cat}</span>
          <h3 className="text-xl font-serif font-medium mt-2 mb-2 group-hover:underline underline-offset-4">{article.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">Discover the rich traditions and modern styling tips for the contemporary African man.</p>
        </article>
      ))}
    </div>
    
    <div className="mt-16 text-center">
      <Button variant="outline" className="w-40 mx-auto rounded-full">Load More</Button>
    </div>
  </div>
);

// --- CAREERS PAGE ---
export const Careers: React.FC = () => (
  <div>
    <div className="relative h-[60vh] flex items-center justify-center text-center bg-gray-900 px-6">
      <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/111/333?text=Tailors+Working')] bg-cover bg-center opacity-40"></div>
      <div className="relative z-10 text-white max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-serif font-medium mb-6">Join the Andal Family</h1>
        <p className="text-lg mb-8 opacity-90">Help us redefine traditional menswear for the modern world.</p>
        <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-8">View Openings</Button>
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif font-medium mb-4">Our Culture</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">We value respect, heritage, and innovation.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-24">
        {['Craftsmanship', 'Heritage', 'Community'].map((val, i) => (
          <div key={i} className="p-8 border rounded-xl text-center bg-white shadow-sm">
            <span className="material-symbols-outlined text-4xl mb-4">{i === 0 ? 'cut' : i === 1 ? 'history_edu' : 'groups'}</span>
            <h3 className="text-xl font-bold mb-2">{val}</h3>
            <p className="text-gray-600 text-sm">We are dedicated to preserving our cultural legacy while innovating for the future.</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-3xl font-serif text-center mb-10">Current Openings</h2>
        <div className="space-y-4">
          {['Master Tailor', 'E-commerce Manager', 'Textile Sourcing Specialist', 'Customer Success Agent'].map((job, i) => (
            <div key={i} className="flex justify-between items-center p-6 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
              <div>
                <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{job}</h3>
                <p className="text-gray-500 text-sm">{i % 2 === 0 ? 'Lagos, Nigeria' : 'Remote'}</p>
              </div>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- HELP CENTER PAGE ---
export const HelpCenter: React.FC = () => (
  <div className="bg-gray-50 min-h-screen">
    <div className="bg-white border-b py-16 text-center">
      <h1 className="text-5xl font-serif font-bold mb-8">Help Center</h1>
      <div className="max-w-2xl mx-auto relative px-6">
        <span className="material-symbols-outlined absolute left-10 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        <input className="w-full h-14 pl-14 pr-4 rounded-lg border border-gray-200 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="How can we help?" />
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="space-y-4">
        {['Do you offer custom tailoring?', 'How do I measure for an Agbada?', 'Do you ship internationally?', 'Care instructions for embroidery?'].map((q, i) => (
          <details key={i} className="group bg-white border border-gray-200 rounded-lg overflow-hidden">
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-semibold hover:bg-gray-50">
              {q}
              <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
            </summary>
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              Contact our support team for detailed guidance on our sizing and custom services.
            </div>
          </details>
        ))}
      </div>
    </div>
  </div>
);