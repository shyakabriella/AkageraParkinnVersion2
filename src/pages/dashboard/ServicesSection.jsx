// src/pages/dashboard/ServicesSection.jsx
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
  Utensils,
  Coffee,
  Waves,
  Sparkles,
  Wifi,
  Eye,
  Users,
  Clock,
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

const IMAGE_KEYS = new Set(["background_image", "image", "avatar_image"]);

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

const DEFAULT_SERVICES_CONTENT = {
  hero: {
    title: "Services",
    subtitle: "Restaurant, pool, laundry and more.",
    description: "Book any service with or without a room — restaurant, bar, laundry, and airport shuttle. Combine services however suits your trip.",
    background_image: "/images/services/hero-bg.jpg",
  },
  services: {
    title: "More to do",
    items: [
      {
        title: "Outdoor Pool & Garden",
        subtitle: "All day · Year round",
        description: "Unwind in our outdoor swimming pool with a comfortable poolside sitting area, surrounded by gardens and mountain views.",
        background_image: "/images/services/pool.jpg",
        link: "/services/pool",
        duration: "All day",
        when: "Year round",
        level: "All experiences",
        what_is_included: "Pool access, Garden & terrace, Poolside seating, Free for hotel guests",
        book_button_text: "Book This Experience",
        book_button_link: "/booking",
      },
      {
        title: "Restaurant & Lounge",
        subtitle: "Daily · Breakfast, lunch & dinner",
        description: "African, American, and Argentinian cuisine in a relaxed lounge setting — vegetarian, dairy-free, and halal options available.",
        background_image: "/images/services/restaurant.jpg",
        link: "/services/restaurant",
        duration: "Daily",
        when: "Breakfast, lunch & dinner",
        level: "All experiences",
        what_is_included: "Full breakfast with rooms, Vegetarian options, Halal options, Room service, Bar service",
        book_button_text: "Book This Experience",
        book_button_link: "/booking",
      },
      {
        title: "Laundry Service",
        subtitle: "Same day · Daily",
        description: "Fresh clothes when you need them — our laundry service keeps you comfortable throughout your stay.",
        background_image: "/images/services/laundry.jpg",
        link: "/services/laundry",
        duration: "Same day",
        when: "Daily",
        level: "All experiences",
        what_is_included: "Laundry & dry cleaning, Room service pickup, Book without a room",
        book_button_text: "Book This Experience",
        book_button_link: "/booking",
      },
      {
        title: "Bar & Drinks",
        subtitle: "Evenings · Daily",
        description: "Poolside bar and lounge drinks — unwind with a cold drink after a day in the park.",
        background_image: "/images/services/bar.jpg",
        link: "/services/bar",
        duration: "Evenings",
        when: "Daily",
        level: "All experiences",
        what_is_included: "Poolside bar, Lounge service, Book without a room",
        book_button_text: "Book This Experience",
        book_button_link: "/booking",
      },
    ],
  },
};

