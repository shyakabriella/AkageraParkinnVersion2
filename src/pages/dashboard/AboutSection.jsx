// src/pages/dashboard/AboutSection.jsx
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
  Hotel,
  MapPin,
  Wifi,
  Bell,
  Sparkles,
  Eye,
  CalendarCheck,
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

// Image keys
const IMAGE_KEYS = new Set(["background_image", "image", "avatar_image"]);

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

// ─── DEFAULT ABOUT CONTENT ─────────────────────────────────────────────────
const DEFAULT_ABOUT_CONTENT = {
  hero: {
    title: "About Us",
    subtitle: "Experience local culture, heritage, and unforgettable moments.",
    description: "A peaceful hotel in Akagera Village, minutes from Akagera National Park. Calm stays with an outdoor pool, garden, restaurant & lounge, and warm Rwandan hospitality.",
    background_image: "/images/about/hero-bg.jpg",
  },
  hotel: {
    title: "Our Hotel",
    subtitle: "A peaceful hotel minutes from Akagera National Park.",
    description:
      "Akagera Park Inn is located at 3MGF+4HF Akagera Village, Akagera, Rwanda, in the heart of Akagera Village. We are a short drive from the Akagera National Park South Entrance — making us an ideal base for safari days and restful evenings alike.\n\nOur 12 rooms feature handcrafted wooden furniture, private balconies, air conditioning, smart TVs, and complimentary high-speed Wi-Fi. Every room booking includes a full breakfast for registered guests.\n\nBeyond accommodation, we offer a restaurant & lounge, bar, outdoor pool, and laundry service — all bookable with or without a room. Check-in and check-out are from 11:00 to 11:00, with 24-hour reception.",
    image: "/images/about/hotel-image.jpg",
  },
  location: {
    title: "Location",
    subtitle: "Close to the park. Easy from Kigali.",
    cards: [
      {
        title: "Park entrance",
        description: "2–3 km to Akagera National Park South Entrance",
      },
      {
        title: "From Kigali",
        description: "Approx. 2.5 hours from Kigali",
      },
      {
        title: "Airport",
        description: "79 km from Kigali International Airport (KGL)",
      },
    ],
  },
  amenities: {
    title: "Amenities & Services",
    subtitle: "Everything you need for a comfortable stay.",
    services: [
      {
        title: "Restaurant & Lounge",
        description:
          "African, American, and Argentinian cuisine with vegetarian, dairy-free, and halal options. Full breakfast included with every room.",
        icon: "🍽️",
      },
      {
        title: "Outdoor Pool & Garden",
        description:
          "Unwind in our outdoor swimming pool with a comfortable poolside sitting area, surrounded by gardens and mountain views.",
        icon: "🏊",
      },
      {
        title: "Free Wi-Fi & Parking",
        description:
          "Complimentary high-speed Wi-Fi throughout the hotel and free self parking for all guests.",
        icon: "📶",
      },
      {
        title: "Airport Shuttle",
        description:
          "Arrange a paid 24-hour airport shuttle from Kigali International Airport.",
        icon: "🚐",
      },
      {
        title: "24-Hour Reception",
        description:
          "Our team is available around the clock for check-in, room service, laundry, and any questions during your stay.",
        icon: "🕐",
      },
      {
        title: "Book Services Flexibly",
        description:
          "Reserve restaurant, bar, or laundry on their own — no room booking required.",
        icon: "🛎️",
      },
    ],
  },
  banner: {
    title: "Ready to book your stay at Akagera Park Inn?",
    button_text: "Book Your Stay",
    button_link: "/booking",
    background_image: "/images/about/banner-bg.jpg",
  },
};

// ─── IMAGE DROPZONE ──────────────────────────────────────────────────────────
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

