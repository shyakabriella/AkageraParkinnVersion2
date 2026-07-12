// src/pages/dashboard/ReviewsSection.jsx
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
  Star,
  Eye,
  User,
  MessageCircle,
  ArrowRight,
  Quote,
} from "lucide-react";

const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api").replace(/\/$/, "");
const APP_URL = API_URL.replace(/\/api$/, "");

const getImageUrl = (path) => {
  if (!path || typeof path !== 'string') return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/storage/")) return `${APP_URL}${path}`;
  if (path.startsWith("storage/")) return `${APP_URL}/${path}`;
  return `${APP_URL}/storage/${path}`;
};

const getToken = () => {
  return sessionStorage.getItem("token") || localStorage.getItem("token") || localStorage.getItem("auth_token");
};

const IMAGE_KEYS = new Set(["background_image", "image", "avatar_image", "avatar"]);

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

// ─── DEFAULT REVIEWS CONTENT ──────────────────────────────────────────────
const DEFAULT_REVIEWS_CONTENT = {
  hero: {
    title: "Guest Reviews",
    subtitle: "What our guests are saying.",
    description: "Beautiful rooms, amazing food, and exceptional hospitality — hear from guests who have stayed at Akagera Park Inn.",
    background_image: "/images/reviews/hero-bg.jpg",
  },
  reviews: {
    title: "Guest Reviews",
    subtitle: "What our guests are saying.",
    reviews: [
      {
        id: 1,
        name: "Sarah M.",
        location: "United Kingdom",
        rating: 5,
        review: "Beautiful rooms, amazing food, and exceptional hospitality. We loved every moment!",
        avatar: "/images/reviews/avatar-1.jpg",
        date: "2024-01-15",
      },
      {
        id: 2,
        name: "John D.",
        location: "United States",
        rating: 5,
        review: "Akagera Park Inn is a peaceful escape with stunning views and top-notch service. A perfect getaway!",
        avatar: "/images/reviews/avatar-2.jpg",
        date: "2024-01-20",
      },
      {
        id: 3,
        name: "Amina K.",
        location: "Kenya",
        rating: 5,
        review: "The volcanic stone designs and tranquil setting make Akagera Park Inn truly special.",
        avatar: "/images/reviews/avatar-3.jpg",
        date: "2024-02-01",
      },
    ],
  },
  banner: {
    title: "Ready to write your own?",
    subtitle: "The lake is waiting, the fire is lit, and the rangers know where the lions slept last night.",
    button_text: "Plan Your Escape",
    button_link: "/booking",
    background_image: "/images/reviews/banner-bg.jpg",
  },
};

