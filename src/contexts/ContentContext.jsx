import { createContext, useContext, useState, useCallback } from 'react';
import { site as S } from '../data/site';
import { suites as staticSuites } from '../data/suites';
import { experiences as staticExperiences } from '../data/experiences';
import { menu as staticMenu, diningPhilosophy as staticPhilosophy } from '../data/menu';
import { testimonials as staticTestimonials } from '../data/testimonials';
import { faqs as staticFaqs } from '../data/pages';
import { galleryImages as staticGallery } from '../data/gallery';

const STORAGE_KEY = 'akagera_cms_v1';
const ContentContext = createContext(null);

/** Build the default content object from static data files */
function buildDefaults() {
  return {
    site: {
      name: S.name,
      tagline: S.tagline,
      description: S.description,
      address: S.address,
      region: S.region,
      phone1: S.phones[0] || '',
      phone2: S.phones[1] || '',
      email: S.email,
      checkIn: S.checkIn,
      checkOut: S.checkOut,
      reception: S.reception,
      roomCount: String(S.roomCount),
      distPark: S.distances.parkEntrance,
      distKigali: S.distances.driveFromKigali,
      distAirport: S.distances.kigaliAirport,
    },
    hero: {
      headline: 'Welcome back to',
      subtitle: `${S.tagline}. Experience local culture, heritage, and unforgettable moments at our hotel minutes from Akagera National Park.`,
    },
    about: {
      heading: 'A peaceful hotel minutes from Akagera National Park.',
      p1: `${S.name} is located at ${S.address}, in the heart of Akagera Village. We are a short drive from the Akagera National Park South Entrance — making us an ideal base for safari days and restful evenings alike.`,
      p2: `Our ${S.roomCount} rooms feature handcrafted wooden furniture, private balconies, air conditioning, smart TVs, and complimentary high-speed Wi-Fi. Every room booking includes a full breakfast for registered guests.`,
      p3: `Beyond accommodation, we offer a restaurant & lounge, bar, outdoor pool, and laundry service — all bookable with or without a room. Check-in and check-out are from ${S.checkIn} to ${S.checkOut}, with ${S.reception.toLowerCase()}.`,
    },
    // Images are stripped — public pages re-merge with static image imports
    suites: staticSuites.map(({ image, gallery, ...rest }) => ({ ...rest })),
    experiences: staticExperiences.map(({ image, ...rest }) => ({ ...rest })),
    gallery: staticGallery.map(({ src, ...rest }, i) => ({ ...rest, _id: `g${i}` })),
    // Icons are stripped — public pages re-merge with static icon imports
    menu: staticMenu.map(({ icon, ...rest }, i) => ({ ...rest, _id: `m${i}` })),
    diningPhilosophy: staticPhilosophy.map((p, i) => ({ ...p, _id: `dp${i}` })),
    testimonials: staticTestimonials.map((t, i) => ({ ...t, _id: `t${i}` })),
    faqs: staticFaqs.map((f, i) => ({ ...f, _id: `f${i}` })),
  };
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const defs = buildDefaults();
        // Deep-merge top-level object sections so new fields added later still appear
        return {
          ...defs,
          ...parsed,
          site:  { ...defs.site,  ...(parsed.site  || {}) },
          hero:  { ...defs.hero,  ...(parsed.hero  || {}) },
          about: { ...defs.about, ...(parsed.about || {}) },
        };
      }
    } catch {}
    return buildDefaults();
  });

  /** Replace an entire top-level section and persist to localStorage */
  const updateContent = useCallback((section, value) => {
    setContent(prev => {
      const next = { ...prev, [section]: value };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  /** Reset a single section back to its static defaults */
  const resetSection = useCallback((section) => {
    const defs = buildDefaults();
    updateContent(section, defs[section]);
  }, [updateContent]);

  return (
    <ContentContext.Provider value={{ content, updateContent, resetSection }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
};
