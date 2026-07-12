import { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Upload,
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Sun,
  DoorOpen,
  Compass,
  BedDouble,
  Bell,
  Quote,
  CalendarCheck,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Star,
  Home,
  Utensils,
  MapPin,
  Phone,
  Mail,
  Globe,
} from "lucide-react";

const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api").replace(/\/$/, "");
const APP_URL = API_URL.replace(/\/api$/, "");

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/storage/")) return `${APP_URL}${path}`;
  if (path.startsWith("storage/")) return `${APP_URL}/${path}`;
  return `${APP_URL}/storage/${path}`;
};

const getToken = () => {
  return sessionStorage.getItem("token") || localStorage.getItem("token") || localStorage.getItem("auth_token");
};

// Fields that are always treated as image fields
const IMAGE_KEYS = new Set(["background_image", "image", "small_image", "avatar_image"]);

/**
 * Walk a section's data, pull every File out into `formData`.
 */
function stripFilesForSubmit(node, formData, pathParts) {
  if (Array.isArray(node)) {
    return node.map((item, idx) => stripFilesForSubmit(item, formData, [...pathParts, idx]));
  }
  if (node && typeof node === "object" && !(node instanceof File)) {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      if (key.endsWith("_preview")) continue;
      if (IMAGE_KEYS.has(key) && value instanceof File) {
        const fieldPath = [...pathParts, key];
        formData.append(`images${fieldPath.map((p) => `[${p}]`).join("")}`, value);
        out[key] = '__FILE_REPLACE__';
      } else {
        out[key] = stripFilesForSubmit(value, formData, [...pathParts, key]);
      }
    }
    return out;
  }
  return node;
}

// Full default copy for the homepage
const DEFAULT_HOMEPAGE_CONTENT = {
  hero: {
    title: "Welcome back to Akagera Park Inn.",
    description:
      "Near Akagera National Park • Calm stays • Pool & garden. Experience local culture, heritage, and unforgettable moments at our hotel minutes from Akagera National Park.",
    button_text: "Book Your Stay",
    button_secondary_text: "View Rooms",
    background_image: "/images/home/hero-bg.jpg",
  },
  welcome: {
    title: "Welcome to Akagera Park Inn",
    subtitle: "Near Akagera National Park • Calm stays • Pool & garden",
    description:
      "A peaceful hotel in Akagera Village, minutes from Akagera National Park. Calm stays with an outdoor pool, garden, restaurant & lounge, and warm Rwandan hospitality.",
    image: "/images/home/welcome-image.jpg",
    small_image: "/images/home/welcome-small-image.jpg",
    cards: [
      {
        title: "Calm stays near the park",
        description: "Just 2–3 km from Akagera National Park South Entrance.",
        icon: "🏞️",
      },
      {
        title: "Warm Rwandan hospitality",
        description: "Beautiful rooms, amazing food, and exceptional service.",
        icon: "🤝",
      },
      {
        title: "Services on your terms",
        description: "Book restaurant, bar, or laundry with or without a room.",
        icon: "🛎️",
      },
      {
        title: "Pool, garden & breakfast",
        description: "Start each day with a full included breakfast.",
        icon: "🌅",
      },
    ],
  },
  discover: {
    title: "Discover the Inn",
    subtitle: "Rooms, dining, and services.",
    description: "Explore everything Akagera Park Inn offers.",
    cards: [
      {
        title: "Experience local culture and heritage",
        description: "A peaceful escape near Akagera National Park.",
        background_image: "/images/home/discover-1.jpg",
        link: "/about",
        button_text: "About Us",
      },
      {
        title: "Restaurant & Lounge",
        description: "African, American & Argentinian cuisine.",
        background_image: "/images/home/discover-2.jpg",
        link: "/restaurant",
        button_text: "Explore",
      },
      {
        title: "Outdoor Pool & Garden",
        description: "Unwind in our outdoor swimming pool.",
        background_image: "/images/home/discover-3.jpg",
        link: "/services",
        button_text: "Explore",
      },
      {
        title: "Comfortable Rooms",
        description: "Spacious rooms with mountain views.",
        background_image: "/images/home/discover-4.jpg",
        link: "/rooms",
        button_text: "View Rooms",
      },
    ],
  },
  rooms: {
    title: "Rooms",
    subtitle: "Comfortable rooms with breakfast included.",
    rooms: [
      {
        name: "Twin Room",
        subtitle: "Buffalo & Elephant Room - Garden View",
        description: "Spacious 20 m² room with garden view.",
        guests: 4,
        view: "Garden",
        image: "/images/home/room-twin.jpg",
        price: "$120/night",
      },
      {
        name: "Double Room",
        subtitle: "Courtyard View - Handcrafted Comfort",
        description: "A 20 m² double room with courtyard view.",
        guests: 8,
        view: "Courtyard",
        image: "/images/home/room-double.jpg",
        price: "$150/night",
      },
    ],
  },
  services: {
    title: "Services",
    subtitle: "Restaurant, pool, laundry and more.",
    services: [
      {
        title: "Restaurant & Lounge",
        description: "African, American & Argentinian cuisine.",
        icon: "🍽️",
        background_image: "/images/home/service-restaurant.jpg",
        timing: "Daily - Breakfast, Lunch & Dinner",
      },
      {
        title: "Outdoor Pool & Garden",
        description: "Unwind in our outdoor swimming pool.",
        icon: "🏊",
        background_image: "/images/home/service-pool.jpg",
        timing: "All Day - Year Round",
      },
      {
        title: "Laundry Service",
        description: "Fresh clothes when you need them.",
        icon: "🧺",
        background_image: "/images/home/service-laundry.jpg",
        timing: "All Day - Daily",
      },
    ],
  },
  testimonials: {
    title: "Guest Stories",
    subtitle: "The best reviews are the ones told around a fire.",
    description: "We have been lucky with our guests.",
    testimonials: [
      {
        name: "Sarah & Family",
        location: "Kigali, Rwanda",
        comment: "Beautiful rooms, amazing food, and exceptional hospitality.",
        rating: 5,
        avatar_image: "/images/home/avatar-sarah.jpg",
      },
      {
        name: "John & Lisa",
        location: "Nairobi, Kenya",
        comment: "The pool and garden were perfect for relaxing.",
        rating: 5,
        avatar_image: "/images/home/avatar-john.jpg",
      },
      {
        name: "Peter & Maria",
        location: "Kampala, Uganda",
        comment: "Excellent service and wonderful hospitality.",
        rating: 4,
        avatar_image: "/images/home/avatar-peter.jpg",
      },
    ],
  },
  booking: {
    title: "Book Your Stay",
    subtitle: "Your peaceful escape awaits near the park.",
    description: "Pick your room and dates for instant confirmation.",
    button_text: "Book Your Stay",
    button_secondary_text: "View Services",
    background_image: "/images/home/booking-bg.jpg",
  },
};