function ImageDropzone({ label, preview, uploading, height, onUpload, onRemove, compact, small }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-stone-700">{label}</label>
      <div className={`rounded-2xl border-4 border-dashed border-stone-300 bg-white ${small ? "p-2" : "p-4"} hover:border-emerald-500 transition`}>
        {preview ? (
          <div className="relative group">
            <img src={preview} alt={label} className={`${height} w-full rounded-xl object-cover`} onError={(e) => { e.target.src = "https://placehold.co/800x400?text=Image+Not+Found"; }} />
            <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 rounded-xl transition flex items-center justify-center gap-2">
              <button onClick={onRemove} className="rounded-full bg-rose-500 p-2 text-white hover:bg-rose-600 transition"><Trash2 size={compact ? 14 : 16} /></button>
              <label className="cursor-pointer">
                <div className="rounded-full bg-emerald-600 p-2 text-white hover:bg-emerald-700 transition"><Upload size={compact ? 14 : 16} /></div>
                <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer block">
            <div className={`flex flex-col items-center justify-center ${height} rounded-xl border-4 border-dashed border-stone-300 hover:border-emerald-500 transition`}>
              {uploading ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" /> : <><Upload size={compact ? 20 : 28} className="text-stone-400" /><p className="mt-2 text-xs text-stone-500">Click to upload</p></>}
            </div>
            <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
}

// ─── SERVICES PREVIEW ──────────────────────────────────────────────────────────
function ServicesPreview({ data, onClose }) {
  const content = data || {};
  const services = content.services?.items || [];

  return (
    <div className="fixed inset-0 z-50 bg-stone-50 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-semibold text-stone-700">Services Page Preview</span>
            <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">Website View</span>
          </div>
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition text-sm font-medium">
            <X className="h-4 w-4" />
            Close Preview
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          {content.hero?.background_image ? (
            <img src={getImageUrl(content.hero.background_image)} alt="Hero" className="w-full h-[350px] object-cover" />
          ) : (
            <div className="w-full h-[350px] bg-gradient-to-r from-emerald-800 to-emerald-600" />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold">{content.hero?.title || "Services"}</h1>
            <p className="mt-2 text-lg text-white/80">{content.hero?.subtitle || ""}</p>
            <p className="mt-3 text-sm text-white/70 max-w-2xl">{content.hero?.description || ""}</p>
          </div>
        </div>

        {/* Services Grid */}
        {services && services.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-stone-800 text-center">{content.services?.title || "More to do"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {services.map((service, index) => {
                const img = getImageUrl(service.background_image);
                return (
                  <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition">
                    {img ? (
                      <img src={img} alt={service.title} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-stone-200 flex items-center justify-center">
                        <Utensils className="h-12 w-12 text-stone-300" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-stone-800">{service.title}</h3>
                      <p className="text-emerald-600 font-medium text-sm">{service.subtitle}</p>
                      <p className="text-stone-600 mt-2 text-sm">{service.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-stone-500">
                        <span><Clock className="inline h-4 w-4 mr-1" /> {service.duration}</span>
                        <span><CalendarCheck className="inline h-4 w-4 mr-1" /> {service.when}</span>
                      </div>
                      <button className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition text-sm">
                        {service.book_button_text || "Book This Experience"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500">No services added yet.</p>
            <p className="text-sm text-stone-400">Add services in the editor to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HERO EDITOR ─────────────────────────────────────────────────────────────
function HeroEditor({ data, onChange, onImageUpload, onRemoveImage, isUploading }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label><input type="text" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Title..." /></div>
          <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label><input type="text" value={data.subtitle || ""} onChange={(e) => onChange("subtitle", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Subtitle..." /></div>
          <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Description</label><textarea value={data.description || ""} onChange={(e) => onChange("description", e.target.value)} rows={3} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-y transition" placeholder="Description..." /></div>
        </div>
        <ImageDropzone label="Background Image" preview={data.background_image_preview || getImageUrl(data.background_image)} uploading={isUploading(undefined, "background_image")} height="h-48" onUpload={(file) => onImageUpload(file)} onRemove={onRemoveImage} />
      </div>
    </div>
  );
}

// ─── SERVICES LIST EDITOR ──────────────────────────────────────────────────────
function ServicesListEditor({ data, onChange, onImageUpload, isUploading }) {
  const addService = () => {
    const items = [...(data.items || [])];
    items.push({
      title: "",
      subtitle: "",
      description: "",
      background_image: null,
      link: "",
      duration: "",
      when: "",
      level: "All experiences",
      what_is_included: "",
      book_button_text: "Book This Experience",
      book_button_link: "/booking",
    });
    onChange("items", items);
  };

  const removeService = (index) => {
    const items = [...(data.items || [])];
    items.splice(index, 1);
    onChange("items", items);
  };

  const updateService = (index, field, value) => {
    const items = [...(data.items || [])];
    items[index] = { ...items[index], [field]: value };
    onChange("items", items);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label><input type="text" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Section title..." /></div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-stone-700">Services</label>
          <button onClick={addService} className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800 transition"><Plus size={14} /> Add Service</button>
        </div>
        <div className="space-y-6">
          {(data.items || []).map((service, index) => (
            <div key={index} className="relative rounded-xl border-2 border-stone-200 p-4 bg-stone-50 hover:border-emerald-300 transition">
              <button onClick={() => removeService(index)} className="absolute top-2 right-2 rounded-full bg-rose-100 p-1 text-rose-500 hover:bg-rose-200 transition"><X size={14} /></button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <input type="text" value={service.title || ""} onChange={(e) => updateService(index, "title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Service title" />
                  <input type="text" value={service.subtitle || ""} onChange={(e) => updateService(index, "subtitle", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Subtitle (e.g., All day · Year round)" />
                  <textarea value={service.description || ""} onChange={(e) => updateService(index, "description", e.target.value)} rows={2} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-none transition" placeholder="Description" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={service.duration || ""} onChange={(e) => updateService(index, "duration", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Duration" />
                    <input type="text" value={service.when || ""} onChange={(e) => updateService(index, "when", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="When" />
                  </div>
                  <input type="text" value={service.level || ""} onChange={(e) => updateService(index, "level", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Level (e.g., All experiences)" />
                  <textarea value={service.what_is_included || ""} onChange={(e) => updateService(index, "what_is_included", e.target.value)} rows={2} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-none transition" placeholder="What is included (comma separated)" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={service.book_button_text || ""} onChange={(e) => updateService(index, "book_button_text", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Button text" />
                    <input type="text" value={service.book_button_link || ""} onChange={(e) => updateService(index, "book_button_link", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="/booking" />
                  </div>
                </div>
                <div className="space-y-3">
                  <ImageDropzone label="Service Image" small preview={service.background_image_preview || getImageUrl(service.background_image)} uploading={isUploading(index, "background_image")} height="h-32" onUpload={(file) => onImageUpload(file, index, "background_image")} onRemove={() => updateService(index, "background_image", null)} />
                  <input type="text" value={service.link || ""} onChange={(e) => updateService(index, "link", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="/link" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {(!data.items || data.items.length === 0) && <p className="text-sm text-stone-400 text-center py-3">No services added. Click "Add Service" to create one.</p>}
      </div>
    </div>
  );
}

const sectionEditors = {
  hero: HeroEditor,
  services: ServicesListEditor,
};

const sectionMeta = {
  hero: { label: "Hero", blurb: "Page header", icon: Sun },
  services: { label: "Services List", blurb: "Service listings", icon: Sparkles },
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function ServicesSectionManager() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [uploading, setUploading] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => { fetchServicesPage(); }, []);

  const fetchServicesPage = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const headers = { Accept: "application/json", ...(token && { Authorization: `Bearer ${token}` }) };
      const res = await fetch(`${API_URL}/services`, { headers });
      const result = await res.json();
      
      if (result.success && result.data) {
        setPageData(result.data);
        const sections = Object.keys(result.data.content || {});
        if (sections.length > 0) setExpandedSections({ [sections[0]]: true });
      } else {
        setPageData({ 
          id: null, 
          slug: "services", 
          name: "Services", 
          content: DEFAULT_SERVICES_CONTENT, 
          seo: { title: "Services - Akagera Park Inn", description: "Restaurant, pool, laundry and more.", keywords: "Services, Akagera Park Inn" }, 
          is_active: true 
        });
        setExpandedSections({ hero: true });
      }
    } catch (err) { 
      console.error(err); 
      setError("Failed to load services page data"); 
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

  const handleImageUpload = (sectionName, file, index, field = "background_image") => {
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) { setError("Please select a valid image (JPEG, PNG, WebP)"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image size must be less than 5MB"); return; }

    const key = `${sectionName}_${index}_${field}`;
    setUploading((prev) => ({ ...prev, [key]: true }));
    const previewUrl = URL.createObjectURL(file);
    setPageData((prev) => {
      const newContent = { ...prev.content };
      const section = { ...newContent[sectionName] };
      if (index !== undefined) {
        const itemsKey = "items";
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
        const itemsKey = "items";
        const items = [...(section[itemsKey] || [])];
        if (items[index] && items[index][field + "_preview"]?.startsWith("blob:")) URL.revokeObjectURL(items[index][field + "_preview"]);
        items[index] = { ...items[index], [field]: null, [field + "_preview"]: null };
        section[itemsKey] = items;
      } else {
        if (section[field + "_preview"]?.startsWith("blob:")) URL.revokeObjectURL(section[field + "_preview"]);
        section[field] = null;
        section[field + "_preview"] = null;
      }
      newContent[sectionName] = section;
      return { ...prev, content: newContent };
    });
    setHasChanges(true);
  };

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({ ...prev, [sectionName]: !prev[sectionName] }));
  };

  const openPreview = () => setShowPreview(true);
  const closePreview = () => setShowPreview(false);

  const saveToBackend = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("Please login first");
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
      if (isUpdate) formData.append("_method", "PUT");
      const url = isUpdate ? `${API_URL}/admin/services/pages/${pageData.id}` : `${API_URL}/admin/services/pages`;
      const response = await fetch(url, { 
        method: "POST", 
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: "application/json" 
        }, 
        body: formData 
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await fetchServicesPage();
      } else if (result.errors) {
        setError(`Validation Error: ${Object.values(result.errors).flat().join(", ")}`);
      } else {
        setError(result.message || "Error saving services page");
      }
    } catch (err) { 
      console.error(err); 
      setError(err.message || "Failed to save services page"); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleReset = () => { 
    fetchServicesPage(); 
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
        <p className="text-stone-500">No services page data found</p>
        <button onClick={fetchServicesPage} className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800 transition">
          Retry
        </button>
      </div>
    );
  }

  const sections = Object.keys(pageData.content || {});

  return (
    <div className="min-h-screen bg-stone-100 pb-16">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');`}</style>
      
      <div className="sticky top-0 z-20 bg-emerald-950 text-stone-50 shadow-lg shadow-emerald-950/10 rounded-b-3xl border-b-4 border-amber-400">
        <div className="mx-auto max-w-5xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Akagera Park Inn</p>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-semibold text-white">
              Services Page Manager
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

        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertCircle size={16} className="text-amber-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">Tips</p>
              <ul className="mt-1 space-y-1 text-xs text-amber-700">
                <li>• Expand a waypoint to edit just that section</li>
                <li>• Uploaded images preview instantly</li>
                <li>• Click "View Preview" to see how your page looks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showPreview && <ServicesPreview data={pageData.content} onClose={closePreview} />}
    </div>
  );
}