// ─── IMAGE DROPZONE ──────────────────────────────────────────────────────────
function ImageDropzone({ label, preview, uploading, height, onUpload, onRemove, compact, small }) {
  const safePreview = preview && typeof preview === 'string' ? preview : null;
  
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-stone-700">{label}</label>
      <div className={`rounded-2xl border-4 border-dashed border-stone-300 bg-white ${small ? "p-2" : "p-4"} hover:border-emerald-500 transition`}>
        {safePreview ? (
          <div className="relative group">
            <img 
              src={safePreview} 
              alt={label} 
              className={`${height} w-full rounded-xl object-cover`} 
              onError={(e) => { e.target.src = "https://placehold.co/800x400?text=Image+Not+Found"; }} 
            />
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

// ─── REVIEWS PREVIEW ──────────────────────────────────────────────────────────
function ReviewsPreview({ data, onClose }) {
  const content = data || {};
  const hero = content.hero || {};
  const reviewsSection = content.reviews || {};
  const banner = content.banner || {};
  const reviews = reviewsSection.reviews || [];

  return (
    <div className="fixed inset-0 z-50 bg-stone-50 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-semibold text-stone-700">Reviews Preview</span>
            <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">Website View</span>
          </div>
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition text-sm font-medium">
            <X className="h-4 w-4" /> Close Preview
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          {hero.background_image && typeof hero.background_image === 'string' ? (
            <img src={getImageUrl(hero.background_image)} alt="Hero" className="w-full h-[350px] object-cover" />
          ) : (
            <div className="w-full h-[350px] bg-gradient-to-r from-emerald-800 to-emerald-600" />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold">{hero.title || "Guest Reviews"}</h1>
            <p className="mt-2 text-lg text-white/80">{hero.subtitle || ""}</p>
            <p className="mt-3 text-sm text-white/70 max-w-2xl">{hero.description || ""}</p>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-stone-800 text-center">{reviewsSection.title || "Guest Reviews"}</h2>
          <p className="text-center text-stone-500 mt-1">{reviewsSection.subtitle || "What our guests are saying."}</p>
          
          {reviews && reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {reviews.map((review) => {
                // Get avatar URL - check both possible field names
                const avatarUrl = getImageUrl(review.avatar) || getImageUrl(review.avatar_image);
                return (
                  <div key={review.id} className="bg-white rounded-2xl p-6 shadow-md border border-stone-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={review.name} className="w-14 h-14 rounded-full object-cover" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                          <User className="h-7 w-7 text-emerald-600" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-stone-800">{review.name}</h4>
                        <p className="text-sm text-stone-500">{review.location || "Guest"}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < (review.rating || 5) ? "text-amber-400 fill-amber-400" : "text-stone-300"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <Quote className="h-6 w-6 text-emerald-200 mb-2" />
                    <p className="text-stone-600 leading-relaxed">"{review.review}"</p>
                    {review.date && (
                      <p className="text-xs text-stone-400 mt-3">{new Date(review.date).toLocaleDateString()}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 mx-auto text-stone-300 mb-4" />
              <p className="text-stone-500">No reviews added yet.</p>
              <p className="text-sm text-stone-400">Add reviews in the editor to see them here.</p>
            </div>
          )}
        </div>

        {/* Banner */}
        {banner && (
          <div className="relative rounded-2xl overflow-hidden">
            {banner.background_image && typeof banner.background_image === 'string' ? (
              <img src={getImageUrl(banner.background_image)} alt="Banner" className="w-full h-[300px] object-cover" />
            ) : (
              <div className="w-full h-[300px] bg-gradient-to-r from-amber-800 to-amber-600" />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
              <h2 className="text-3xl md:text-4xl font-bold">{banner.title || "Ready to write your own?"}</h2>
              <p className="mt-2 text-lg text-white/80 max-w-2xl">{banner.subtitle || ""}</p>
              <button className="mt-6 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition text-sm flex items-center gap-2">
                {banner.button_text || "Plan Your Escape"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
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
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label>
            <input type="text" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Title..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label>
            <input type="text" value={data.subtitle || ""} onChange={(e) => onChange("subtitle", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Subtitle..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Description</label>
            <textarea value={data.description || ""} onChange={(e) => onChange("description", e.target.value)} rows={3} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-y transition" placeholder="Description..." />
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

// ─── REVIEWS LIST EDITOR ──────────────────────────────────────────────────────
function ReviewsListEditor({ data, onChange, onImageUpload, isUploading }) {
  const addReview = () => {
    const reviews = [...(data.reviews || [])];
    const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id || 0)) + 1 : 1;
    reviews.push({ 
      id: newId,
      name: "", 
      location: "", 
      rating: 5,
      review: "", 
      avatar: null, 
      date: new Date().toISOString().split('T')[0],
    });
    onChange("reviews", reviews);
  };

  const removeReview = (index) => {
    const reviews = [...(data.reviews || [])];
    reviews.splice(index, 1);
    onChange("reviews", reviews);
  };

  const updateReview = (index, field, value) => {
    const reviews = [...(data.reviews || [])];
    reviews[index] = { ...reviews[index], [field]: value };
    onChange("reviews", reviews);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">Section Title</label>
          <input type="text" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Reviews section title..." />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">Section Subtitle</label>
          <input type="text" value={data.subtitle || ""} onChange={(e) => onChange("subtitle", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Reviews section subtitle..." />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-stone-700">Reviews</label>
          <button onClick={addReview} className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800 transition">
            <Plus size={14} /> Add Review
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data.reviews || []).map((review, index) => {
            // ✅ FIX: Get avatar from both possible field names
            const avatarValue = review.avatar || review.avatar_image || null;
            const avatarPreview = review.avatar_preview || (avatarValue && typeof avatarValue === 'string' ? getImageUrl(avatarValue) : null);
            
            return (
              <div key={index} className="relative rounded-xl border-2 border-stone-200 p-4 bg-stone-50 hover:border-emerald-300 transition">
                <button onClick={() => removeReview(index)} className="absolute top-2 right-2 rounded-full bg-rose-100 p-1 text-rose-500 hover:bg-rose-200 transition z-10">
                  <X size={14} />
                </button>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ImageDropzone 
                      label="Avatar" 
                      small 
                      preview={avatarPreview}
                      uploading={isUploading(index, "avatar")} 
                      height="h-20 w-20 rounded-full" 
                      onUpload={(file) => onImageUpload(file, index, "avatar")} 
                      onRemove={() => updateReview(index, "avatar", null)} 
                    />
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={review.name || ""} 
                        onChange={(e) => updateReview(index, "name", e.target.value)} 
                        className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" 
                        placeholder="Guest name" 
                      />
                      <input 
                        type="text" 
                        value={review.location || ""} 
                        onChange={(e) => updateReview(index, "location", e.target.value)} 
                        className="w-full mt-2 rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" 
                        placeholder="Location" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-stone-600">Rating</label>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => updateReview(index, "rating", star)}
                          className="focus:outline-none"
                        >
                          <Star className={`h-5 w-5 ${star <= (review.rating || 5) ? "text-amber-400 fill-amber-400" : "text-stone-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea 
                    value={review.review || ""} 
                    onChange={(e) => updateReview(index, "review", e.target.value)} 
                    rows={3} 
                    className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-none transition" 
                    placeholder="Write the review..." 
                  />
                  
                  <input 
                    type="date" 
                    value={review.date || ""} 
                    onChange={(e) => updateReview(index, "date", e.target.value)} 
                    className="w-full rounded-xl border-2 border-stone-200 px-3 py-2 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" 
                  />
                </div>
              </div>
            );
          })}
        </div>
        {(!data.reviews || data.reviews.length === 0) && (
          <p className="text-sm text-stone-400 text-center py-3">No reviews added. Click "Add Review" to create one.</p>
        )}
      </div>
    </div>
  );
}

// ─── BANNER EDITOR ──────────────────────────────────────────────────────────────
function BannerEditor({ data, onChange, onImageUpload, onRemoveImage, isUploading }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label>
            <input type="text" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Banner title..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label>
            <textarea value={data.subtitle || ""} onChange={(e) => onChange("subtitle", e.target.value)} rows={2} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-y transition" placeholder="Banner subtitle..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Button Text</label>
              <input type="text" value={data.button_text || ""} onChange={(e) => onChange("button_text", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="Plan Your Escape" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Button Link</label>
              <input type="text" value={data.button_link || ""} onChange={(e) => onChange("button_link", e.target.value)} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition" placeholder="/booking" />
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

const sectionEditors = {
  hero: HeroEditor,
  reviews: ReviewsListEditor,
  banner: BannerEditor,
};

const sectionMeta = {
  hero: { label: "Hero", blurb: "Page header", icon: Sun },
  reviews: { label: "Reviews List", blurb: "Guest reviews", icon: Star },
  banner: { label: "Banner", blurb: "Call to action", icon: MessageCircle },
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function ReviewsSection() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [uploading, setUploading] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => { fetchReviewsPage(); }, []);

  const fetchReviewsPage = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const headers = { Accept: "application/json", ...(token && { Authorization: `Bearer ${token}` }) };
      const res = await fetch(`${API_URL}/reviews`, { headers });
      const result = await res.json();
      
      if (result.success && result.data) {
        setPageData(result.data);
        const sections = Object.keys(result.data.content || {});
        if (sections.length > 0) setExpandedSections({ [sections[0]]: true });
      } else {
        setPageData({ 
          id: null, 
          slug: "reviews", 
          name: "Reviews", 
          content: DEFAULT_REVIEWS_CONTENT, 
          seo: { title: "Guest Reviews - Akagera Park Inn", description: "Read what our guests are saying.", keywords: "Reviews, Akagera Park Inn" }, 
          is_active: true 
        });
        setExpandedSections({ hero: true });
      }
    } catch (err) { 
      console.error(err); 
      setError("Failed to load reviews page data"); 
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
        const itemsKey = "reviews";
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
        const itemsKey = "reviews";
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
      const url = isUpdate ? `${API_URL}/admin/reviews/pages/${pageData.id}` : `${API_URL}/admin/reviews/pages`;
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
        await fetchReviewsPage();
      } else if (result.errors) {
        setError(`Validation Error: ${Object.values(result.errors).flat().join(", ")}`);
      } else {
        setError(result.message || "Error saving reviews page");
      }
    } catch (err) { 
      console.error(err); 
      setError(err.message || "Failed to save reviews page"); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleReset = () => { 
    fetchReviewsPage(); 
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
        <p className="text-stone-500">No reviews page data found</p>
        <button onClick={fetchReviewsPage} className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800 transition">
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
              Reviews Manager
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
              const meta = sectionMeta[sectionName] || { label: sectionName, blurb: "", icon: Star };
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
                <li>• Expand a section to edit just that part</li>
                <li>• Each review can have a name, location, rating, and avatar</li>
                <li>• Click on stars to set the rating for each review</li>
                <li>• The banner section is a call-to-action at the bottom</li>
                <li>• Click "View Preview" to see how your reviews page looks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && <ReviewsPreview data={pageData.content} onClose={closePreview} />}
    </div>
  );
}