// ─── IMAGE DROPZONE COMPONENT ────────────────────────────────────────────────
function ImageDropzone({ label, preview, uploading, height, onUpload, onRemove, compact, small }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-stone-700">{label}</label>
      <div className={`rounded-2xl border-4 border-dashed border-stone-300 bg-white ${small ? "p-2" : "p-4"} hover:border-emerald-500 transition`}>
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt={label}
              className={`${height} w-full rounded-xl object-cover`}
              onError={(e) => { e.target.src = "https://placehold.co/800x400?text=Image+Not+Found"; }}
            />
            <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 rounded-xl transition flex items-center justify-center gap-2">
              <button onClick={onRemove} className="rounded-full bg-rose-500 p-2 text-white hover:bg-rose-600 transition">
                <Trash2 size={compact ? 14 : 16} />
              </button>
              <label className="cursor-pointer">
                <div className="rounded-full bg-emerald-600 p-2 text-white hover:bg-emerald-700 transition">
                  <Upload size={compact ? 14 : 16} />
                </div>
                <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer block">
            <div className={`flex flex-col items-center justify-center ${height} rounded-xl border-4 border-dashed border-stone-300 hover:border-emerald-500 transition`}>
              {uploading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              ) : (
                <>
                  <Upload size={compact ? 20 : 28} className="text-stone-400" />
                  <p className="mt-2 text-xs text-stone-500">Click to upload</p>
                </>
              )}
            </div>
            <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
}

