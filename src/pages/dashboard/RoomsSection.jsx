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
  BedDouble,
  Users,
  Eye,
  Wifi,
  Tv,
  Wind,
  DoorOpen,
  Coffee,
  Utensils,
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

const DEFAULT_ROOMS_CONTENT = {
  hero: {
    title: "Rooms",
    subtitle: "Comfortable rooms with breakfast included, minutes from the park.",
    description: "Twin and double rooms. Each includes a full breakfast, free Wi-Fi, air conditioning, and a private balcony with garden or courtyard views.",
    background_image: "/images/rooms/hero-bg.jpg",
  },
  rooms: {
    title: "Our Rooms",
    subtitle: "Choose your perfect stay",
    rooms: [
      {
        name: "Twin Room",
        subtitle: "Buffalo & Elephant Room · Garden view",
        description: "Spacious, elegant, and inspired by the gentle giants of Akagera, our Buffalo & Elephant Room offers a calming retreat after a day of adventure.",
        image: "/images/rooms/twin-room.jpg",
        guests: 4,
        view: "Garden",
        amenities: ["Free Wi-Fi", "Smart TV", "Air Conditioning", "Private Balcony", "Mini Fridge", "Mountain View", "Room Service", "Breakfast included"],
        price: "$120/night",
        button_text: "Reserve a room",
        button_link: "/booking",
      },
      {
        name: "Double Room",
        subtitle: "Courtyard view · Handcrafted comfort",
        description: "Enjoy spacious comfort in our 20 m² Double Room, located just minutes from Akagera National Park.",
        image: "/images/rooms/double-room.jpg",
        guests: 8,
        view: "Courtyard",
        amenities: ["Free Wi-Fi", "Smart TV", "Air Conditioning", "Private Balcony", "Work Desk", "Room Service", "Mountain View", "Breakfast included"],
        price: "$150/night",
        button_text: "Reserve a room",
        button_link: "/booking",
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

// ─── ROOMS PREVIEW ──────────────────────────────────────────────────────────
function RoomsPreview({ data, onClose }) {
  const content = data || {};
  
  // Get rooms from the correct path: content.rooms.rooms
  const rooms = content.rooms?.rooms || [];
  
  return (
    <div className="fixed inset-0 z-50 bg-stone-50 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-semibold text-stone-700">Rooms Page Preview</span>
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
            <h1 className="text-4xl md:text-5xl font-bold">{content.hero?.title || "Rooms"}</h1>
            <p className="mt-2 text-lg text-white/80">{content.hero?.subtitle || ""}</p>
            <p className="mt-3 text-sm text-white/70 max-w-2xl">{content.hero?.description || ""}</p>
          </div>
        </div>

        {/* Rooms List - Display ALL rooms */}
        {rooms && rooms.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-stone-800 text-center">{content.rooms?.title || "Our Rooms"}</h2>
            <p className="text-center text-stone-500 mt-1">{content.rooms?.subtitle || "Choose your perfect stay"}</p>
            
            <div className="space-y-12 mt-8">
              {rooms.map((room, index) => {
                const img = getImageUrl(room.image);
                const isLeft = index % 2 === 0;
                
                return (
                  <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${isLeft ? '' : 'lg:flex-row-reverse'}`}>
                    {/* Text Content */}
                    <div className={isLeft ? 'order-1' : 'order-2'}>
                      <h3 className="text-2xl font-bold text-stone-800">{room.name || "Room"}</h3>
                      <p className="text-emerald-600 font-medium">{room.subtitle || ""}</p>
                      <p className="text-stone-600 mt-3 leading-relaxed">
                        {room.description || "Comfortable room with modern amenities."}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-stone-500">
                        <span><Users className="inline h-4 w-4 mr-1" /> {room.guests || 2} Guests</span>
                        <span><Eye className="inline h-4 w-4 mr-1" /> {room.view || "Garden"}</span>
                        <span className="font-bold text-emerald-700">{room.price || "$120/night"}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(room.amenities || []).slice(0, 6).map((amenity, j) => (
                          <span key={j} className="text-xs bg-stone-100 px-2 py-1 rounded-full text-stone-600">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <button className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition text-sm">
                        {room.button_text || "Reserve a room"}
                      </button>
                    </div>
                    
                    {/* Image */}
                    <div className={isLeft ? 'order-2' : 'order-1'}>
                      {img ? (
                        <img 
                          src={img} 
                          alt={room.name || "Room"} 
                          className="rounded-2xl w-full h-80 object-cover shadow-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/600x400?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-full h-80 bg-stone-200 rounded-2xl flex items-center justify-center text-stone-400">
                          <BedDouble className="h-16 w-16" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BedDouble className="h-16 w-16 mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500">No rooms added yet.</p>
            <p className="text-sm text-stone-400">Add rooms in the editor to see them here.</p>
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

// ─── ROOMS LIST EDITOR ──────────────────────────────────────────────────────
function RoomsListEditor({ data, onChange, onImageUpload, isUploading }) {
  const addRoom = () => {
    const rooms = [...(data.rooms || [])];
    rooms.push({ 
      name: "", 
      subtitle: "", 
      description: "", 
      image: null, 
      guests: 2, 
      view: "", 
      amenities: [], 
      price: "", 
      button_text: "Reserve a room", 
      button_link: "/booking" 
    });
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

  const addAmenity = (index) => {
    const rooms = [...(data.rooms || [])];
    const amenities = [...(rooms[index].amenities || [])];
    amenities.push("");
    rooms[index].amenities = amenities;
    onChange("rooms", rooms);
  };

  const removeAmenity = (roomIndex, amenityIndex) => {
    const rooms = [...(data.rooms || [])];
    const amenities = [...(rooms[roomIndex].amenities || [])];
    amenities.splice(amenityIndex, 1);
    rooms[roomIndex].amenities = amenities;
    onChange("rooms", rooms);
  };

  const updateAmenity = (roomIndex, amenityIndex, value) => {
    const rooms = [...(data.rooms || [])];
    const amenities = [...(rooms[roomIndex].amenities || [])];
    amenities[amenityIndex] = value;
    rooms[roomIndex].amenities = amenities;
    onChange("rooms", rooms);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label><input type="text" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Section title..." /></div>
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label><input type="text" value={data.subtitle || ""} onChange={(e) => onChange("subtitle", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Section subtitle..." /></div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-stone-700">Rooms</label>
          <button onClick={addRoom} className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800 transition"><Plus size={14} /> Add Room</button>
        </div>
        <div className="space-y-6">
          {(data.rooms || []).map((room, index) => (
            <div key={index} className="relative rounded-xl border-2 border-stone-200 p-4 bg-stone-50 hover:border-emerald-300 transition">
              <button onClick={() => removeRoom(index)} className="absolute top-2 right-2 rounded-full bg-rose-100 p-1 text-rose-500 hover:bg-rose-200 transition"><X size={14} /></button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <input type="text" value={room.name || ""} onChange={(e) => updateRoom(index, "name", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Room name" />
                  <input type="text" value={room.subtitle || ""} onChange={(e) => updateRoom(index, "subtitle", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Subtitle" />
                  <textarea value={room.description || ""} onChange={(e) => updateRoom(index, "description", e.target.value)} rows={3} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-none transition" placeholder="Description" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" value={room.guests || ""} onChange={(e) => updateRoom(index, "guests", parseInt(e.target.value))} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Guests" />
                    <input type="text" value={room.view || ""} onChange={(e) => updateRoom(index, "view", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="View" />
                  </div>
                  <input type="text" value={room.price || ""} onChange={(e) => updateRoom(index, "price", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="$120/night" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={room.button_text || ""} onChange={(e) => updateRoom(index, "button_text", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Button text" />
                    <input type="text" value={room.button_link || ""} onChange={(e) => updateRoom(index, "button_link", e.target.value)} className="rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="/booking" />
                  </div>
                </div>
                <div className="space-y-3">
                  <ImageDropzone label="Room Image" small preview={room.image_preview || getImageUrl(room.image)} uploading={isUploading(index, "image")} height="h-32" onUpload={(file) => onImageUpload(file, index, "image")} onRemove={() => updateRoom(index, "image", null)} />
                  <div>
                    <label className="text-xs font-medium text-stone-600">Amenities</label>
                    <button onClick={() => addAmenity(index)} className="ml-2 text-xs text-emerald-600 hover:text-emerald-700"><Plus size={12} /> Add</button>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(room.amenities || []).map((amenity, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-1 bg-white rounded-full border border-stone-200 px-2 py-0.5">
                          <input type="text" value={amenity} onChange={(e) => updateAmenity(index, aIdx, e.target.value)} className="text-xs w-20 focus:outline-none" placeholder="Amenity" />
                          <button onClick={() => removeAmenity(index, aIdx)} className="text-rose-400 hover:text-rose-600"><X size={10} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {(!data.rooms || data.rooms.length === 0) && <p className="text-sm text-stone-400 text-center py-3">No rooms added. Click "Add Room" to create one.</p>}
      </div>
    </div>
  );
}

const sectionEditors = {
  hero: HeroEditor,
  rooms: RoomsListEditor,
};

const sectionMeta = {
  hero: { label: "Hero", blurb: "Page header", icon: Sun },
  rooms: { label: "Rooms List", blurb: "Room listings", icon: BedDouble },
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function RoomsSectionManager() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [uploading, setUploading] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => { fetchRoomsPage(); }, []);

  const fetchRoomsPage = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const headers = { Accept: "application/json", ...(token && { Authorization: `Bearer ${token}` }) };
      const res = await fetch(`${API_URL}/rooms`, { headers });
      const result = await res.json();
      
      if (result.success && result.data) {
        setPageData(result.data);
        const sections = Object.keys(result.data.content || {});
        if (sections.length > 0) setExpandedSections({ [sections[0]]: true });
      } else {
        setPageData({ 
          id: null, 
          slug: "rooms", 
          name: "Rooms", 
          content: DEFAULT_ROOMS_CONTENT, 
          seo: { title: "Rooms - Akagera Park Inn", description: "Comfortable rooms with breakfast included.", keywords: "Rooms, Akagera Park Inn" }, 
          is_active: true 
        });
        setExpandedSections({ hero: true });
      }
    } catch (err) { 
      console.error(err); 
      setError("Failed to load rooms page data"); 
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
        const itemsKey = "rooms";
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
        const itemsKey = "rooms";
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
      const url = isUpdate ? `${API_URL}/admin/rooms/pages/${pageData.id}` : `${API_URL}/admin/rooms/pages`;
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
        await fetchRoomsPage();
      } else if (result.errors) {
        setError(`Validation Error: ${Object.values(result.errors).flat().join(", ")}`);
      } else {
        setError(result.message || "Error saving rooms page");
      }
    } catch (err) { 
      console.error(err); 
      setError(err.message || "Failed to save rooms page"); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleReset = () => { 
    fetchRoomsPage(); 
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
        <p className="text-stone-500">No rooms page data found</p>
        <button onClick={fetchRoomsPage} className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800 transition">
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
              Rooms Page Manager
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
                <li>• Click "View Preview" to see how your page looks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && <RoomsPreview data={pageData.content} onClose={closePreview} />}
    </div>
  );
}