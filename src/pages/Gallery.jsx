import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { galleryImages, galleryCategories } from '../data/gallery';
export default function Gallery() {
    const [active, setActive] = useState('All');
    const [lightbox, setLightbox] = useState(null);
    const filtered = active === 'All'
        ? galleryImages
        : galleryImages.filter((img) => img.category === active);
    return (<>
      <PageHeader eyebrow="Through Our Lens" title={<>
            A few moments
            <span className="italic text-sand-200"> we never want to forget.</span>
          </>} subtitle="Captured by our guests and guides over the past season. Tag us @akageraparkinn to share yours." image="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop"/>

      <section className="bg-sand-50 bg-grain py-24 sm:py-32">
        <div className="container-x">
          {/* Filters */}
          <div className="reveal flex flex-wrap items-center justify-center gap-3">
            {galleryCategories.map((cat) => (<button key={cat} type="button" onClick={() => setActive(cat)} className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${active === cat
                ? 'bg-forest-700 text-sand-50 shadow-soft'
                : 'border border-forest-700/25 text-forest-800 hover:border-forest-700 hover:bg-forest-700/5'}`}>
                {cat}
              </button>))}
          </div>

          {/* Grid */}
          <div className="reveal mt-14 grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[240px] lg:grid-cols-4">
            {filtered.map((img) => (<button key={img.src} type="button" onClick={() => setLightbox(img.src)} className={`group relative overflow-hidden rounded-2xl text-left ${img.span ?? ''}`}>
                <img src={img.src} alt={img.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy"/>
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"/>
                <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-[10px] uppercase tracking-widest text-sand-200/80">
                    {img.category}
                  </span>
                  <p className="text-sm text-sand-50">{img.alt}</p>
                </div>
              </button>))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (<div className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-950/90 p-6 backdrop-blur-sm animate-fade-in" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
          <button type="button" aria-label="Close" className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-sand-50/30 text-sand-50 transition-colors hover:bg-sand-50 hover:text-forest-900" onClick={() => setLightbox(null)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <img src={lightbox} alt="Enlarged" className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-lift" onClick={(e) => e.stopPropagation()}/>
        </div>)}
    </>);
}