// ─── PREVIEW MODAL COMPONENT ──────────────────────────────────────────────────
function PreviewModal({ data, onClose }) {
  const content = data || {};

  return (
    <div className="fixed inset-0 z-50 bg-stone-50 overflow-y-auto">
      {/* Preview Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-semibold text-stone-700">Live Preview</span>
            <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">Website View</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition text-sm font-medium"
          >
            <X className="h-4 w-4" />
            Close Preview
          </button>
        </div>
      </div>

      {/* Website Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HERO SECTION */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          {content.hero?.background_image ? (
            <img
              src={getImageUrl(content.hero.background_image)}
              alt="Hero"
              className="w-full h-[400px] object-cover"
            />
          ) : (
            <div className="w-full h-[400px] bg-gradient-to-r from-emerald-800 to-emerald-600" />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl leading-tight">
              {content.hero?.title || "Welcome to Akagera Park Inn"}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl">
              {content.hero?.description || "Experience the beauty of Akagera"}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition">
                {content.hero?.button_text || "Book Your Stay"}
              </button>
              <button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full backdrop-blur-sm transition">
                {content.hero?.button_secondary_text || "View Rooms"}
              </button>
            </div>
          </div>
        </div>

        {/* WELCOME SECTION */}
        {content.welcome && (
          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-stone-800">{content.welcome.title || "Welcome"}</h2>
                <p className="text-emerald-600 font-medium mt-1">{content.welcome.subtitle}</p>
                <p className="text-stone-600 mt-4 leading-relaxed">{content.welcome.description}</p>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {(content.welcome.cards || []).slice(0, 4).map((card, i) => (
                    <div key={i} className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                      <span className="text-2xl">{card.icon || "🏞️"}</span>
                      <p className="text-sm font-semibold text-stone-800 mt-1">{card.title}</p>
                      <p className="text-xs text-stone-500">{card.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                {content.welcome.image && (
                  <img
                    src={getImageUrl(content.welcome.image)}
                    alt="Welcome"
                    className="rounded-2xl w-full h-80 object-cover shadow-lg"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* DISCOVER SECTION */}
        {content.discover && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-stone-800 text-center">{content.discover.title || "Discover"}</h2>
            <p className="text-center text-stone-500 mt-1">{content.discover.subtitle}</p>
            <p className="text-center text-stone-600 max-w-2xl mx-auto mt-2">{content.discover.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {(content.discover.cards || []).map((card, i) => {
                const img = getImageUrl(card.background_image);
                return (
                  <div key={i} className="relative rounded-xl overflow-hidden group h-48 cursor-pointer">
                    {img ? (
                      <img src={img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="w-full h-full bg-emerald-100" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-sm">{card.title}</h3>
                      <button className="mt-1 text-xs text-white/80 hover:text-white flex items-center gap-1">
                        {card.button_text || "Explore"} <ChevronRightIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ROOMS SECTION */}
        {content.rooms && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-stone-800 text-center">{content.rooms.title || "Rooms"}</h2>
            <p className="text-center text-stone-500 mt-1">{content.rooms.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {(content.rooms.rooms || []).map((room, i) => {
                const img = getImageUrl(room.image);
                return (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100">
                    {img ? (
                      <img src={img} alt={room.name} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-stone-100 flex items-center justify-center">
                        <BedDouble className="h-12 w-12 text-stone-300" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-stone-800">{room.name}</h3>
                          <p className="text-sm text-stone-500">{room.subtitle}</p>
                        </div>
                        <span className="text-emerald-700 font-bold">{room.price}</span>
                      </div>
                      <p className="text-sm text-stone-600 mt-2">{room.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-stone-500">
                        <span>👤 {room.guests} Guests</span>
                        <span>👁️ {room.view}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SERVICES SECTION */}
        {content.services && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-stone-800 text-center">{content.services.title || "Services"}</h2>
            <p className="text-center text-stone-500 mt-1">{content.services.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {(content.services.services || []).map((service, i) => {
                const img = getImageUrl(service.background_image);
                return (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 text-center">
                    {img ? (
                      <img src={img} alt={service.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-stone-100 flex items-center justify-center">
                        <span className="text-5xl">{service.icon || "🍽️"}</span>
                      </div>
                    )}
                    <div className="p-4">
                      <span className="text-3xl">{service.icon || "🍽️"}</span>
                      <h3 className="text-lg font-bold text-stone-800 mt-2">{service.title}</h3>
                      <p className="text-sm text-stone-600 mt-1">{service.description}</p>
                      <p className="text-xs text-emerald-600 mt-2 font-medium">{service.timing}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TESTIMONIALS SECTION */}
        {content.testimonials && (
          <div className="mb-12 bg-stone-100 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-stone-800 text-center">{content.testimonials.title || "Guest Stories"}</h2>
            <p className="text-center text-stone-500 mt-1">{content.testimonials.subtitle}</p>
            <p className="text-center text-stone-600 max-w-2xl mx-auto mt-2">{content.testimonials.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {(content.testimonials.testimonials || []).map((t, i) => {
                const avatar = getImageUrl(t.avatar_image);
                return (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                    <div className="flex items-center gap-3">
                      {avatar ? (
                        <img src={avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-lg font-bold">
                          {t.name?.[0] || "G"}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-stone-800">{t.name}</p>
                        <p className="text-xs text-stone-500">{t.location}</p>
                      </div>
                    </div>
                    <p className="text-sm text-stone-600 mt-3 italic">"{t.comment}"</p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={14}
                          className={j < (t.rating || 5) ? "fill-amber-400 text-amber-400" : "text-stone-300"}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BOOKING SECTION */}
        {content.booking && (
          <div className="relative rounded-2xl overflow-hidden">
            {content.booking.background_image ? (
              <img
                src={getImageUrl(content.booking.background_image)}
                alt="Booking"
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-r from-emerald-800 to-emerald-600" />
            )}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
              <h2 className="text-3xl md:text-4xl font-bold">{content.booking.title || "Book Your Stay"}</h2>
              <p className="mt-2 text-white/80 max-w-2xl">{content.booking.subtitle}</p>
              <p className="mt-1 text-white/60 text-sm">{content.booking.description}</p>
              <button className="mt-6 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition">
                {content.booking.button_text || "Book Now"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HERO SECTION EDITOR ─────────────────────────────────────────────────────
function HeroSectionEditor({ data, onChange, onImageUpload, onRemoveImage, isUploading }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
              placeholder="Hero title..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Description</label>
            <textarea
              value={data.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              rows={3}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-y transition"
              placeholder="Hero description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Button Text</label>
              <input
                type="text"
                value={data.button_text || ""}
                onChange={(e) => onChange("button_text", e.target.value)}
                className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
                placeholder="Book Your Stay"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Secondary Button</label>
              <input
                type="text"
                value={data.button_secondary_text || ""}
                onChange={(e) => onChange("button_secondary_text", e.target.value)}
                className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
                placeholder="View Rooms"
              />
            </div>
          </div>
        </div>
        <ImageDropzone
          label="Background Image"
          preview={data.background_image_preview || getImageUrl(data.background_image)}
          uploading={isUploading(undefined, "background_image")}
          height="h-48"
          onUpload={(file) => onImageUpload(file)}
          onRemove={onRemoveImage}
        />
      </div>
    </div>
  );
}

// ─── WELCOME SECTION EDITOR ─────────────────────────────────────────────────
function WelcomeSectionEditor({ data, onChange, onImageUpload, onRemoveImage, isUploading }) {
  const addCard = () => {
    const cards = [...(data.cards || [])];
    cards.push({ title: "", description: "", icon: "🏞️" });
    onChange("cards", cards);
  };

  const removeCard = (index) => {
    const cards = [...(data.cards || [])];
    cards.splice(index, 1);
    onChange("cards", cards);
  };

  const updateCard = (index, field, value) => {
    const cards = [...(data.cards || [])];
    cards[index] = { ...cards[index], [field]: value };
    onChange("cards", cards);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label>
            <input type="text" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Welcome title..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label>
            <input type="text" value={data.subtitle || ""} onChange={(e) => onChange("subtitle", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Welcome subtitle..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Description</label>
            <textarea value={data.description || ""} onChange={(e) => onChange("description", e.target.value)} rows={3} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-y transition" placeholder="Welcome description..." />
          </div>
        </div>
        <div className="space-y-4">
          <ImageDropzone
            label="Main Image"
            preview={data.image_preview || getImageUrl(data.image)}
            uploading={isUploading(undefined, "image")}
            height="h-32"
            compact
            onUpload={(file) => onImageUpload(file, undefined, "image")}
            onRemove={() => onRemoveImage(undefined, "image")}
          />
          <ImageDropzone
            label="Small Image"
            preview={data.small_image_preview || getImageUrl(data.small_image)}
            uploading={isUploading(undefined, "small_image")}
            height="h-24"
            compact
            onUpload={(file) => onImageUpload(file, undefined, "small_image")}
            onRemove={() => onRemoveImage(undefined, "small_image")}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-stone-700">Feature Cards</label>
          <button onClick={addCard} className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800 transition">
            <Plus size={14} /> Add Card
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(data.cards || []).map((card, index) => (
            <div key={index} className="relative rounded-xl border-2 border-stone-200 p-4 bg-stone-50 hover:border-emerald-300 transition">
              <button onClick={() => removeCard(index)} className="absolute top-2 right-2 rounded-full bg-rose-100 p-1 text-rose-500 hover:bg-rose-200 transition"><X size={14} /></button>
              <div className="space-y-2">
                <input type="text" value={card.title || ""} onChange={(e) => updateCard(index, "title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Card title" />
                <textarea value={card.description || ""} onChange={(e) => updateCard(index, "description", e.target.value)} rows={2} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-none transition" placeholder="Card description" />
                <input type="text" value={card.icon || ""} onChange={(e) => updateCard(index, "icon", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Icon (emoji)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DISCOVER SECTION EDITOR ─────────────────────────────────────────────────
function DiscoverSectionEditor({ data, onChange, onImageUpload, onRemoveImage, isUploading }) {
  const addCard = () => {
    const cards = [...(data.cards || [])];
    cards.push({ title: "", description: "", background_image: null, link: "", button_text: "Explore" });
    onChange("cards", cards);
  };

  const removeCard = (index) => {
    const cards = [...(data.cards || [])];
    cards.splice(index, 1);
    onChange("cards", cards);
  };

  const updateCard = (index, field, value) => {
    const cards = [...(data.cards || [])];
    cards[index] = { ...cards[index], [field]: value };
    onChange("cards", cards);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label><input type="text" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Discover title..." /></div>
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label><input type="text" value={data.subtitle || ""} onChange={(e) => onChange("subtitle", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Discover subtitle..." /></div>
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Description</label><textarea value={data.description || ""} onChange={(e) => onChange("description", e.target.value)} rows={2} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-y transition" placeholder="Discover description..." /></div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3"><label className="text-sm font-medium text-stone-700">Discover Cards</label><button onClick={addCard} className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800 transition"><Plus size={14} /> Add Card</button></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(data.cards || []).map((card, index) => (
            <div key={index} className="relative rounded-xl border-2 border-stone-200 p-4 bg-stone-50 hover:border-emerald-300 transition">
              <button onClick={() => removeCard(index)} className="absolute top-2 right-2 rounded-full bg-rose-100 p-1 text-rose-500 hover:bg-rose-200 transition"><X size={14} /></button>
              <div className="space-y-2">
                <input type="text" value={card.title || ""} onChange={(e) => updateCard(index, "title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Card title" />
                <textarea value={card.description || ""} onChange={(e) => updateCard(index, "description", e.target.value)} rows={2} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-none transition" placeholder="Card description" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={card.link || ""} onChange={(e) => updateCard(index, "link", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="/link" />
                  <input type="text" value={card.button_text || ""} onChange={(e) => updateCard(index, "button_text", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Button text" />
                </div>
                <div className="mt-2">
                  <ImageDropzone
                    label="Card Image"
                    small
                    preview={card.background_image_preview || getImageUrl(card.background_image)}
                    uploading={isUploading(index, "background_image")}
                    height="h-20"
                    onUpload={(file) => onImageUpload(file, index, "background_image")}
                    onRemove={() => updateCard(index, "background_image", null)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOMS SECTION EDITOR ────────────────────────────────────────────────────
function RoomsSectionEditor({ data, onChange, onImageUpload, isUploading }) {
  const addRoom = () => {
    const rooms = [...(data.rooms || [])];
    rooms.push({ name: "", subtitle: "", description: "", guests: 2, view: "", image: null, price: "" });
    onChange("rooms", rooms);
  };

  const removeRoom = (index) => {
    const rooms = [...(data.rooms || [])];
    rooms.splice(index, 1);
    onChange("rooms", rooms);
  };

  const updateRoom = (index, field, value) => {
    const rooms = [...(data.rooms || [])];
    rooms[index] = { ...rooms[index], [field]: value };
    onChange("rooms", rooms);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label><input type="text" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Rooms title..." /></div>
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label><input type="text" value={data.subtitle || ""} onChange={(e) => onChange("subtitle", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Rooms subtitle..." /></div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3"><label className="text-sm font-medium text-stone-700">Rooms</label><button onClick={addRoom} className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800 transition"><Plus size={14} /> Add Room</button></div>
        <div className="space-y-4">
          {(data.rooms || []).map((room, index) => (
            <div key={index} className="relative rounded-xl border-2 border-stone-200 p-4 bg-stone-50 hover:border-emerald-300 transition">
              <button onClick={() => removeRoom(index)} className="absolute top-2 right-2 rounded-full bg-rose-100 p-1 text-rose-500 hover:bg-rose-200 transition"><X size={14} /></button>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={room.name || ""} onChange={(e) => updateRoom(index, "name", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Room name" />
                    <input type="text" value={room.subtitle || ""} onChange={(e) => updateRoom(index, "subtitle", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Subtitle" />
                  </div>
                  <textarea value={room.description || ""} onChange={(e) => updateRoom(index, "description", e.target.value)} rows={2} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-none transition" placeholder="Description" />
                  <div className="grid grid-cols-3 gap-3">
                    <input type="number" value={room.guests || ""} onChange={(e) => updateRoom(index, "guests", parseInt(e.target.value))} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Guests" />
                    <input type="text" value={room.view || ""} onChange={(e) => updateRoom(index, "view", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="View" />
                    <input type="text" value={room.price || ""} onChange={(e) => updateRoom(index, "price", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="$120/night" />
                  </div>
                </div>
                <ImageDropzone
                  label="Room Image"
                  small
                  preview={room.image_preview || getImageUrl(room.image)}
                  uploading={isUploading(index, "image")}
                  height="h-32"
                  onUpload={(file) => onImageUpload(file, index, "image")}
                  onRemove={() => updateRoom(index, "image", null)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SERVICES SECTION EDITOR ─────────────────────────────────────────────────
function ServicesSectionEditor({ data, onChange, onImageUpload, isUploading }) {
  const addService = () => {
    const services = [...(data.services || [])];
    services.push({ title: "", description: "", icon: "🍽️", background_image: null, timing: "" });
    onChange("services", services);
  };

  const removeService = (index) => {
    const services = [...(data.services || [])];
    services.splice(index, 1);
    onChange("services", services);
  };

  const updateService = (index, field, value) => {
    const services = [...(data.services || [])];
    services[index] = { ...services[index], [field]: value };
    onChange("services", services);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label><input type="text" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Services title..." /></div>
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label><input type="text" value={data.subtitle || ""} onChange={(e) => onChange("subtitle", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Services subtitle..." /></div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3"><label className="text-sm font-medium text-stone-700">Services</label><button onClick={addService} className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800 transition"><Plus size={14} /> Add Service</button></div>
        <div className="space-y-4">
          {(data.services || []).map((service, index) => (
            <div key={index} className="relative rounded-xl border-2 border-stone-200 p-4 bg-stone-50 hover:border-emerald-300 transition">
              <button onClick={() => removeService(index)} className="absolute top-2 right-2 rounded-full bg-rose-100 p-1 text-rose-500 hover:bg-rose-200 transition"><X size={14} /></button>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={service.title || ""} onChange={(e) => updateService(index, "title", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Service title" />
                    <input type="text" value={service.icon || ""} onChange={(e) => updateService(index, "icon", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Icon (emoji)" />
                  </div>
                  <textarea value={service.description || ""} onChange={(e) => updateService(index, "description", e.target.value)} rows={2} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-none transition" placeholder="Description" />
                  <input type="text" value={service.timing || ""} onChange={(e) => updateService(index, "timing", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Daily - Breakfast, Lunch & Dinner" />
                </div>
                <ImageDropzone
                  label="Service Image"
                  small
                  preview={service.background_image_preview || getImageUrl(service.background_image)}
                  uploading={isUploading(index, "background_image")}
                  height="h-32"
                  onUpload={(file) => onImageUpload(file, index, "background_image")}
                  onRemove={() => updateService(index, "background_image", null)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TESTIMONIALS SECTION EDITOR ────────────────────────────────────────────
function TestimonialsSectionEditor({ data, onChange, onImageUpload, isUploading }) {
  const addTestimonial = () => {
    const testimonials = [...(data.testimonials || [])];
    testimonials.push({ name: "", location: "", comment: "", rating: 5, avatar_image: null });
    onChange("testimonials", testimonials);
  };

  const removeTestimonial = (index) => {
    const testimonials = [...(data.testimonials || [])];
    testimonials.splice(index, 1);
    onChange("testimonials", testimonials);
  };

  const updateTestimonial = (index, field, value) => {
    const testimonials = [...(data.testimonials || [])];
    testimonials[index] = { ...testimonials[index], [field]: value };
    onChange("testimonials", testimonials);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label><input type="text" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Testimonials title..." /></div>
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label><input type="text" value={data.subtitle || ""} onChange={(e) => onChange("subtitle", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Testimonials subtitle..." /></div>
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Description</label><textarea value={data.description || ""} onChange={(e) => onChange("description", e.target.value)} rows={2} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-y transition" placeholder="Description..." /></div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3"><label className="text-sm font-medium text-stone-700">Testimonials</label><button onClick={addTestimonial} className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800 transition"><Plus size={14} /> Add Testimonial</button></div>
        <div className="space-y-4">
          {(data.testimonials || []).map((testimonial, index) => (
            <div key={index} className="relative rounded-xl border-2 border-stone-200 p-4 bg-stone-50 hover:border-emerald-300 transition">
              <button onClick={() => removeTestimonial(index)} className="absolute top-2 right-2 rounded-full bg-rose-100 p-1 text-rose-500 hover:bg-rose-200 transition"><X size={14} /></button>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={testimonial.name || ""} onChange={(e) => updateTestimonial(index, "name", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Name" />
                    <input type="text" value={testimonial.location || ""} onChange={(e) => updateTestimonial(index, "location", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Location" />
                  </div>
                  <textarea value={testimonial.comment || ""} onChange={(e) => updateTestimonial(index, "comment", e.target.value)} rows={2} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-none transition" placeholder="Comment" />
                  <input type="number" value={testimonial.rating || 5} onChange={(e) => updateTestimonial(index, "rating", parseInt(e.target.value))} className="w-20 rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Rating" min="1" max="5" />
                </div>
                <ImageDropzone
                  label="Avatar Image"
                  small
                  preview={testimonial.avatar_image_preview || getImageUrl(testimonial.avatar_image)}
                  uploading={isUploading(index, "avatar_image")}
                  height="h-32"
                  onUpload={(file) => onImageUpload(file, index, "avatar_image")}
                  onRemove={() => updateTestimonial(index, "avatar_image", null)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BOOKING SECTION EDITOR ──────────────────────────────────────────────────
function BookingSectionEditor({ data, onChange, onImageUpload, onRemoveImage, isUploading }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label><input type="text" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Booking title..." /></div>
          <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label><input type="text" value={data.subtitle || ""} onChange={(e) => onChange("subtitle", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Booking subtitle..." /></div>
          <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Description</label><textarea value={data.description || ""} onChange={(e) => onChange("description", e.target.value)} rows={2} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-y transition" placeholder="Booking description..." /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Button Text</label><input type="text" value={data.button_text || ""} onChange={(e) => onChange("button_text", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Book Your Stay" /></div>
            <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Secondary Button</label><input type="text" value={data.button_secondary_text || ""} onChange={(e) => onChange("button_secondary_text", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="View Services" /></div>
          </div>
        </div>
        <ImageDropzone
          label="Background Image"
          preview={data.background_image_preview || getImageUrl(data.background_image)}
          uploading={isUploading(undefined, "background_image")}
          height="h-48"
          onUpload={(file) => onImageUpload(file, undefined, "background_image")}
          onRemove={() => onRemoveImage(undefined, "background_image")}
        />
      </div>
    </div>
  );
}

// ─── Section Editors Map ─────────────────────────────────────────────────────
const sectionEditors = {
  hero: HeroSectionEditor,
  welcome: WelcomeSectionEditor,
  discover: DiscoverSectionEditor,
  rooms: RoomsSectionEditor,
  services: ServicesSectionEditor,
  testimonials: TestimonialsSectionEditor,
  booking: BookingSectionEditor,
};

const sectionMeta = {
  hero: { label: "Hero", blurb: "The first thing a guest sees", icon: Sun },
  welcome: { label: "Welcome", blurb: "Introduce the lodge", icon: DoorOpen },
  discover: { label: "Discover", blurb: "What there is to explore", icon: Compass },
  rooms: { label: "Rooms", blurb: "Where guests will stay", icon: BedDouble },
  services: { label: "Services", blurb: "What's included in the stay", icon: Bell },
  testimonials: { label: "Guest Stories", blurb: "What past guests said", icon: Quote },
  booking: { label: "Booking", blurb: "The final call to action", icon: CalendarCheck },
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function HomeSectionManager() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [uploading, setUploading] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchHomepage();
  }, []);

  const fetchHomepage = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const headers = { Accept: "application/json", ...(token && { Authorization: `Bearer ${token}` }) };
      const res = await fetch(`${API_URL}/homepage`, { headers });
      const result = await res.json();

      if (result.success && result.data) {
        setPageData(result.data);
        const sections = Object.keys(result.data.content || {});
        if (sections.length > 0) {
          setExpandedSections({ [sections[0]]: true });
        }
      } else {
        setPageData({
          id: null,
          slug: "home",
          name: "Akagera Park Inn - Home",
          content: DEFAULT_HOMEPAGE_CONTENT,
          seo: {
            title: "Akagera Park Inn - Near Akagera National Park",
            description: "Experience local culture, heritage, and unforgettable moments.",
            keywords: "Akagera Park Inn, Akagera National Park, Rwanda",
          },
          is_active: true,
        });
        setExpandedSections({ hero: true });
      }
    } catch (err) {
      console.error("Error fetching homepage:", err);
      setError("Failed to load homepage data");
    } finally {
      setLoading(false);
    }
  };

  const updateSection = (sectionName, field, value) => {
    setPageData((prev) => {
      const newContent = { ...prev.content };
      newContent[sectionName] = { ...newContent[sectionName], [field]: value };
      return { ...prev, content: newContent };
    });
    setHasChanges(true);
    setSaved(false);
    setError(null);
  };

  const arrayKeyForField = (field) => {
    if (field === "background_image") return "cards";
    if (field === "image") return "rooms";
    if (field === "avatar_image") return "testimonials";
    return "cards";
  };

  const handleImageUpload = (sectionName, file, index, field = "background_image") => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image (JPEG, PNG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    const key = `${sectionName}_${index}_${field}`;
    setUploading((prev) => ({ ...prev, [key]: true }));
    const previewUrl = URL.createObjectURL(file);

    setPageData((prev) => {
      const newContent = { ...prev.content };
      const section = { ...newContent[sectionName] };

      if (index !== undefined) {
        const itemsKey = section.services !== undefined && field === "background_image"
          ? "services"
          : arrayKeyForField(field);
        const items = [...(section[itemsKey] || [])];
        const item = { ...items[index] };
        item[field] = file;
        item[field + "_preview"] = previewUrl;
        items[index] = item;
        section[itemsKey] = items;
      } else {
        section[field] = file;
        section[field + "_preview"] = previewUrl;
      }

      newContent[sectionName] = section;
      return { ...prev, content: newContent };
    });
    setHasChanges(true);
    setSaved(false);
    setUploading((prev) => ({ ...prev, [key]: false }));
  };

  const removeImage = (sectionName, index, field = "background_image") => {
    setPageData((prev) => {
      const newContent = { ...prev.content };
      const section = { ...newContent[sectionName] };

      if (index !== undefined) {
        const itemsKey = section.services !== undefined && field === "background_image"
          ? "services"
          : arrayKeyForField(field);
        const items = [...(section[itemsKey] || [])];
        if (items[index] && items[index][field + "_preview"]?.startsWith("blob:")) {
          URL.revokeObjectURL(items[index][field + "_preview"]);
        }
        items[index] = { ...items[index], [field]: null, [field + "_preview"]: null };
        section[itemsKey] = items;
      } else {
        if (section[field + "_preview"]?.startsWith("blob:")) {
          URL.revokeObjectURL(section[field + "_preview"]);
        }
        section[field] = null;
        section[field + "_preview"] = null;
      }

      newContent[sectionName] = section;
      return { ...prev, content: newContent };
    });
    setHasChanges(true);
  };

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const openPreview = () => {
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  const saveToBackend = async () => {
    setSaving(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Please login first");
      }

      const formData = new FormData();
      formData.append("slug", pageData.slug);
      formData.append("name", pageData.name);
      formData.append("is_active", "1");
      formData.append("seo", JSON.stringify(pageData.seo || {}));

      const cleanContent = {};
      for (const [sectionName, sectionData] of Object.entries(pageData.content)) {
        cleanContent[sectionName] = stripFilesForSubmit(sectionData, formData, [sectionName]);
      }
      formData.append("content", JSON.stringify(cleanContent));

      const isUpdate = Boolean(pageData.id);
      if (isUpdate) {
        formData.append("_method", "PUT");
      }

      const url = isUpdate ? `${API_URL}/admin/pages/${pageData.id}` : `${API_URL}/admin/pages`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await fetchHomepage();
      } else if (result.errors) {
        const errorMessages = Object.values(result.errors).flat().join(", ");
        setError(`Validation Error: ${errorMessages}`);
      } else {
        setError(result.message || "Error saving homepage");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save homepage");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchHomepage();
    setHasChanges(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="text-center py-24">
        <p className="text-stone-500">No homepage data found</p>
        <button onClick={fetchHomepage} className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800 transition">
          Retry
        </button>
      </div>
    );
  }

  const sections = Object.keys(pageData.content || {});

  return (
    <div className="min-h-screen bg-stone-100 pb-16">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');`}</style>

      {/* Header */}
      <div className="sticky top-0 z-20 bg-emerald-950 text-stone-50 shadow-lg shadow-emerald-950/10 rounded-b-3xl border-b-4 border-amber-400">
        <div className="mx-auto max-w-5xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Akagera Park Inn</p>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-semibold text-white">
              Home Page Journey
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {saved && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-800/60 px-3 py-1.5 text-sm font-medium text-emerald-100">
                <Check size={15} /> Saved
              </span>
            )}
            <button onClick={handleReset} className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-700/60 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-900 transition">
              <RotateCcw size={15} /> Reset
            </button>
            <button
              onClick={saveToBackend}
              disabled={!hasChanges || saving}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                hasChanges && !saving
                  ? "bg-amber-500 text-emerald-950 hover:bg-amber-400"
                  : "cursor-not-allowed bg-emerald-900 text-emerald-400/60"
              }`}
            >
              {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-950 border-t-transparent" /> : <Save size={15} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={openPreview}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition bg-emerald-700 text-white hover:bg-emerald-800"
            >
              <Eye size={15} />
              View Preview
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pt-6 space-y-6">
        {error && (
          <div className="rounded-xl border-2 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Sections */}
        <div className="relative pl-14">
          <div className="absolute left-[27px] top-3 bottom-3 w-px bg-emerald-200" aria-hidden="true" />
          <div className="space-y-4">
            {sections.map((sectionName, idx) => {
              const isExpanded = expandedSections[sectionName] || false;
              const sectionData = pageData.content[sectionName];
              const EditorComponent = sectionEditors[sectionName];
              const meta = sectionMeta[sectionName] || { label: sectionName, blurb: "", icon: Compass };
              const Icon = meta.icon;

              if (!EditorComponent || !sectionData) return null;

              return (
                <div key={sectionName} className="relative">
                  <div
                    className={`absolute -left-14 top-4 flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                      isExpanded ? "border-amber-500 bg-amber-50 text-amber-600" : "border-emerald-200 bg-white text-emerald-700"
                    }`}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition">
                    <button onClick={() => toggleSection(sectionName)} className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-stone-400">{String(idx + 1).padStart(2, "0")}</span>
                        <div>
                          <p style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="font-semibold text-stone-800">
                            {meta.label}
                          </p>
                          <p className="text-xs text-stone-400">{meta.blurb}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-stone-400">
                        {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-stone-100 p-6">
                        <EditorComponent
                          data={sectionData}
                          onChange={(field, value) => updateSection(sectionName, field, value)}
                          onImageUpload={(file, index, field) => handleImageUpload(sectionName, file, index, field)}
                          onRemoveImage={(index, field) => removeImage(sectionName, index, field)}
                          isUploading={(index, field) => Boolean(uploading[`${sectionName}_${index}_${field}`])}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertCircle size={16} className="text-amber-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">Tips</p>
              <ul className="mt-1 space-y-1 text-xs text-amber-700">
                <li>• Expand a waypoint to edit just that section</li>
                <li>• Uploaded images preview instantly</li>
                <li>• Removing an image deletes the old file from storage</li>
                <li>• Replacing an image automatically deletes the old one</li>
                <li>• Click "View Preview" to see how your page looks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal data={pageData.content} onClose={closePreview} />
      )}
    </div>
  );
}