// ─── PREVIEW MODAL ──────────────────────────────────────────────────────────
function AboutPreview({ data, onClose }) {
  const content = data || {};

  return (
    <div className="fixed inset-0 z-50 bg-stone-50 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-semibold text-stone-700">About Page Preview</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HERO */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          {content.hero?.background_image ? (
            <img src={getImageUrl(content.hero.background_image)} alt="Hero" className="w-full h-[350px] object-cover" />
          ) : (
            <div className="w-full h-[350px] bg-gradient-to-r from-emerald-800 to-emerald-600" />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold">{content.hero?.title || "About Us"}</h1>
            <p className="mt-2 text-lg text-white/80">{content.hero?.subtitle || ""}</p>
            <p className="mt-3 text-sm text-white/70 max-w-2xl">{content.hero?.description || ""}</p>
          </div>
        </div>

        {/* HOTEL */}
        {content.hotel && (
          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-stone-800">{content.hotel.title || "Our Hotel"}</h2>
                <p className="text-emerald-600 font-medium mt-1">{content.hotel.subtitle}</p>
                <p className="text-stone-600 mt-4 leading-relaxed whitespace-pre-line">{content.hotel.description}</p>
              </div>
              <div>
                {content.hotel.image ? (
                  <img src={getImageUrl(content.hotel.image)} alt="Hotel" className="rounded-2xl w-full h-80 object-cover shadow-lg" />
                ) : (
                  <div className="w-full h-80 bg-stone-200 rounded-2xl flex items-center justify-center text-stone-400">
                    <Hotel className="h-16 w-16" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LOCATION */}
        {content.location && (
          <div className="mb-12 bg-stone-100 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-stone-800 text-center">{content.location.title || "Location"}</h2>
            <p className="text-center text-stone-500 mt-1">{content.location.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {(content.location.cards || []).map((card, i) => (
                <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm border border-stone-100">
                  <h3 className="font-semibold text-stone-800">{card.title}</h3>
                  <p className="text-sm text-stone-500 mt-1">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AMENITIES */}
        {content.amenities && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-stone-800 text-center">{content.amenities.title || "Amenities & Services"}</h2>
            <p className="text-center text-stone-500 mt-1">{content.amenities.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {(content.amenities.services || []).map((service, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition">
                  <span className="text-3xl">{service.icon || "✨"}</span>
                  <h3 className="font-semibold text-stone-800 mt-2">{service.title}</h3>
                  <p className="text-sm text-stone-500 mt-1">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BANNER */}
        {content.banner && (
          <div className="relative rounded-2xl overflow-hidden">
            {content.banner.background_image ? (
              <img src={getImageUrl(content.banner.background_image)} alt="Banner" className="w-full h-56 object-cover" />
            ) : (
              <div className="w-full h-56 bg-gradient-to-r from-emerald-800 to-emerald-600" />
            )}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
              <h2 className="text-2xl md:text-3xl font-bold">{content.banner.title || "Ready to book?"}</h2>
              <button className="mt-4 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition">
                {content.banner.button_text || "Book Your Stay"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SECTION EDITORS ────────────────────────────────────────────────────────

// HERO EDITOR
function HeroEditor({ data, onChange, onImageUpload, onRemoveImage, isUploading }) {
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
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label>
            <input
              type="text"
              value={data.subtitle || ""}
              onChange={(e) => onChange("subtitle", e.target.value)}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
              placeholder="Hero subtitle..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Description</label>
            <textarea
              value={data.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              rows={4}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-y transition"
              placeholder="Hero description..."
            />
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

// HOTEL EDITOR
function HotelEditor({ data, onChange, onImageUpload, onRemoveImage, isUploading }) {
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
              placeholder="Hotel title..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label>
            <input
              type="text"
              value={data.subtitle || ""}
              onChange={(e) => onChange("subtitle", e.target.value)}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
              placeholder="Hotel subtitle..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Description</label>
            <textarea
              value={data.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              rows={6}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-y transition"
              placeholder="Hotel description..."
            />
          </div>
        </div>
        <ImageDropzone
          label="Hotel Image"
          preview={data.image_preview || getImageUrl(data.image)}
          uploading={isUploading(undefined, "image")}
          height="h-48"
          onUpload={(file) => onImageUpload(file, undefined, "image")}
          onRemove={() => onRemoveImage(undefined, "image")}
        />
      </div>
    </div>
  );
}

// LOCATION EDITOR
function LocationEditor({ data, onChange }) {
  const addCard = () => {
    const cards = [...(data.cards || [])];
    cards.push({ title: "", description: "" });
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
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) => onChange("title", e.target.value)}
            className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
            placeholder="Location title..."
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label>
          <input
            type="text"
            value={data.subtitle || ""}
            onChange={(e) => onChange("subtitle", e.target.value)}
            className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
            placeholder="Location subtitle..."
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-stone-700">Location Cards</label>
          <button onClick={addCard} className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800 transition">
            <Plus size={14} /> Add Card
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(data.cards || []).map((card, index) => (
            <div key={index} className="relative rounded-xl border-2 border-stone-200 p-4 bg-stone-50 hover:border-emerald-300 transition">
              <button onClick={() => removeCard(index)} className="absolute top-2 right-2 rounded-full bg-rose-100 p-1 text-rose-500 hover:bg-rose-200 transition">
                <X size={14} />
              </button>
              <div className="space-y-2">
                <input
                  type="text"
                  value={card.title || ""}
                  onChange={(e) => updateCard(index, "title", e.target.value)}
                  className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
                  placeholder="Card title"
                />
                <textarea
                  value={card.description || ""}
                  onChange={(e) => updateCard(index, "description", e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-none transition"
                  placeholder="Card description"
                />
              </div>
            </div>
          ))}
        </div>
        {(!data.cards || data.cards.length === 0) && (
          <p className="text-sm text-stone-400 text-center py-3">No cards added. Click "Add Card" to create one.</p>
        )}
      </div>
    </div>
  );
}

// AMENITIES EDITOR
function AmenitiesEditor({ data, onChange }) {
  const addService = () => {
    const services = [...(data.services || [])];
    services.push({ title: "", description: "", icon: "✨" });
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
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) => onChange("title", e.target.value)}
            className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
            placeholder="Amenities title..."
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label>
          <input
            type="text"
            value={data.subtitle || ""}
            onChange={(e) => onChange("subtitle", e.target.value)}
            className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
            placeholder="Amenities subtitle..."
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-stone-700">Services</label>
          <button onClick={addService} className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800 transition">
            <Plus size={14} /> Add Service
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(data.services || []).map((service, index) => (
            <div key={index} className="relative rounded-xl border-2 border-stone-200 p-4 bg-stone-50 hover:border-emerald-300 transition">
              <button onClick={() => removeService(index)} className="absolute top-2 right-2 rounded-full bg-rose-100 p-1 text-rose-500 hover:bg-rose-200 transition">
                <X size={14} />
              </button>
              <div className="space-y-2">
                <input
                  type="text"
                  value={service.title || ""}
                  onChange={(e) => updateService(index, "title", e.target.value)}
                  className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
                  placeholder="Service title"
                />
                <textarea
                  value={service.description || ""}
                  onChange={(e) => updateService(index, "description", e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-none transition"
                  placeholder="Service description"
                />
                <input
                  type="text"
                  value={service.icon || ""}
                  onChange={(e) => updateService(index, "icon", e.target.value)}
                  className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
                  placeholder="Icon (emoji)"
                />
              </div>
            </div>
          ))}
        </div>
        {(!data.services || data.services.length === 0) && (
          <p className="text-sm text-stone-400 text-center py-3">No services added. Click "Add Service" to create one.</p>
        )}
      </div>
    </div>
  );
}

// BANNER EDITOR
function BannerEditor({ data, onChange, onImageUpload, onRemoveImage, isUploading }) {
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
              placeholder="Banner title..."
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
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Button Link</label>
              <input
                type="text"
                value={data.button_link || ""}
                onChange={(e) => onChange("button_link", e.target.value)}
                className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
                placeholder="/booking"
              />
            </div>
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

// ─── SECTION EDITORS MAP ─────────────────────────────────────────────────────
const sectionEditors = {
  hero: HeroEditor,
  hotel: HotelEditor,
  location: LocationEditor,
  amenities: AmenitiesEditor,
  banner: BannerEditor,
};

const sectionMeta = {
  hero: { label: "Hero", blurb: "Introduction to the page", icon: Sun },
  hotel: { label: "Our Hotel", blurb: "About the hotel and rooms", icon: Hotel },
  location: { label: "Location", blurb: "Where to find us", icon: MapPin },
  amenities: { label: "Amenities", blurb: "Services & facilities", icon: Wifi },
  banner: { label: "Banner", blurb: "Call to action", icon: Sparkles },
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AboutSectionManager() {
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
    fetchAboutPage();
  }, []);

  const fetchAboutPage = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const headers = { Accept: "application/json", ...(token && { Authorization: `Bearer ${token}` }) };
      const res = await fetch(`${API_URL}/about`, { headers });
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
          slug: "about",
          name: "About Us",
          content: DEFAULT_ABOUT_CONTENT,
          seo: {
            title: "About Us - Akagera Park Inn",
            description: "Experience local culture, heritage, and unforgettable moments at Akagera Park Inn.",
            keywords: "Akagera Park Inn, About Us, Akagera National Park, Rwanda",
          },
          is_active: true,
        });
        setExpandedSections({ hero: true });
      }
    } catch (err) {
      console.error("Error fetching about page:", err);
      setError("Failed to load about page data");
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
    if (field === "image") return "cards";
    if (field === "avatar_image") return "cards";
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

  const openPreview = () => setShowPreview(true);
  const closePreview = () => setShowPreview(false);

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

      const url = isUpdate ? `${API_URL}/admin/about/pages/${pageData.id}` : `${API_URL}/admin/about/pages`;

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
        await fetchAboutPage();
      } else if (result.errors) {
        const errorMessages = Object.values(result.errors).flat().join(", ");
        setError(`Validation Error: ${errorMessages}`);
      } else {
        setError(result.message || "Error saving about page");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save about page");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchAboutPage();
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
        <p className="text-stone-500">No about page data found</p>
        <button onClick={fetchAboutPage} className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800 transition">
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
              About Page Manager
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
                <li>• Click "View Preview" to see how your page looks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && <AboutPreview data={pageData.content} onClose={closePreview} />}
    </div>
  );
}